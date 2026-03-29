import { create } from 'zustand';

interface AppState {
  // ── Active scene ───────────────────────────────────────────────────────
  activeSceneId: string;
  setActiveScene: (sceneId: string) => void;

  // ── Anatomy visibility (keyed by canonical structure ID) ───────────────
  visibleStructures: Record<string, boolean>;
  toggleStructure: (id: string) => void;
  showAll: () => void;
  hideAll: () => void;
  showAllInCategory: (category: string, structures: string[]) => void;
  hideAllInCategory: (category: string, structures: string[]) => void;

  // ── Selection ──────────────────────────────────────────────────────────
  selectedStructure: string | null;
  setSelectedStructure: (id: string | null) => void;

  // ── Procedure step highlights ──────────────────────────────────────────
  highlightedStructures: string[];
  setHighlightedStructures: (ids: string[]) => void;

  // ── Procedure walkthrough ──────────────────────────────────────────────
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;

  // ── View mode ──────────────────────────────────────────────────────────
  viewMode: 'explore' | 'procedure';
  setViewMode: (mode: 'explore' | 'procedure') => void;

  // ── AI focus ───────────────────────────────────────────────────────────
  /** Canonical structure ID the AI assistant has focused (drives bounding box + camera) */
  aiFocusStructure: string | null;
  setAiFocusStructure: (id: string | null) => void;
  setStructureVisible: (id: string, visible: boolean) => void;
  /** World-space center of the focused structure's bounding box — set by StructureBoundingBox */
  aiFocusCenter: [number, number, number] | null;
  setAiFocusCenter: (center: [number, number, number] | null) => void;

  // ── Scene initialisation ───────────────────────────────────────────────
  /** Reset visibility to all-visible for the given canonical ID list */
  initStructures: (ids: string[]) => void;
}

// Default knee structures — canonical IDs matching anatomyData and modelMapping
const initialStructures: Record<string, boolean> = {
  femur: true,
  tibia: true,
  fibula: true,
  patella: true,
  acl: true,
  pcl: true,
  mcl: true,
  lcl: true,
  medial_meniscus: true,
  lateral_meniscus: true,
  articular_cartilage: true,
  patellar_tendon: true,
  quadriceps: true,
  hamstrings: true,
  gastrocnemius: true,
  other_muscles: true,
};

export const useAppStore = create<AppState>((set) => ({
  // ── Active scene ───────────────────────────────────────────────────────
  activeSceneId: 'knee',
  setActiveScene: (sceneId) =>
    set({
      activeSceneId: sceneId,
      selectedStructure: null,
      highlightedStructures: [],
      currentStep: 0,
      viewMode: 'explore',
    }),

  // ── Anatomy visibility ─────────────────────────────────────────────────
  visibleStructures: initialStructures,

  toggleStructure: (id) =>
    set((state) => ({
      visibleStructures: {
        ...state.visibleStructures,
        [id]: !state.visibleStructures[id],
      },
    })),

  showAll: () =>
    set((state) => ({
      visibleStructures: Object.fromEntries(
        Object.keys(state.visibleStructures).map((k) => [k, true])
      ),
    })),

  hideAll: () =>
    set((state) => ({
      visibleStructures: Object.fromEntries(
        Object.keys(state.visibleStructures).map((k) => [k, false])
      ),
    })),

  showAllInCategory: (_category, structures) =>
    set((state) => ({
      visibleStructures: {
        ...state.visibleStructures,
        ...Object.fromEntries(structures.map((id) => [id, true])),
      },
    })),

  hideAllInCategory: (_category, structures) =>
    set((state) => ({
      visibleStructures: {
        ...state.visibleStructures,
        ...Object.fromEntries(structures.map((id) => [id, false])),
      },
    })),

  // ── Selection ──────────────────────────────────────────────────────────
  selectedStructure: null,
  setSelectedStructure: (id) => set({ selectedStructure: id }),

  // ── Procedure step highlights ──────────────────────────────────────────
  highlightedStructures: [],
  setHighlightedStructures: (ids) => set({ highlightedStructures: ids }),

  // ── Procedure walkthrough ──────────────────────────────────────────────
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  totalSteps: 8,

  // ── View mode ──────────────────────────────────────────────────────────
  viewMode: 'explore',
  setViewMode: (mode) => set((state) => ({
    viewMode: mode,
    highlightedStructures: mode === 'explore' ? [] : state.highlightedStructures,
    selectedStructure: mode === 'explore' ? null : state.selectedStructure,
  })),

  // ── AI focus ───────────────────────────────────────────────────────────
  aiFocusStructure: null,
  setAiFocusStructure: (id) => set({ aiFocusStructure: id, aiFocusCenter: null }),
  setStructureVisible: (id, visible) =>
    set((state) => ({
      visibleStructures: { ...state.visibleStructures, [id]: visible },
    })),
  aiFocusCenter: null,
  setAiFocusCenter: (center) => set({ aiFocusCenter: center }),

  // ── Scene initialisation ───────────────────────────────────────────────
  initStructures: (ids) =>
    set({
      visibleStructures: Object.fromEntries(ids.map((id) => [id, true])),
      selectedStructure: null,
      highlightedStructures: [],
      currentStep: 0,
      viewMode: 'explore',
    }),
}));
