import { useEffect, useState } from 'react';
import { Download, Smartphone, WifiOff, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const FIRST_VISIT_DISMISSED_KEY = 'lia_pwa_first_visit_dismissed';

function InstallInstructionsModal({
  isOpen,
  isIOS,
  onClose,
}: {
  isOpen: boolean;
  isIOS: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-guide-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-[var(--lia-border)] p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--lia-border)]">
          <div>
            <p className="text-xs font-medium text-[var(--lia-accent)]">
              Aplicativo instalado no aparelho
            </p>
            <h2
              id="pwa-guide-title"
              className="font-display text-xl font-semibold text-[var(--lia-ink)] mt-0.5"
            >
              Como baixar a Lia (PWA)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar instruções"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[var(--lia-ink-muted)] hover:bg-[var(--lia-surface-soft)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm text-[var(--lia-ink-secondary)] leading-relaxed">
          {isIOS ? (
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Toque no botão <strong>Compartilhar</strong> (ícone com seta
                para cima) na barra do Safari.
              </li>
              <li>
                Role as opções e toque em{' '}
                <strong>Adicionar à Tela de Início</strong>.
              </li>
              <li>
                Confirme tocando em <strong>Adicionar</strong> no canto
                superior.
              </li>
            </ol>
          ) : (
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                No celular (Chrome/Edge), toque no menu de opções{' '}
                <strong>(⋮)</strong> e escolha{' '}
                <strong>Instalar aplicativo</strong> ou{' '}
                <strong>Adicionar à tela inicial</strong>.
              </li>
              <li>
                No computador, clique no ícone de instalação na barra de
                endereços do navegador.
              </li>
            </ol>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--lia-accent)] hover:bg-[var(--lia-accent-hover)] text-white text-sm font-medium transition-colors cursor-pointer"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}

export function FirstVisitPWABanner() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(FIRST_VISIT_DISMISSED_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [showInstructions, setShowInstructions] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        try {
          localStorage.setItem(FIRST_VISIT_DISMISSED_KEY, 'true');
        } catch {
          // Ignore storage errors
        }
      }
      return;
    }
    setShowInstructions(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(FIRST_VISIT_DISMISSED_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        <div
          role="region"
          aria-label="Instalar aplicativo Lia"
          className="bg-white border border-[var(--lia-border-accent)] rounded-2xl p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--lia-accent-soft)] text-[var(--lia-accent)] flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--lia-ink)]">
                Leve a Lia com você no celular
              </p>
              <p className="text-xs text-[var(--lia-ink-secondary)] mt-0.5 leading-relaxed">
                Baixe o aplicativo (PWA) na tela inicial para abrir rápido
                mesmo nos momentos de correria.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void handleInstallClick()}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[var(--lia-accent)] hover:bg-[var(--lia-accent-hover)] text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lia-accent)]"
            >
              <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Baixar PWA</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-[var(--lia-border)] bg-[var(--lia-surface-soft)] hover:bg-[var(--lia-surface-hover)] text-xs font-medium text-[var(--lia-ink-secondary)] whitespace-nowrap transition-colors cursor-pointer"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>

      <InstallInstructionsModal
        isOpen={showInstructions}
        isIOS={isIOS}
        onClose={() => setShowInstructions(false)}
      />
    </>
  );
}

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);

  if (isInstalled) {
    return (
      <p className="text-sm font-medium text-[var(--lia-accent-strong)]">
        Aplicativo Lia já instalado neste aparelho.
      </p>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
      return;
    }
    setShowInstructions(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleClick()}
        className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--lia-accent)] hover:bg-[var(--lia-accent-hover)] text-white text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lia-accent)]"
      >
        <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Baixar aplicativo (PWA)</span>
      </button>

      <InstallInstructionsModal
        isOpen={showInstructions}
        isIOS={isIOS}
        onClose={() => setShowInstructions(false)}
      />
    </>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 md:bottom-4 left-4 z-40 flex items-center gap-2 rounded-xl bg-[#854D0E] px-3.5 py-2 text-xs font-medium text-white shadow-md"
    >
      <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>Sem internet — Guias salvos continuam acessíveis</span>
    </div>
  );
}
