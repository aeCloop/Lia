import { PhoneCall } from 'lucide-react';
import { ActiveTab } from '../types/guia';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenEmergencyModal: () => void;
}

const NAV_ITEMS: { id: ActiveTab; label: string }[] = [
  { id: 'chat', label: 'Conversar' },
  { id: 'guides', label: 'Guias práticos' },
  { id: 'alerts', label: 'Sinais de alerta' },
  { id: 'sources', label: 'Fontes e direitos' },
  { id: 'settings', label: 'Configurações' },
];

export function Header({
  activeTab,
  onSelectTab,
  onOpenEmergencyModal,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-14 md:h-16 bg-white/95 backdrop-blur-md border-b border-[var(--lia-border)]">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('chat')}
          className="font-display text-2xl font-semibold tracking-tight text-[var(--lia-accent-strong)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--lia-accent)] rounded-sm cursor-pointer"
        >
          Lia
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-6"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`py-2 text-sm font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--lia-accent)] ${
                  isActive
                    ? 'border-[var(--lia-accent)] text-[var(--lia-accent-strong)]'
                    : 'border-transparent text-[var(--lia-ink-muted)] hover:text-[var(--lia-ink)] hover:border-[var(--lia-border-accent)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenEmergencyModal}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl bg-[#B83232] hover:bg-[#9E2828] text-white text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B83232]"
          >
            <PhoneCall className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Emergência 192</span>
          </button>
        </div>
      </div>
    </header>
  );
}
