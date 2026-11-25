import { ChatAttachment, Conversation } from '../types/guia';

const CONVERSATIONS_STORAGE_KEY = 'lia_conversations_v1';
const MAX_STORED_CONVERSATIONS = 40;

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Conversation =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Conversation).id === 'string' &&
        typeof (item as Conversation).title === 'string' &&
        Array.isArray((item as Conversation).messages)
    );
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    // Strip heavy base64 data & error placeholders before persisting locally
    const sanitized: Conversation[] = conversations
      .slice(0, MAX_STORED_CONVERSATIONS)
      .map((conv) => ({
        ...conv,
        messages: conv.messages
          .filter((m) => !m.isError)
          .map((m) => ({
            ...m,
            attachments: m.attachments?.map((att) => ({
              id: att.id,
              name: att.name,
              mimeType: att.mimeType,
              data: '',
            })),
          })),
      }))
      .filter((conv) => conv.messages.length > 0);

    localStorage.setItem(
      CONVERSATIONS_STORAGE_KEY,
      JSON.stringify(sanitized)
    );
  } catch {
    // Ignore quota or private-browsing storage errors gracefully
  }
}

export function deriveConversationTitle(
  text: string,
  attachments?: ChatAttachment[]
): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length > 0) {
    return clean.length > 46 ? `${clean.slice(0, 45).trimEnd()}…` : clean;
  }
  if (attachments && attachments.length > 0) {
    return `Arquivo: ${attachments[0].name}`;
  }
  return 'Nova conversa';
}

export function formatShortDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const isSameDay =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isSameDay) {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  } catch {
    return '';
  }
}
