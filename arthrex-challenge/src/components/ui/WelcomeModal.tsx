// TODO: Teammate A — Build the welcome/mode-selection splash modal
// Shown on first load (or when no mode is selected in ModeContext).
// User picks "Surgeon Mode" or "Patient Mode".
// Call setMode from useModeContext on selection to dismiss the modal.
// Surgeon mode: clinical terminology, procedure details.
// Patient mode: plain-language explanations, reassuring tone.

export default function WelcomeModal() {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-2">Arthrex Knee Explorer</h1>
        <p className="text-slate-400 mb-6">Choose your experience mode to get started.</p>
        <div className="flex gap-4">
          <button className="flex-1 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-blue-500 transition-colors">
            Surgeon Mode
          </button>
          <button className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors">
            Patient Mode
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">WelcomeModal placeholder — Teammate A</p>
      </div>
    </div>
  );
}
