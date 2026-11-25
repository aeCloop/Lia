import { useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { PRACTICAL_GUIDES } from '../data/guiaContent';

interface PracticalGuidesViewProps {
  onAskLia: (prompt: string) => void;
}

export function PracticalGuidesView({ onAskLia }: PracticalGuidesViewProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = [
    'Todos',
    ...Array.from(new Set(PRACTICAL_GUIDES.map((g) => g.category))),
  ];

  const filteredGuides =
    selectedCategory === 'Todos'
      ? PRACTICAL_GUIDES
      : PRACTICAL_GUIDES.filter((g) => g.category === selectedCategory);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[var(--lia-border)] pb-5 sm:pb-6">
        <div className="min-w-0">
          <p className="text-xs text-[var(--lia-ink-muted)] mb-1">
            <span>Referências oficiais</span>
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            <span>Leitura rápida para o dia a dia</span>
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--lia-ink)]">
            Guias práticos para consulta rápida
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[var(--lia-ink-secondary)] max-w-2xl leading-relaxed">
            Resumos objetivos alinhados ao Ministério da Saúde, SBP e OMS. Se
            quiser adaptar alguma orientação à sua rotina, toque para conversar
            com a Lia.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filtrar guias por tema"
          className="w-full lg:w-auto max-w-full min-w-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1"
        >
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--lia-accent)] text-white'
                    : 'bg-white border border-[var(--lia-border)] text-[var(--lia-ink-secondary)] hover:bg-[var(--lia-surface-soft)]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredGuides.map((guide) => {
          const hasImage = Boolean(guide.imageUrl) && !failedImages[guide.id];
          return (
            <article
              key={guide.id}
              className="min-w-0 bg-white border border-[var(--lia-border)] rounded-2xl flex flex-col overflow-hidden"
            >
              {guide.imageUrl && (
                <div className="aspect-[4/3] w-full bg-[var(--lia-accent-soft)] overflow-hidden">
                  {hasImage ? (
                    <img
                      src={guide.imageUrl}
                      alt={guide.imageAlt || guide.title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({
                          ...prev,
                          [guide.id]: true,
                        }))
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[var(--lia-accent-soft)]">
                      <BookOpen
                        className="w-8 h-8 text-[var(--lia-accent)] mb-2"
                        aria-hidden="true"
                      />
                      <span className="font-display text-base font-semibold text-[var(--lia-accent-strong)]">
                        {guide.title}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 sm:p-6 flex-1 flex flex-col min-w-0">
                <p className="text-xs text-[var(--lia-ink-muted)] mb-1.5">
                  <span>{guide.category}</span>
                  <span aria-hidden="true" className="mx-1.5">
                    ·
                  </span>
                  <span>{guide.sourceLabel}</span>
                </p>

                <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--lia-ink)] leading-snug break-words">
                  {guide.title}
                </h2>

                <p className="mt-2 text-sm text-[var(--lia-ink-secondary)] leading-relaxed break-words">
                  {guide.summary}
                </p>

                <div className="my-4 border-t border-[var(--lia-border)]" />

                <ul className="space-y-2 text-sm text-[var(--lia-ink-secondary)] leading-relaxed flex-1">
                  {guide.keyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 min-w-0">
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--lia-accent)] shrink-0"
                      />
                      <span className="min-w-0 break-words">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-4 border-t border-[var(--lia-border)]">
                  <button
                    type="button"
                    onClick={() => onAskLia(guide.promptForGuia)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[var(--lia-surface-soft)] hover:bg-[var(--lia-accent-soft)] border border-[var(--lia-border)] hover:border-[var(--lia-border-accent)] text-sm font-medium text-[var(--lia-accent-strong)] inline-flex items-center justify-between gap-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lia-accent)]"
                  >
                    <span className="truncate">Perguntar à Lia sobre isso</span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
