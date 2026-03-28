// TODO: Teammate A — Hook to get mode-appropriate content
// Returns helper functions that select the right text field based on current mode.
// Wrap useModeContext so components don't need to import it directly.
//
// Usage:
//   const { getText } = useContent();
//   const title = getText(step, 'Title');       // returns step.surgeonTitle or step.patientTitle
//   const desc  = getText(structure, 'Description'); // returns surgeonDescription or patientDescription

import { useModeContext } from '../context/ModeContext';

export function useContent() {
  const { mode } = useModeContext();

  function getText<T extends Record<string, unknown>>(
    obj: T,
    fieldSuffix: string
  ): string {
    const prefix = mode === 'surgeon' ? 'surgeon' : 'patient';
    const key = `${prefix}${fieldSuffix}` as keyof T;
    return (obj[key] as string) ?? '';
  }

  return { getText, mode };
}
