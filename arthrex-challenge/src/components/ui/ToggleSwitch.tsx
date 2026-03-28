interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  color?: string;
}

export default function ToggleSwitch({ checked, onChange, label, color }: ToggleSwitchProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative w-8 h-4 rounded-full flex-shrink-0 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-slate-800"
        style={{ backgroundColor: checked ? (color ?? 'var(--color-accent)') : '#475569' }}
      >
        <span
          className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200"
          style={{ left: checked ? '1rem' : '0.125rem' }}
        />
      </button>
      {label && <span className="text-sm text-slate-300">{label}</span>}
    </label>
  );
}
