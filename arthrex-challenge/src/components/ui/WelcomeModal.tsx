import { useState } from 'react';
import { useModeContext } from '../../context/ModeContext';

export default function WelcomeModal() {
  const { setMode } = useModeContext();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleSelect = (mode: 'surgeon' | 'patient') => {
    setMode(mode);
    setDismissed(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Logo + title */}
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.5 2a2.5 2.5 0 00-2 4l1 1-4 4-1-1a2.5 2.5 0 10-1 3.5l1 1 4-4 1 1a2.5 2.5 0 103.5-1l-1-1 4-4 1 1a2.5 2.5 0 101-3.5l-1-1-4 4-1-1A2.5 2.5 0 008.5 2z" />
          </svg>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">OrthoVision 3D</h1>
            <p className="text-xs text-slate-500">Arthrex Interactive Knee Explorer</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Explore a fully interactive 3D knee anatomy model with a step-by-step ACL reconstruction walkthrough. Choose your experience:
        </p>

        <div className="flex flex-col gap-3">
          {/* Surgeon Mode */}
          <button
            onClick={() => handleSelect('surgeon')}
            className="w-full py-4 px-5 rounded-xl bg-ligament/10 border border-ligament/30 text-left hover:bg-ligament/20 hover:border-ligament/50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ligament group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-ligament transition-colors">
                  Surgeon Mode
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clinical terminology · Anatomic landmarks · Instrument details
                </p>
              </div>
              <svg className="w-4 h-4 text-slate-500 group-hover:text-ligament transition-colors flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Patient Mode */}
          <button
            onClick={() => handleSelect('patient')}
            className="w-full py-4 px-5 rounded-xl bg-soft-tissue/10 border border-soft-tissue/30 text-left hover:bg-soft-tissue/20 hover:border-soft-tissue/50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-soft-tissue group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white text-sm group-hover:text-soft-tissue transition-colors">
                  Patient Mode
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Plain language · Reassuring tone · What to expect
                </p>
              </div>
              <svg className="w-4 h-4 text-slate-500 group-hover:text-soft-tissue transition-colors flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-4 text-center">
          You can switch modes at any time using the toggle in the top bar.
        </p>
      </div>
    </div>
  );
}
