import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Check,
  Copy,
  FileText,
  Paperclip,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import {
  ChatAttachment,
  ChatMessage,
  JourneyStage,
  JourneyStageId,
} from '../types/guia';

interface ChatWorkspaceProps {
  stages: JourneyStage[];
  selectedStageId: JourneyStageId;
  onSelectStage: (stageId: JourneyStageId) => void;
  messages: ChatMessage[];
  isStreaming: boolean;
  errorMessage: string | null;
  onSendMessage: (text: string, attachments: ChatAttachment[]) => void;
  onClearConversation: () => void;
  onOpenEmergencyModal: () => void;
}

const ACCEPTED_FILE_TYPES =
  'image/jpeg,image/png,image/webp,image/gif,application/pdf,text/plain';
const MAX_FILE_BYTES = 8 * 1024 * 1024;

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Falha ao ler arquivo.'));
    reader.readAsDataURL(file);
  });
}

export function ChatWorkspace({
  stages,
  selectedStageId,
  onSelectStage,
  messages,
  isStreaming,
  errorMessage,
  onSendMessage,
  onClearConversation,
  onOpenEmergencyModal,
}: ChatWorkspaceProps) {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentStage =
    stages.find((stage) => stage.id === selectedStageId) ?? stages[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const remainingSlots = 3 - attachments.length;
    if (remainingSlots <= 0) {
      setFileError('Você pode anexar até 3 arquivos por mensagem.');
      e.target.value = '';
      return;
    }

    const nextAttachments: ChatAttachment[] = [];
    for (const file of files.slice(0, remainingSlots)) {
      if (file.size > MAX_FILE_BYTES) {
        setFileError(
          `O arquivo "${file.name}" passa de 8 MB. Envie uma imagem ou PDF menor.`
        );
        continue;
      }

      try {
        const data = await readFileAsBase64(file);
        const isImage = file.type.startsWith('image/');
        nextAttachments.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          data,
          previewUrl: isImage
            ? `data:${file.type};base64,${data}`
            : undefined,
        });
      } catch {
        setFileError(`Não consegui ler "${file.name}". Tente outro arquivo.`);
      }
    }

    if (nextAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...nextAttachments]);
    }
    e.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
    setFileError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStreaming) return;
    const trimmed = inputText.trim();
    if (!trimmed && attachments.length === 0) return;
    onSendMessage(trimmed, attachments);
    setInputText('');
    setAttachments([]);
    setFileError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 2000);
    } catch {
      // Ignore clipboard failures silently
    }
  };

  return (
    <section
      aria-label="Conversa com a Lia"
      className="bg-white border border-[var(--lia-border)] rounded-2xl flex flex-col min-h-[540px] lg:h-[calc(100vh-11rem)]"
    >
      {/* Chat Pane Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-[var(--lia-border)] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--lia-ink)]">
            Conversar com a Lia
          </h2>
          <p className="text-xs text-[var(--lia-ink-muted)] mt-0.5">
            <span>Fase selecionada: {currentStage.label}</span>
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            <span>Orientação educativa, não substitui consulta</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClearConversation}
              disabled={isStreaming}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-xl border border-[var(--lia-border)] bg-[var(--lia-surface-soft)] hover:bg-[var(--lia-surface-hover)] text-xs font-medium text-[var(--lia-ink)] whitespace-nowrap transition-colors disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lia-accent)]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Nova conversa</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Compact Stage Switcher */}
      <div className="lg:hidden px-4 py-2.5 border-b border-[var(--lia-border)] bg-[var(--lia-surface-soft)] flex items-center gap-2 overflow-x-auto">
        {stages.map((stage) => {
          const isSelected = stage.id === selectedStageId;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage(stage.id)}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[var(--lia-accent)] text-white'
                  : 'bg-white border border-[var(--lia-border)] text-[var(--lia-ink-secondary)]'
              }`}
            >
              {stage.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
        {messages.length === 0 ? (
          <div className="max-w-xl mx-auto py-4 sm:py-8 space-y-6">
            <div className="bg-[var(--lia-accent-soft)] border border-[var(--lia-border-accent)] rounded-2xl p-5 sm:p-6">
              <p className="text-xs font-semibold text-[var(--lia-accent-strong)] mb-1.5">
                Olá, que bom ter você aqui
              </p>
              <p className="text-sm sm:text-base text-[var(--lia-ink)] leading-relaxed">
                Eu sou a <strong>Lia</strong>. Estou aqui para conversar com
                calma e sem julgamentos sobre gravidez, parto, pós-parto,
                amamentação, sono, cuidados e os primeiros anos da criança (0 a
                5 anos).
              </p>
              <p className="text-xs sm:text-sm text-[var(--lia-ink-secondary)] leading-relaxed mt-3">
                Para dúvidas sobre remédios, doses ou sintomas, lembre sempre de
                falar com o pediatra, obstetra ou equipe de saúde. Em qualquer
                sinal de urgência,{' '}
                <button
                  type="button"
                  onClick={onOpenEmergencyModal}
                  className="text-[#B83232] font-semibold underline underline-offset-2 cursor-pointer"
                >
                  consulte os telefones de emergência (192 / 188)
                </button>
                .
              </p>
            </div>

            <div className="lg:hidden space-y-2">
              <p className="text-xs font-semibold text-[var(--lia-ink-secondary)]">
                Sugestões para {currentStage.shortLabel.toLowerCase()}
              </p>
              {currentStage.starterQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => onSendMessage(question, [])}
                  className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-white border border-[var(--lia-border)] hover:border-[var(--lia-accent)] text-left text-sm text-[var(--lia-ink)] transition-colors cursor-pointer"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3.5 ${
                    isUser
                      ? 'bg-[var(--lia-accent)] text-white'
                      : msg.isError
                        ? 'bg-[#FDF3F3] border border-[#EBC7C7] text-[#7A2020]'
                        : 'bg-[var(--lia-surface-soft)] border border-[var(--lia-border)] text-[var(--lia-ink)]'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <span className="text-xs font-semibold text-[var(--lia-accent-strong)]">
                        Lia
                      </span>
                      {!msg.isError && msg.text && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          aria-label="Copiar resposta"
                          className="inline-flex items-center gap-1 text-[11px] text-[var(--lia-ink-muted)] hover:text-[var(--lia-ink)] cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--lia-accent)] rounded"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[var(--lia-accent)]" />
                              <span>Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-2.5 flex flex-wrap gap-2">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className={`rounded-xl overflow-hidden border ${
                            isUser
                              ? 'border-white/25 bg-white/10'
                              : 'border-[var(--lia-border)] bg-white'
                          }`}
                        >
                          {att.previewUrl ? (
                            <img
                              src={att.previewUrl}
                              alt={att.name}
                              className="max-h-40 max-w-[200px] object-cover"
                            />
                          ) : (
                            <div className="px-3 py-2 flex items-center gap-2 text-xs">
                              <FileText className="w-4 h-4 shrink-0" />
                              <span className="truncate max-w-[160px]">
                                {att.name}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isUser ? (
                    <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  ) : (
                    <div className="lia-markdown text-sm sm:text-[15px] leading-relaxed">
                      {msg.text ? (
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      ) : (
                        <span className="text-[var(--lia-ink-muted)]">
                          Lia está preparando a resposta...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Inline Errors */}
      {(errorMessage || fileError) && (
        <div
          role="alert"
          className="mx-4 sm:mx-6 mb-2 px-4 py-2.5 rounded-xl bg-[#FDF3F3] border border-[#EBC7C7] text-xs sm:text-sm text-[#8F2424]"
        >
          {fileError || errorMessage}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 border-t border-[var(--lia-border)] bg-[var(--lia-surface-soft)] rounded-b-2xl"
      >
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-[var(--lia-border)] text-xs text-[var(--lia-ink)]"
              >
                {att.previewUrl ? (
                  <img
                    src={att.previewUrl}
                    alt={att.name}
                    className="w-7 h-7 rounded object-cover"
                  />
                ) : (
                  <FileText className="w-4 h-4 text-[var(--lia-accent)]" />
                )}
                <span className="max-w-[140px] truncate">{att.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(att.id)}
                  aria-label={`Remover ${att.name}`}
                  className="p-1 text-[var(--lia-ink-muted)] hover:text-[#B83232] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            multiple
            onChange={handleFileChange}
            className="hidden"
            aria-label="Anexar imagem ou arquivo"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming || attachments.length >= 3}
            title="Anexar foto ou arquivo (sem dados pessoais)"
            aria-label="Anexar foto ou arquivo"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[var(--lia-border)] bg-white hover:bg-[var(--lia-surface-hover)] text-[var(--lia-ink-secondary)] transition-colors disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lia-accent)]"
          >
            <Paperclip className="w-5 h-5" aria-hidden="true" />
          </button>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Escreva sua dúvida com calma..."
            aria-label="Mensagem para a Lia"
            className="flex-1 min-h-[44px] max-h-32 px-4 py-2.5 rounded-xl border border-[var(--lia-border)] bg-white text-base sm:text-sm text-[var(--lia-ink)] placeholder:text-[var(--lia-ink-muted)] resize-y focus:outline-none focus:border-[var(--lia-accent)]"
          />

          <button
            type="submit"
            disabled={
              isStreaming ||
              (!inputText.trim() && attachments.length === 0)
            }
            aria-label="Enviar mensagem"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--lia-accent)] hover:bg-[var(--lia-accent-hover)] text-white text-sm font-medium inline-flex items-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lia-accent)]"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">
              {isStreaming ? 'Respondendo...' : 'Enviar'}
            </span>
          </button>
        </div>

        <p className="mt-2 text-[11px] text-[var(--lia-ink-muted)]">
          Privacidade: suas mensagens ficam só nesta sessão. Não envie CPF,
          endereço ou exames com nome completo.
        </p>
      </form>
    </section>
  );
}
