import { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import { Conversation, JourneyStage } from '../types/guia';
import { formatShortDate } from '../utils/conversationStorage';
import { PWAInstallButton } from './PWAInstallBanner';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  stages: JourneyStage[];
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onClearAllConversations: () => void;
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  stages,
  isMobileOpen,
  onCloseMobile,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onClearAllConversations,
}: ConversationSidebarProps) {
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const stageLabelMap = new Map(stages.map((s) => [s.id, s.shortLabel]));

  const handleShareApp = async () => {
    const shareUrl = window.location.origin;
    const shareData = {
      title: 'Lia — Apoio à Maternidade e Paternidade',
      text: 'Conheça a Lia, uma assistente acolhedora para pais, mães e cuidadores de primeira viagem (do planejamento aos 5 anos).',
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // User cancelled or share failed; fall through to clipboard
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareFeedback('Link copiado!');
      setTimeout(() => setShareFeedback(null), 2500);
    } catch {
      setShareFeedback('Copie o link da barra do navegador');
      setTimeout(() => setShareFeedback(null), 3000);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[var(--lia-border)]">
      {/* Top Action */}
      <div className="p-4 border-b border-[var(--lia-border)] flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            onNewConversation();
            onCloseMobile();
          }}
          className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--lia-accent)] hover:bg-[var(--lia-accent-hover)] text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lia-accent)]"
        >
          <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Nova conversa</span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Fechar histórico"
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[var(--lia-ink-muted)] hover:bg-[var(--lia-surface-soft)] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-2 py-1.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--lia-ink-muted)]">
            Histórico neste aparelho
          </span>
          {conversations.length > 0 && (
            <span className="text-xs text-[var(--lia-ink-muted)] tabular-nums">
              {conversations.length}
            </span>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="px-3 py-6 text-center rounded-xl bg-[var(--lia-surface-soft)] border border-[var(--lia-border)]">
            <MessageSquare
              className="w-6 h-6 text-[var(--lia-ink-muted)] mx-auto mb-2"
              aria-hidden="true"
            />
            <p className="text-xs text-[var(--lia-ink-secondary)] leading-relaxed">
              Suas conversas ficam salvas apenas no navegador deste aparelho.
            </p>
          </div>
        ) : (
          <ul className="space-y-1" aria-label="Conversas anteriores">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const stageName = stageLabelMap.get(conv.stageId) ?? 'Geral';
              return (
                <li
                  key={conv.id}
                  className={`group flex items-center gap-1 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[var(--lia-accent-soft)] border border-[var(--lia-border-accent)]'
                      : 'border border-transparent hover:bg-[var(--lia-surface-soft)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectConversation(conv.id);
                      onCloseMobile();
                    }}
                    className="flex-1 min-w-0 min-h-[48px] px-3 py-2 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[var(--lia-accent)] rounded-xl"
                  >
                    <p
                      className={`text-sm truncate ${
                        isActive
                          ? 'font-semibold text-[var(--lia-accent-strong)]'
                          : 'font-medium text-[var(--lia-ink)]'
                      }`}
                    >
                      {conv.title}
                    </p>
                    <p className="text-[11px] text-[var(--lia-ink-muted)] mt-0.5 truncate tabular-nums">
                      <span>{stageName}</span>
                      <span aria-hidden="true" className="mx-1">
                        ·
                      </span>
                      <span>{formatShortDate(conv.updatedAt)}</span>
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    aria-label={`Apagar conversa ${conv.title}`}
                    title="Apagar conversa"
                    className="min-h-[40px] min-w-[40px] mr-1 flex items-center justify-center rounded-lg text-[var(--lia-ink-muted)] hover:text-[#B83232] hover:bg-white/70 opacity-80 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Bottom Actions: Install PWA + Share + Clear All */}
      <div className="p-3 border-t border-[var(--lia-border)] space-y-2 bg-[var(--lia-surface-soft)]">
        <div className="w-full [&>button]:w-full [&>button]:justify-center">
          <PWAInstallButton />
        </div>

        <button
          type="button"
          onClick={() => void handleShareApp()}
          className="w-full min-h-[42px] px-3.5 py-2 rounded-xl border border-[var(--lia-border)] bg-white hover:bg-[var(--lia-surface-hover)] text-xs font-medium text-[var(--lia-ink)] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-[var(--lia-accent)]" aria-hidden="true" />
          <span>{shareFeedback || 'Compartilhar link da Lia'}</span>
        </button>

        {conversations.length > 0 && (
          <div className="pt-1">
            {!confirmClearAll ? (
              <button
                type="button"
                onClick={() => setConfirmClearAll(true)}
                className="w-full min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium text-[var(--lia-ink-muted)] hover:text-[#B83232] hover:bg-white transition-colors cursor-pointer"
              >
                Apagar todo o histórico local
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearAllConversations();
                    setConfirmClearAll(false);
                  }}
                  className="flex-1 min-h-[38px] px-3 py-1.5 rounded-xl bg-[#B83232] text-white text-xs font-medium cursor-pointer"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClearAll(false)}
                  className="flex-1 min-h-[38px] px-3 py-1.5 rounded-xl border border-[var(--lia-border)] bg-white text-xs font-medium text-[var(--lia-ink)] cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent left sidebar */}
      <aside
        aria-label="Histórico de conversas"
        className="hidden lg:block w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16"
      >
        {sidebarContent}
      </aside>

      {/* Mobile slide-over drawer */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Histórico de conversas"
          className="lg:hidden fixed inset-0 z-50 flex"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-80 max-w-[85vw] h-full shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
