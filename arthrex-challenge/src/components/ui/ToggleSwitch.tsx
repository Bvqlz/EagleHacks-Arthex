// TODO: Teammate B — Build a reusable toggle switch component
// Props: checked: boolean, onChange: (checked: boolean) => void, label?: string, color?: string
// Used in AnatomySidebar to toggle anatomy structure visibility.
// The color prop should tint the toggle indicator (use inline style or data attribute).

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  color?: string;
}

export default function ToggleSwitch({ checked, onChange, label, color }: ToggleSwitchProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        className={`w-10 h-5 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-slate-600'}`}
        style={checked && color ? { backgroundColor: color } : {}}
        onClick={() => onChange(!checked)}
      />
      {label && <span className="text-sm text-slate-300">{label}</span>}
    </label>
  );
}
