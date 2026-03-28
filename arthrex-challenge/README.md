# Arthrex Challenge — Interactive Knee Anatomy & Surgical Procedure Explorer

A 3D web application for interactive knee anatomy education and ACL reconstruction walkthrough, built for the Arthrex Hackathon.

---

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Folder Ownership

| Folder / File | Owner | Description |
|---|---|---|
| `src/components/scene/` | **You** | R3F Canvas, GLB model, lighting, camera |
| `src/components/layout/` | **Teammate B** | App shell, sidebar, top bar |
| `src/components/ui/` | **Teammate B** | Toggle, badge, progress bar |
| `src/store/appStore.ts` | **Teammate B** | Zustand shared state |
| `src/components/procedure/` | **Teammate A** | Step panel, info card, welcome modal |
| `src/context/ModeContext.tsx` | **Teammate A** | Surgeon / Patient mode provider |
| `src/data/` | **Teammate A** | Anatomy descriptions, procedure steps |
| `src/hooks/useContent.ts` | **Teammate A** | Mode-aware content selector hook |
| `pitch-deck-content.md` | **Teammate A** | Hackathon pitch content |

---

## Adding the GLB Model

1. Place the knee model file at `public/models/knee.glb`
2. Open the file in a GLTF viewer (e.g. [gltf.report](https://gltf.report/)) to inspect mesh names
3. Update the structure IDs in `src/store/appStore.ts` (`initialStructures`) to match the actual mesh/node names in the file
4. Update the `id` fields in `src/data/anatomyData.ts` to match as well
5. Implement `src/components/scene/KneeModel.tsx` to load and render the model

---

## Architecture Overview

```
App
└── ModeProvider (context/ModeContext.tsx)
    └── Layout
        ├── TopBar
        ├── AnatomySidebar ─── useAppStore (visibleStructures)
        ├── KneeScene (R3F Canvas)
        │   ├── SceneLighting
        │   ├── KneeModel ──── useAppStore (visibleStructures, selectedStructure)
        │   └── CameraController
        │   [overlay] InfoCard ─ useAppStore (selectedStructure) + useContent
        └── ProcedurePanel ─── useAppStore (currentStep, viewMode) + useContent
            └── [modal] WelcomeModal ─ useModeContext
```

---

## State Management

All shared UI state lives in `src/store/appStore.ts` (Zustand):

- `visibleStructures` — which anatomy meshes are shown in the 3D scene
- `selectedStructure` — which structure is currently highlighted / showing InfoCard
- `currentStep` / `totalSteps` — procedure walkthrough position
- `viewMode` — `'explore'` or `'procedure'`

Surgeon/Patient mode lives separately in `ModeContext` (React Context) since it's a user preference that affects text rendering rather than 3D scene state.
