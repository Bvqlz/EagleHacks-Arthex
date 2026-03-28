// TODO: Teammate A — Build the floating anatomy info card
// Appears when a structure is selected (selectedStructure in useAppStore).
// Positioned absolutely over the 3D viewport.
// Shows structure name, description, and clinical relevance from anatomyData.ts.
// Use useContent hook for mode-appropriate description text.

export default function InfoCard() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-surface border border-slate-600 rounded-xl p-4 shadow-xl max-w-sm">
      <p className="text-slate-400">InfoCard placeholder — Teammate A</p>
    </div>
  );
}
