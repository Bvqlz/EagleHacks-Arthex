import { useState } from 'react';
import { anatomyData } from '../../data/anatomyData';
import type { AnatomyStructure } from '../../data/anatomyData';
import { useAppStore } from '../../store/appStore';
import ToggleSwitch from '../ui/ToggleSwitch';

const SECTIONS: {
  id: string;
  label: string;
  categories: AnatomyStructure['category'][];
  accentColor: string;
}[] = [
  { id: 'bones', label: 'Bones', categories: ['bone'], accentColor: '#F5E6D3' },
  { id: 'ligaments', label: 'Ligaments', categories: ['ligament'], accentColor: '#E85D75' },
  { id: 'softTissue', label: 'Soft Tissue', categories: ['meniscus', 'tendon', 'cartilage'], accentColor: '#4ECDC4' },
  { id: 'muscles', label: 'Muscles', categories: ['muscle'], accentColor: '#E57373' },
];

export default function AnatomySidebar() {
  const visibleStructures = useAppStore((s) => s.visibleStructures);
  const toggleStructure = useAppStore((s) => s.toggleStructure);
  const showAllInCategory = useAppStore((s) => s.showAllInCategory);
  const hideAllInCategory = useAppStore((s) => s.hideAllInCategory);
  const selectedStructure = useAppStore((s) => s.selectedStructure);
  const setSelectedStructure = useAppStore((s) => s.setSelectedStructure);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    bones: true,
    ligaments: true,
    softTissue: true,
    muscles: true,
  });

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="p-3 space-y-2 min-w-0">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-1 pt-1 pb-2">
        Anatomy
      </h2>

      {SECTIONS.map((section) => {
        const structures = anatomyData.filter((s) =>
          (section.categories as string[]).includes(s.category)
        );
        const structureIds = structures.map((s) => s.id);
        const isOpen = openSections[section.id];

        return (
          <div
            key={section.id}
            className="rounded-lg border border-slate-700/60 overflow-hidden bg-slate-900/40"
          >
            {/* Section header */}
            <div className="flex items-center px-3 py-2.5 gap-1.5">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center gap-2 flex-1 text-left min-w-0 group"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: section.accentColor }}
                />
                <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                  {section.label}
                </span>
                <span className="text-xs text-slate-600 ml-0.5 flex-shrink-0">
                  {structures.length}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-slate-500 ml-auto flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? '' : '-rotate-90'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Show All / Hide All */}
              {structures.length > 0 && (
                <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
                  <button
                    onClick={() => showAllInCategory(section.id, structureIds)}
                    title="Show all"
                    className="text-xs text-slate-600 hover:text-slate-300 px-1.5 py-0.5 rounded hover:bg-slate-700/50 transition-colors"
                  >
                    All
                  </button>
                  <span className="text-slate-700 text-xs">·</span>
                  <button
                    onClick={() => hideAllInCategory(section.id, structureIds)}
                    title="Hide all"
                    className="text-xs text-slate-600 hover:text-slate-300 px-1.5 py-0.5 rounded hover:bg-slate-700/50 transition-colors"
                  >
                    None
                  </button>
                </div>
              )}
            </div>

            {/* Collapsible structure list */}
            <div
              className="overflow-hidden transition-[max-height] duration-250 ease-in-out"
              style={{ maxHeight: isOpen ? '400px' : '0px' }}
            >
              {structures.length === 0 ? (
                <p className="text-xs text-slate-600 px-4 pb-3 border-t border-slate-700/50 pt-2">
                  No structures added yet
                </p>
              ) : (
                <ul className="border-t border-slate-700/50 divide-y divide-slate-700/30">
                  {structures.map((structure) => {
                    const isVisible = visibleStructures[structure.id] ?? true;
                    const isSelected = selectedStructure === structure.id;

                    return (
                      <li
                        key={structure.id}
                        className={`flex items-center gap-2.5 px-3 py-2 group transition-colors duration-100 ${
                          isSelected ? 'bg-accent/10' : 'hover:bg-slate-700/30'
                        }`}
                      >
                        {/* Color dot */}
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0 opacity-90"
                          style={{ backgroundColor: structure.color }}
                        />

                        {/* Structure name button */}
                        <button
                          onClick={() =>
                            setSelectedStructure(isSelected ? null : structure.id)
                          }
                          className={`flex-1 text-left text-xs truncate transition-colors min-w-0 ${
                            isSelected
                              ? 'text-white font-medium'
                              : 'text-slate-300 group-hover:text-white'
                          }`}
                          title={structure.label}
                        >
                          {structure.label}
                        </button>

                        {/* Visibility toggle */}
                        <div className="flex-shrink-0">
                          <ToggleSwitch
                            checked={isVisible}
                            onChange={() => toggleStructure(structure.id)}
                            color={structure.color}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
