import { useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { useContent } from '../../hooks/useContent';
import { procedureSteps } from '../../data/procedureSteps';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

export default function ProcedurePanel() {
  const currentStep = useAppStore((s) => s.currentStep);
  const setCurrentStep = useAppStore((s) => s.setCurrentStep);
  const totalSteps = useAppStore((s) => s.totalSteps);
  const viewMode = useAppStore((s) => s.viewMode);
  const setHighlightedStructures = useAppStore((s) => s.setHighlightedStructures);
  const { getText } = useContent();

  // Sync focused structures only while in procedure mode
  useEffect(() => {
    if (viewMode !== 'procedure') return;
    const step = procedureSteps[currentStep];
    if (step) setHighlightedStructures(step.focusStructures);
  }, [currentStep, viewMode, setHighlightedStructures]);

  const step = procedureSteps[currentStep] ?? null;

  const canPrev = currentStep > 0;
  const canNext = currentStep < totalSteps - 1;

  return (
    <aside className="w-80 h-full bg-slate-800 border-l border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            ACL Reconstruction
          </span>
          <span className="text-xs text-slate-500">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
        <ProgressBar current={currentStep + 1} total={totalSteps} />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-4">
        {step ? (
          <div key={step.id} className="animate-fadeIn">
            {/* Step number + title */}
            <div className="mb-3">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Step {currentStep + 1}
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5 leading-snug">
                {getText(step as unknown as Record<string, unknown>, 'Title')}
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {getText(step as unknown as Record<string, unknown>, 'Description')}
            </p>

            {/* Instruments */}
            {step.instruments.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Instruments
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {step.instruments.map((inst) => (
                    <Badge key={inst} label={inst} variant="instrument" />
                  ))}
                </div>
              </div>
            )}

            {/* Focus structures */}
            {step.focusStructures.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Anatomy Focus
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {step.focusStructures.map((id) => (
                    <Badge key={id} label={id.replace(/_/g, ' ')} variant="category" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6M12 3C6.477 3 2 7.477 2 12s4.477 9 10 9 10-4.477 10-9S17.523 3 12 3z" />
              </svg>
            </div>
            <p className="text-sm text-slate-400">Procedure steps loading…</p>
            <p className="text-xs text-slate-500 mt-1">Content coming soon</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-slate-700 flex-shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={!canPrev}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-slate-800 disabled:opacity-30 disabled:cursor-not-allowed bg-slate-700 text-white hover:bg-slate-600"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canNext}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-slate-800 disabled:opacity-30 disabled:cursor-not-allowed bg-accent text-white hover:bg-blue-500"
          >
            Next →
          </button>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 focus:outline-none ${
                i === currentStep
                  ? 'bg-accent w-4'
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
