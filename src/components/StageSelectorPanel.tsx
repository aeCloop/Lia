import { useState } from 'react';
import { ChevronRight, HeartHandshake } from 'lucide-react';
import { JourneyStage, JourneyStageId } from '../types/guia';

interface StageSelectorPanelProps {
  stages: JourneyStage[];
  selectedStageId: JourneyStageId;
  onSelectStage: (stageId: JourneyStageId) => void;
  onPickQuestion: (question: string) => void;
}

export function StageSelectorPanel({
  stages,
  selectedStageId,
  onSelectStage,
  onPickQuestion,
}: StageSelectorPanelProps) {
  const [imgError, setImgError] = useState(false);
  const currentStage =
    stages.find((stage) => stage.id === selectedStageId) ?? stages[0];

  return (
    <aside className="space-y-6">
      {/* Editorial Hero / Context Card */}
      <div className="bg-white border border-[var(--lia-border)] rounded-2xl overflow-hidden">
        <div className="aspect-[4/3] w-full bg-[var(--lia-accent-soft)] relative overflow-hidden">
          {!imgError ? (
            <img
              src="/src/assets/images/guia_welcome_family_1795607798041.jpg"
              alt="Família acolhendo um bebê recém-nascido perto de uma janela iluminada."
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[var(--lia-accent-soft)]">
              <HeartHandshake
                className="w-10 h-10 text-[var(--lia-accent)] mb-2"
                aria-hidden="true"
              />
              <span className="font-display text-lg font-semibold text-[var(--lia-accent-strong)]">
                Apoio calmo e sem julgamentos
              </span>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <p className="text-xs text-[var(--lia-ink-muted)] mb-1.5">
            <span>Do planejamento aos 5 anos</span>
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
            <span>Realidade brasileira</span>
          </p>
          <h1 className="font-display text-2xl font-semibold text-[var(--lia-ink)] leading-snug mb-2">
            Você não precisa descobrir tudo sozinha(o)
          </h1>
          <p className="text-sm text-[var(--lia-ink-secondary)] leading-relaxed">
            Escolha a fase da sua família para receber respostas práticas da
            Lia, baseadas no Ministério da Saúde, SBP, FEBRASGO e OMS.
          </p>
        </div>
      </div>

      {/* Stage Selector */}
      <div className="bg-white border border-[var(--lia-border)] rounded-2xl p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <h2 className="font-display text-lg font-semibold text-[var(--lia-ink)]">
            Momento atual
          </h2>
          <span className="text-xs text-[var(--lia-ink-muted)]">
            {currentStage.ageRange}
          </span>
        </div>

        <div
          role="radiogroup"
          aria-label="Fase da jornada da família"
          className="grid grid-cols-2 gap-2"
        >
          {stages.map((stage) => {
            const isSelected = stage.id === selectedStageId;
            return (
              <button
                key={stage.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectStage(stage.id)}
                className={`min-h-[44px] px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lia-accent)] ${
                  isSelected
                    ? 'bg-[var(--lia-accent)] text-white border-[var(--lia-accent)]'
                    : 'bg-[var(--lia-surface-soft)] text-[var(--lia-ink)] border-[var(--lia-border)] hover:bg-[var(--lia-surface-hover)]'
                }`}
              >
                <span className="block truncate">{stage.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-[var(--lia-ink-muted)] leading-relaxed">
          {currentStage.summary}
        </p>

        <div className="my-4 border-t border-[var(--lia-border)]" />

        <h3 className="text-xs font-semibold text-[var(--lia-ink-secondary)] mb-2.5">
          Perguntas comuns nesta fase
        </h3>
        <div className="space-y-2">
          {currentStage.starterQuestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onPickQuestion(question)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[var(--lia-surface-soft)] hover:bg-[var(--lia-accent-soft)] border border-[var(--lia-border)] hover:border-[var(--lia-border-accent)] text-left text-xs sm:text-sm text-[var(--lia-ink)] flex items-center justify-between gap-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lia-accent)]"
            >
              <span className="leading-snug">{question}</span>
              <ChevronRight
                className="w-4 h-4 text-[var(--lia-accent)] shrink-0"
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
