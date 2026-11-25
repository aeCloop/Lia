import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import type { Content, Part } from '@google/genai';
import { buildGuiaSystemInstruction } from './guiaPrompt.ts';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'text/plain',
]);

const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024; // 8 MB
const MAX_MESSAGES = 30;
const MAX_TEXT_LENGTH = 8000;

interface IncomingAttachment {
  name?: unknown;
  mimeType?: unknown;
  data?: unknown;
}

interface IncomingMessage {
  role?: unknown;
  text?: unknown;
  attachments?: unknown;
}

export interface HttpLikeRequest {
  method?: string;
  body?: unknown;
}

export interface HttpLikeResponse {
  headersSent: boolean;
  status: (code: number) => HttpLikeResponse;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string) => void;
  flushHeaders?: () => void;
  write: (chunk: string) => boolean;
  end: () => void;
}

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function isTransientError(err: unknown): boolean {
  const numericStatus =
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    typeof (err as { status?: unknown }).status === 'number'
      ? (err as { status: number }).status
      : undefined;
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();
  return (
    numericStatus === 503 ||
    numericStatus === 500 ||
    lower.includes('unavailable') ||
    lower.includes('high demand') ||
    lower.includes('"code": 503') ||
    lower.includes('"code":503')
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseErrorStatusAndMessage(err: unknown): {
  status: number;
  message: string;
} {
  const numericStatus =
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    typeof (err as { status?: unknown }).status === 'number'
      ? (err as { status: number }).status
      : undefined;
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  console.error('Lia /api/chat error:', {
    status: numericStatus,
    message: raw.slice(0, 300),
  });

  if (
    numericStatus === 401 ||
    numericStatus === 403 ||
    lower.includes('api_key_invalid') ||
    lower.includes('permission_denied') ||
    lower.includes('api key')
  ) {
    return {
      status: 403,
      message:
        'Não foi possível autenticar com a chave do Gemini. Verifique a variável GEMINI_API_KEY configurada no servidor.',
    };
  }
  if (numericStatus === 429 || lower.includes('resource_exhausted')) {
    return {
      status: 429,
      message:
        'Muitas solicitações seguidas no momento. Aguarde alguns segundos e tente enviar sua pergunta novamente.',
    };
  }
  if (numericStatus === 404 || lower.includes('not_found')) {
    return {
      status: 502,
      message:
        'O modelo de conversa está temporariamente indisponível. Tente novamente em instantes.',
    };
  }
  if (
    numericStatus === 503 ||
    lower.includes('unavailable') ||
    lower.includes('high demand')
  ) {
    return {
      status: 503,
      message:
        'O serviço está com muita procura neste momento. Aguarde alguns segundos e tente novamente.',
    };
  }
  if (numericStatus === 400) {
    return {
      status: 400,
      message:
        'Não foi possível processar o formato desta solicitação. Tente enviar novamente.',
    };
  }
  return {
    status: 502,
    message:
      'Não consegui concluir sua resposta agora. Verifique sua conexão e tente novamente.',
  };
}

export async function handleChatRequest(
  req: HttpLikeRequest,
  res: HttpLikeResponse
): Promise<void> {
  if (req.method && req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido. Use POST.' });
    return;
  }

  const ai = getGenAIClient();
  if (!ai) {
    res.status(503).json({
      error:
        'A chave de API do Gemini (GEMINI_API_KEY) não está configurada nas variáveis de ambiente do servidor.',
    });
    return;
  }

  let parsedBody: unknown = req.body;
  if (typeof parsedBody === 'string') {
    try {
      parsedBody = JSON.parse(parsedBody);
    } catch {
      res.status(400).json({ error: 'Corpo da requisição em JSON inválido.' });
      return;
    }
  }

  const body = parsedBody as { stage?: unknown; messages?: unknown } | null;
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    res
      .status(400)
      .json({ error: 'Envie pelo menos uma mensagem para conversar com a Lia.' });
    return;
  }

  const stage = typeof body.stage === 'string' ? body.stage : undefined;
  const rawMessages = body.messages.slice(-MAX_MESSAGES) as IncomingMessage[];
  const contents: Content[] = [];

  for (const msg of rawMessages) {
    if (!msg || (msg.role !== 'user' && msg.role !== 'model')) {
      res.status(400).json({ error: 'Formato de mensagem inválido.' });
      return;
    }

    const text =
      typeof msg.text === 'string'
        ? msg.text.slice(0, MAX_TEXT_LENGTH).trim()
        : '';
    const parts: Part[] = [];

    if (Array.isArray(msg.attachments)) {
      for (const rawAtt of msg.attachments.slice(0, 3) as IncomingAttachment[]) {
        if (
          !rawAtt ||
          typeof rawAtt.mimeType !== 'string' ||
          typeof rawAtt.data !== 'string'
        ) {
          res.status(400).json({ error: 'Anexo com formato inválido.' });
          return;
        }
        if (!ALLOWED_MIME_TYPES.has(rawAtt.mimeType)) {
          res.status(400).json({
            error:
              'Tipo de arquivo não suportado. Envie imagens (JPG, PNG, WebP), PDF ou texto.',
          });
          return;
        }
        const base64Clean = rawAtt.data.replace(/^data:[^;]+;base64,/, '');
        const estimatedBytes = Math.ceil((base64Clean.length * 3) / 4);
        if (estimatedBytes > MAX_ATTACHMENT_BYTES) {
          res.status(400).json({
            error: 'O arquivo anexado excede o limite de 8 MB.',
          });
          return;
        }
        parts.push({
          inlineData: {
            mimeType: rawAtt.mimeType,
            data: base64Clean,
          },
        });
      }
    }

    if (text.length > 0) {
      parts.push({ text });
    } else if (parts.length > 0 && msg.role === 'user') {
      parts.push({
        text: 'Analise este arquivo anexado seguindo todas as orientações da Lia, com cuidado e sem diagnosticar.',
      });
    }

    if (parts.length === 0) {
      continue;
    }

    contents.push({
      role: msg.role,
      parts,
    });
  }

  if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
    res
      .status(400)
      .json({ error: 'Escreva uma dúvida ou anexe um arquivo para enviar.' });
    return;
  }

  try {
    const systemInstruction = buildGuiaSystemInstruction(stage);
    let stream: Awaited<
      ReturnType<typeof ai.models.generateContentStream>
    > | null = null;
    const retryDelays = [600];

    for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
      try {
        stream = await ai.models.generateContentStream({
          model: 'gemini-4-hydrogen',
          contents,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });
        break;
      } catch (attemptErr) {
        if (attempt < retryDelays.length && isTransientError(attemptErr)) {
          await sleep(retryDelays[attempt]);
          continue;
        }
        throw attemptErr;
      }
    }

    if (!stream) {
      throw new Error('Falha ao iniciar fluxo de resposta.');
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    for await (const chunk of stream) {
      const textChunk = chunk.text;
      if (textChunk) {
        res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    const { status, message } = parseErrorStatusAndMessage(err);
    if (!res.headersSent) {
      res.status(status).json({ error: message });
    } else {
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.end();
    }
  }
}
