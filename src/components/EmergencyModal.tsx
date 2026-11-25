import { useEffect } from 'react';
import { PhoneCall, X } from 'lucide-react';
import { EMERGENCY_CHANNELS } from '../data/guiaContent';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToAlerts: () => void;
}

export function EmergencyModal({
  isOpen,
  onClose,
  onGoToAlerts,
}: EmergencyModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl border border-[var(--lia-border)] max-h-[90vh] overflow-y-auto p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--lia-border)]">
          <div>
            <p className="text-xs font-semibold text-[#B83232]">
              Atendimento imediato e apoio
            </p>
            <h2
              id="emergency-modal-title"
              className="font-display text-xl sm:text-2xl font-semibold text-[var(--lia-ink)] mt-0.5"
            >
              Canais de emergência no Brasil
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de emergência"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[var(--lia-ink-muted)] hover:bg-[var(--lia-surface-soft)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-[var(--lia-ink-secondary)] leading-relaxed">
          Em qualquer situação grave na gestação, no pós-parto ou com o bebê,
          procure atendimento de urgência ou ligue imediatamente para o SAMU.
        </p>

        <div className="mt-4 space-y-3">
          {EMERGENCY_CHANNELS.map((channel) => (
            <div
              key={channel.id}
              className="p-3.5 rounded-xl bg-[var(--lia-surface-soft)] border border-[var(--lia-border)] flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-[var(--lia-ink)]">
                  {channel.name}
                </h3>
                <p className="text-xs text-[var(--lia-ink-secondary)] mt-0.5 leading-snug">
                  {channel.whenToCall}
                </p>
              </div>
              <a
                href={channel.telHref}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#B83232] hover:bg-[#9E2828] text-white text-xs sm:text-sm font-semibold tabular-nums inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <PhoneCall className="w-4 h-4" aria-hidden="true" />
                <span>{channel.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-[var(--lia-border)] flex flex-col sm:flex-row gap-2.5 justify-end">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToAlerts();
            }}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-[var(--lia-border)] bg-white hover:bg-[var(--lia-surface-soft)] text-sm font-medium text-[var(--lia-ink)] cursor-pointer"
          >
            Ver lista completa de sinais de alerta
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[var(--lia-accent)] hover:bg-[var(--lia-accent-hover)] text-white text-sm font-medium cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
