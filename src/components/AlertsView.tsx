import { AlertTriangle, PhoneCall } from 'lucide-react';
import {
  EMERGENCY_CHANNELS,
  WARNING_SIGN_GROUPS,
} from '../data/guiaContent';

export function AlertsView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      <div className="border-b border-[var(--lia-border)] pb-6">
        <p className="text-xs text-[#9E2828] font-medium mb-1">
          <span>Atenção imediata</span>
          <span aria-hidden="true" className="mx-1.5">
            ·
          </span>
          <span>Quando procurar atendimento sem esperar</span>
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--lia-ink)]">
          Sinais de alerta e canais de emergência
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--lia-ink-secondary)] max-w-3xl leading-relaxed">
          Se você ou alguém próximo apresentar qualquer sinal listado abaixo,
          procure imediatamente a maternidade, o pronto-atendimento ou ligue
          para o SAMU (192). Não espere melhorar sozinho.
        </p>
      </div>

      {/* Warning Sign Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {WARNING_SIGN_GROUPS.map((group) => (
          <section
            key={group.id}
            className="bg-white border border-[var(--lia-border)] rounded-2xl p-5 sm:p-6 flex flex-col"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#FDF3F3] border border-[#EBC7C7] flex items-center justify-center shrink-0">
                <AlertTriangle
                  className="w-5 h-5 text-[#B83232]"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-[var(--lia-ink)] leading-snug">
                  {group.title}
                </h2>
                <p className="text-xs font-medium text-[#9E2828] mt-0.5">
                  {group.subtitle}
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--lia-ink-secondary)] mb-4">
              {group.actionText}
            </p>

            <ul className="space-y-2.5 text-sm text-[var(--lia-ink)] leading-relaxed">
              {group.signs.map((sign) => (
                <li key={sign} className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 w-1.5 h-1.5 rounded-full bg-[#B83232] shrink-0"
                  />
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Telefones Úteis */}
      <section className="bg-white border border-[var(--lia-border)] rounded-2xl p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold text-[var(--lia-ink)]">
            Telefones gratuitos de emergência e proteção no Brasil
          </h2>
          <p className="text-sm text-[var(--lia-ink-muted)] mt-1">
            Confirme os números e serviços disponíveis na sua cidade ou estado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMERGENCY_CHANNELS.map((channel) => (
            <div
              key={channel.id}
              className="p-4 rounded-xl bg-[var(--lia-surface-soft)] border border-[var(--lia-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[var(--lia-ink)]">
                  {channel.name}
                </h3>
                <p className="text-xs text-[var(--lia-ink-secondary)] leading-relaxed">
                  {channel.whenToCall}
                </p>
                <p className="text-[11px] text-[var(--lia-ink-muted)]">
                  {channel.note}
                </p>
              </div>

              <a
                href={channel.telHref}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#B83232] hover:bg-[#9E2828] text-white text-sm font-semibold tabular-nums inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors"
              >
                <PhoneCall className="w-4 h-4" aria-hidden="true" />
                <span>Ligar {channel.number}</span>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
