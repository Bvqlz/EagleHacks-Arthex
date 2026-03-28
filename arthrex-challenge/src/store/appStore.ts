import { create } from 'zustand';

interface AppState {
  // Anatomy visibility
  visibleStructures: Record<string, boolean>;
  toggleStructure: (id: string) => void;
  showAll: () => void;
  hideAll: () => void;
  showAllInCategory: (category: string, structures: string[]) => void;
  hideAllInCategory: (category: string, structures: string[]) => void;

  // Selection
  selectedStructure: string | null;
  setSelectedStructure: (id: string | null) => void;

  // Procedure walkthrough
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;

  // View mode
  viewMode: 'explore' | 'procedure';
  setViewMode: (mode: 'explore' | 'procedure') => void;
}

// Initialize with all structures visible
// Structure IDs will be updated once we inspect the GLB model
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
};

export const useAppStore = create<AppState>((set) => ({
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

  selectedStructure: null,
  setSelectedStructure: (id) => set({ selectedStructure: id }),

  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  totalSteps: 8,

  viewMode: 'explore',
  setViewMode: (mode) => set({ viewMode: mode }),
}));
