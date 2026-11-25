import { Check, Palette, Smartphone, Trash2 } from 'lucide-react';
import { ThemeOption } from '../types/guia';
import { PWAInstallButton } from './PWAInstallBanner';

interface SettingsViewProps {
  theme: ThemeOption;
  onChangeTheme: (theme: ThemeOption) => void;
  hasMessages: boolean;
  onClearConversation: () => void;
}

const THEME_CHOICES: {
  id: ThemeOption;
  name: string;
  description: string;
  swatchHex: string;
  softHex: string;
  badgeText: string;
}[] = [
  {
    id: 'blue',
    name: 'Azul',
    description: 'Tons serenos de azul-céu com leitura suave.',
    swatchHex: '#1D5B9E',
    softHex: '#EAF2FB',
    badgeText: 'Padrão',
  },
  {
    id: 'pink',
    name: 'Rosa',
    description: 'Tons acolhedores de rosa suave com alto contraste.',
    swatchHex: '#B03A6E',
    softHex: '#FBF0F5',
    badgeText: 'Opcional',
  },
];

export function SettingsView({
  theme,
  onChangeTheme,
  hasMessages,
  onClearConversation,
}: SettingsViewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6">
      <div className="border-b border-[var(--lia-border)] pb-5 sm:pb-6">
        <p className="text-xs text-[var(--lia-ink-muted)] mb-1">
          <span>Preferências do aparelho</span>
          <span aria-hidden="true" className="mx-1.5">
            ·
          </span>
          <span>Lia</span>
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--lia-ink)]">
          Configurações
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--lia-ink-secondary)] leading-relaxed">
          Escolha a cor do aplicativo que mais agrada à sua família e instale a
          Lia na tela inicial do seu celular.
        </p>
      </div>

      {/* Theme Selector */}
      <section className="bg-white border border-[var(--lia-border)] rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-start sm:items-center gap-3">
          <Palette
            className="w-5 h-5 text-[var(--lia-accent)] shrink-0 mt-0.5 sm:mt-0"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--lia-ink)]">
              Tema de cores
            </h2>
            <p className="text-xs sm:text-sm text-[var(--lia-ink-muted)]">
              O azul vem selecionado por padrão. Você pode trocar quando quiser.
            </p>
          </div>
        </div>

        <div
          role="radiogroup"
          aria-label="Escolha o tema de cores da Lia"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1"
        >
          {THEME_CHOICES.map((choice) => {
            const isSelected = theme === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChangeTheme(choice.id)}
                className={`min-h-[76px] p-4 rounded-2xl border text-left transition-colors flex items-start justify-between gap-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lia-accent)] ${
                  isSelected
                    ? 'border-[var(--lia-accent)] bg-[var(--lia-accent-soft)]'
                    : 'border-[var(--lia-border)] bg-white hover:bg-[var(--lia-surface-soft)]'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    aria-hidden="true"
                    className="w-9 h-9 rounded-xl border border-black/10 shrink-0 mt-0.5"
                    style={{
                      background: `linear-gradient(135deg, ${choice.swatchHex} 55%, ${choice.softHex} 55%)`,
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-base font-semibold text-[var(--lia-ink)]">
                        {choice.name}
                      </span>
                      <span className="text-xs text-[var(--lia-ink-muted)]">
                        {choice.badgeText}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--lia-ink-secondary)] mt-1 leading-relaxed">
                      {choice.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-[var(--lia-accent)] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* PWA Install Section */}
      <section className="bg-white border border-[var(--lia-border)] rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-start sm:items-center gap-3">
          <Smartphone
            className="w-5 h-5 text-[var(--lia-accent)] shrink-0 mt-0.5 sm:mt-0"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--lia-ink)]">
              Aplicativo no celular (PWA)
            </h2>
            <p className="text-xs sm:text-sm text-[var(--lia-ink-muted)]">
              Instale a Lia como aplicativo para abrir direto da tela inicial e
              consultar os guias mesmo sem internet.
            </p>
          </div>
        </div>

        <div className="[&>button]:w-full sm:[&>button]:w-auto [&>button]:justify-center">
          <PWAInstallButton />
        </div>
      </section>

      {/* Session Privacy Control */}
      <section className="bg-white border border-[var(--lia-border)] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold text-[var(--lia-ink)]">
            Histórico salvo neste aparelho
          </h2>
          <p className="text-xs sm:text-sm text-[var(--lia-ink-secondary)] mt-0.5">
            Suas conversas ficam salvas apenas no navegador deste dispositivo.
            Você pode apagar tudo quando quiser.
          </p>
        </div>

        <button
          type="button"
          onClick={onClearConversation}
          disabled={!hasMessages}
          className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-xl border border-[var(--lia-border)] bg-[var(--lia-surface-soft)] hover:bg-[var(--lia-surface-hover)] text-sm font-medium text-[var(--lia-ink)] inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Limpar histórico</span>
        </button>
      </section>
    </div>
  );
}
