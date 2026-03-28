import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Mode = 'surgeon' | 'patient';

interface ModeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const STORAGE_KEY = 'orthovision_mode';

const ModeContext = createContext<ModeContextValue>({
  mode: 'patient',
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'surgeon' ? 'surgeon' : 'patient';
  });

  const setMode = (m: Mode) => {
    localStorage.setItem(STORAGE_KEY, m);
    setModeState(m);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useModeContext() {
  return useContext(ModeContext);
}
