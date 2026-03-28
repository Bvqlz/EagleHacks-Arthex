// TODO: Teammate B — Build a pill badge component
// Props: label: string, variant?: 'instrument' | 'category' | 'default'
// Used in ProcedurePanel to tag instruments and step categories.
// Each variant should have a distinct color from the medical theme palette.

interface BadgeProps {
  label: string;
  variant?: 'instrument' | 'category' | 'default';
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  const variantClass = {
    instrument: 'bg-soft-tissue/20 text-soft-tissue border-soft-tissue/30',
    category: 'bg-ligament/20 text-ligament border-ligament/30',
    default: 'bg-slate-700 text-slate-300 border-slate-600',
  }[variant];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${variantClass}`}>
      {label}
    </span>
  );
}
