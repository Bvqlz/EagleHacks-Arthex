import { useAppStore } from '../../store/appStore';
import { useModeContext } from '../../context/ModeContext';

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const { mode, setMode } = useModeContext();

  return (
    <header className="h-14 bg-slate-950 border-b border-slate-700 flex items-center px-4 gap-4 flex-shrink-0 z-10">
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-slate-950"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {/* Medical cross / bone icon */}
          <svg className="w-6 h-6 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.5 2a2.5 2.5 0 00-2 4l1 1-4 4-1-1a2.5 2.5 0 10-1 3.5l1 1 4-4 1 1a2.5 2.5 0 103.5-1l-1-1 4-4 1 1a2.5 2.5 0 101-3.5l-1-1-4 4-1-1A2.5 2.5 0 008.5 2z" />
          </svg>
          <span className="font-semibold text-white text-sm tracking-tight whitespace-nowrap">
            OrthoVision 3D
          </span>
        </div>
      </div>

      {/* Center: view mode tabs */}
      <div className="flex-1 flex justify-center">
        <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
          <button
            onClick={() => setViewMode('explore')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 focus:outline-none ${
              viewMode === 'explore'
                ? 'bg-accent text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setViewMode('procedure')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 focus:outline-none ${
              viewMode === 'procedure'
                ? 'bg-accent text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Procedure
          </button>
        </div>
      </div>

      {/* Right: surgeon/patient mode toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 hidden sm:block">Mode</span>
        <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
          <button
            onClick={() => setMode('patient')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 focus:outline-none ${
              mode === 'patient'
                ? 'bg-soft-tissue text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => setMode('surgeon')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 focus:outline-none ${
              mode === 'surgeon'
                ? 'bg-ligament text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Surgeon
          </button>
        </div>
      </div>
    </header>
  );
}
