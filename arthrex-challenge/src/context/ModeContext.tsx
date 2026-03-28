// TODO: Teammate A — Implement Surgeon / Patient mode context
// Create a React context with: mode ('surgeon' | 'patient'), setMode function.
// Export useModeContext hook for consuming the context.
// The mode determines terminology level throughout the app:
//   surgeon: clinical terms, full procedure details, instrument names
//   patient: plain language, reassuring descriptions, simplified steps
// Persist mode selection to localStorage so it survives page refresh.

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Mode = 'surgeon' | 'patient';

interface ModeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextValue>({
  mode: 'patient',
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('patient');
  // TODO: Persist to localStorage on change, read on mount
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useModeContext() {
  return useContext(ModeContext);
}
