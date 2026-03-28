import { useGestureStore } from '../../store/gestureStore';

const GESTURE_LABEL: Record<string, string> = {
  index_zoom:   '⟷  Zoom (two index fingers)',
  palm_rotate:  '↕  Rotate (open palm drag)',
  fist_holding: '✊  Hold 1 s to reset…',
  reset:        '↺  Reset',
};

export default function GestureOverlay() {
  const connected = useGestureStore((s) => s.connected);
  const gesture   = useGestureStore((s) => s.gesture);
  const hands     = useGestureStore((s) => s.hands);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none select-none z-10">
      {connected ? (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 text-emerald-300 text-xs border border-emerald-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Hand tracking · {hands} hand{hands !== 1 ? 's' : ''}
        </div>
      ) : (
        <div className="px-3 py-1.5 rounded-full bg-black/40 text-slate-500 text-xs border border-slate-700/40">
          Hand tracking offline — run <code className="font-mono">python hand_tracker/hand_tracker.py</code>
        </div>
      )}

      {connected && gesture && GESTURE_LABEL[gesture] && (
        <div className="px-3 py-1 rounded-full bg-black/60 text-white text-xs border border-white/10">
          {GESTURE_LABEL[gesture]}
        </div>
      )}
    </div>
  );
}
