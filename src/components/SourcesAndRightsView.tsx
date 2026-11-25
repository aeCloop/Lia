import { BookCheck, Lock, Scale, Users } from 'lucide-react';

export function SourcesAndRightsView() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
      <div className="border-b border-[var(--lia-border)] pb-5 sm:pb-6">
        <p className="text-xs text-[var(--lia-ink-muted)] mb-1">
          <span>Transparência</span>
          <span aria-hidden="true" className="mx-1.5">
            ·
          </span>
          <span>Segurança e privacidade</span>
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--lia-ink)]">
          Como a Lia orienta e protege sua família
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--lia-ink-secondary)] max-w-3xl leading-relaxed">
          A Lia oferece educação em saúde e apoio prático com base nas
          diretrizes oficiais usadas no Brasil. Ela complementa — e nunca
          substitui — o acompanhamento de obstetras, pediatras, enfermeiros,
          nutricionistas, psicólogos e advogados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <section className="min-w-0 bg-white border border-[var(--lia-border)] rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-3">
            <BookCheck
              className="w-5 h-5 text-[var(--lia-accent)] shrink-0"
              aria-hidden="true"
            />
            <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--lia-ink)]">
              Fontes de referência
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-[var(--lia-ink-secondary)] leading-relaxed">
            <li>
              <strong>Ministério da Saúde (MS):</strong> Caderneta da Criança,
              Caderneta da Gestante, Guia Alimentar para Crianças Brasileiras
              Menores de 2 Anos e Programa Nacional de Imunizações (PNI).
            </li>
            <li>
              <strong>Sociedade Brasileira de Pediatria (SBP):</strong>{' '}
              recomendações sobre sono seguro, amamentação, telas, segurança
              doméstica e desengasgo.
            </li>
            <li>
              <strong>FEBRASGO e OMS:</strong> diretrizes de pré-natal, parto
              respeitoso, puerpério e aleitamento materno.
            </li>
          </ul>
        </section>

        <section className="min-w-0 bg-white border border-[var(--lia-border)] rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-3">
            <Scale
              className="w-5 h-5 text-[var(--lia-accent)] shrink-0"
              aria-hidden="true"
            />
            <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--lia-ink)]">
              Vacinas, benefícios e leis podem mudar
            </h2>
          </div>
          <p className="text-sm text-[var(--lia-ink-secondary)] leading-relaxed">
            Calendários de vacinação, valores de benefícios, prazos de licenças
            e regras trabalhistas passam por atualizações periódicas. Sempre
            confirme esses pontos na Unidade Básica de Saúde (UBS), no portal do
            Ministério da Saúde, no Meu INSS ou com o setor de RH do empregador.
          </p>
          <p className="text-sm text-[var(--lia-ink-secondary)] leading-relaxed">
            A Lia não faz diagnósticos médicos, não prescreve nem indica doses
            de medicamentos, vitaminas, suplementos, fitoterápicos ou chás.
          </p>
        </section>

        <section className="min-w-0 bg-white border border-[var(--lia-border)] rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-3">
            <Users
              className="w-5 h-5 text-[var(--lia-accent)] shrink-0"
              aria-hidden="true"
            />
            <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--lia-ink)]">
              Para todos os tipos de família
            </h2>
          </div>
          <p className="text-sm text-[var(--lia-ink-secondary)] leading-relaxed">
            Cada família tem sua história e sua rede. As orientações acolhem
            mães solo, pais cuidadores, casais homoafetivos, famílias por
            adoção, avós e cuidadores, além de cuidados específicos para gêmeos,
            bebês prematuros e crianças com deficiência ou condições especiais.
          </p>
        </section>

        <section className="min-w-0 bg-white border border-[var(--lia-border)] rounded-2xl p-4 sm:p-6 space-y-3">
          <div className="flex items-center gap-3">
            <Lock
              className="w-5 h-5 text-[var(--lia-accent)] shrink-0"
              aria-hidden="true"
            />
            <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--lia-ink)]">
              Privacidade e dados pessoais
            </h2>
          </div>
          <p className="text-sm text-[var(--lia-ink-secondary)] leading-relaxed">
            Esta aplicação não cria banco de dados com seu histórico nem pede
            cadastro. Evite enviar dados pessoais sensíveis na conversa, como
            CPF, endereço residencial, documentos com foto ou resultados de
            exames contendo nome completo.
          </p>
        </section>
      </div>
    </div>
  );
}
