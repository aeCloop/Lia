import {
  AlertTriangle,
  BookOpen,
  MessageCircle,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { ActiveTab } from '../types/guia';

interface MobileBottomBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

const MOBILE_TABS: {
  id: ActiveTab;
  label: string;
  Icon: typeof MessageCircle;
}[] = [
  { id: 'chat', label: 'Conversar', Icon: MessageCircle },
  { id: 'guides', label: 'Guias', Icon: BookOpen },
  { id: 'alerts', label: 'Alertas', Icon: AlertTriangle },
  { id: 'sources', label: 'Fontes', Icon: ShieldCheck },
  { id: 'settings', label: 'Ajustes', Icon: Settings },
];

export function MobileBottomBar({
  activeTab,
  onSelectTab,
}: MobileBottomBarProps) {
  return (
    <nav
      aria-label="Menu inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur-md border-t border-[var(--lia-border)]"
    >
      <div className="grid grid-cols-5 h-full">
        {MOBILE_TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[var(--lia-accent)] ${
                isActive
                  ? 'text-[var(--lia-accent-strong)] font-semibold'
                  : 'text-[var(--lia-ink-muted)] font-medium'
              }`}
            >
              <Icon
                className="w-5 h-5"
                strokeWidth={isActive ? 2.25 : 1.75}
                aria-hidden="true"
              />
              <span className="text-[11px] leading-none whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
