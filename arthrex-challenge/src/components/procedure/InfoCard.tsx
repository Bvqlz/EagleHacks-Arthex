import { useAppStore } from '../../store/appStore';
import { useContent } from '../../hooks/useContent';
import { anatomyById } from '../../data/anatomyData';
import Badge from '../ui/Badge';

export default function InfoCard() {
  const selectedStructure = useAppStore((s) => s.selectedStructure);
  const setSelectedStructure = useAppStore((s) => s.setSelectedStructure);
  const { getText } = useContent();

  if (!selectedStructure) return null;

  const structure = anatomyById[selectedStructure];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 pointer-events-none">
      <div className="bg-slate-900/95 backdrop-blur border border-slate-600 rounded-xl p-4 shadow-2xl pointer-events-auto">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            {structure?.color && (
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: structure.color }}
              />
            )}
            <h3 className="font-semibold text-white text-sm leading-tight truncate">
              {structure?.label ?? selectedStructure.replace(/_/g, ' ')}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {structure?.category && (
              <Badge label={structure.category} variant="category" />
            )}
            <button
              onClick={() => setSelectedStructure(null)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Close"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {structure ? (
          <>
            {/* Mode-appropriate description */}
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              {getText(structure as unknown as Record<string, unknown>, 'Description')}
            </p>

            {/* Clinical relevance */}
            {structure.clinicalRelevance && (
              <div className="border-t border-slate-700 pt-2 mt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Clinical Relevance
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {structure.clinicalRelevance}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-slate-400">
            Structure data not yet available.
          </p>
        )}
      </div>
    </div>
  );
}
