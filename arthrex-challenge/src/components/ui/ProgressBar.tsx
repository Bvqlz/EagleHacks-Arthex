// TODO: Teammate B — Build a step progress indicator
// Props: current: number, total: number
// Displays as a segmented bar (one segment per step) or a filled bar.
// Used in ProcedurePanel header to show progress through the ACL reconstruction steps.

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-accent rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
