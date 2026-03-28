# OrthoVision 3D — Architecture & Developer Guide

This document explains how the system is built, how each layer works, and how to extend it. It is written for developers who understand basic web development but may be new to React, TypeScript, Three.js, or Tailwind CSS.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [React + TypeScript](#2-react--typescript)
3. [Three.js & React Three Fiber — 3D Model Loading](#3-threejs--react-three-fiber--3d-model-loading)
4. [Tailwind CSS — UI Generation](#4-tailwind-css--ui-generation)
5. [Zustand — Shared State](#5-zustand--shared-state)
6. [ACL Reconstruction Walkthrough — Step System](#6-acl-reconstruction-walkthrough--step-system)
7. [LLM Research Agent Integration](#7-llm-research-agent-integration)
8. [File Map](#8-file-map)

---

## 1. Project Overview

OrthoVision 3D is a browser-based 3D educational tool for ACL reconstruction surgery. It has two audiences:

- **Surgeons / residents** — clinical terminology, instrument details, anatomical precision
- **Patients** — plain-language descriptions, reassuring tone, simplified step progression

The tech stack:

| Layer | Library | Version |
|---|---|---|
| UI framework | React | 19 |
| Language | TypeScript | 5.9 |
| 3D rendering | Three.js + React Three Fiber | Three 0.183, R3F 9 |
| 3D helpers | @react-three/drei | 10 |
| State management | Zustand | 5 |
| Styling | Tailwind CSS | 4 |
| Build tool | Vite | 8 |

---

## 2. React + TypeScript

### How React Works in This Project

React is a JavaScript library that describes UI as a **tree of components**. Each component is a function that returns JSX — a syntax extension that looks like HTML but is actually JavaScript.

```tsx
// A minimal React component
function Badge({ label }: { label: string }) {
  return <span className="bg-blue-500 text-white px-2 py-1">{label}</span>;
}
```

React re-renders a component whenever its **props** (passed-in values) or **state** (internal values managed with `useState`) change. It diffs the old and new output and applies only the changed parts to the real DOM — this is called reconciliation.

The component tree in this project:

```
App
└── ModeProvider          ← React Context: surgeon / patient mode
    └── Layout            ← Shell: TopBar + sidebar + viewport + panel
        ├── TopBar         ← View mode tabs + mode toggle
        ├── AnatomySidebar ← Structure list with toggle switches
        ├── KneeScene      ← R3F Canvas (3D rendering)
        │   ├── SceneLighting
        │   ├── KneeModel
        │   └── CameraController
        └── ProcedurePanel ← Step walkthrough, info card
```

**Hooks used:**

| Hook | What it does |
|---|---|
| `useState` | Local component state (e.g. sidebar open/closed) |
| `useEffect` | Side effects after render (e.g. clone materials, resize canvas) |
| `useRef` | Mutable value that doesn't trigger re-render (e.g. Three.js object refs) |
| `useMemo` | Memoize expensive computation (e.g. cloning Three.js materials) |
| `useContext` | Read from React Context (e.g. surgeon/patient mode) |

### How TypeScript Fits In

TypeScript adds **static types** to JavaScript. The compiler catches mistakes before the code runs. In this project, every component's props are typed with an interface or inline type annotation.

```tsx
// Without TypeScript (JavaScript)
function ToggleSwitch({ checked, onChange, color }) { ... }

// With TypeScript — the compiler rejects wrong prop types at build time
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string;   // ? means optional
}
function ToggleSwitch({ checked, onChange, color }: ToggleSwitchProps) { ... }
```

**Where TypeScript matters most in this project:**

- **Store types** (`src/store/appStore.ts`) — the `AppState` interface describes every field and action in the Zustand store. If a component reads `visibleStructures` and expects `Record<string, boolean>`, TypeScript enforces that throughout the codebase.
- **Three.js interop** — Three.js objects like `THREE.Mesh`, `THREE.MeshStandardMaterial`, and `THREE.Vector3` are fully typed. When you traverse a scene graph and cast `child as THREE.Mesh`, TypeScript gives you autocomplete for `.geometry`, `.material`, `.position`, etc.
- **R3F event types** — click and pointer events in React Three Fiber are typed as `ThreeEvent<MouseEvent>`. This ensures you can safely access `event.object.name`, `event.stopPropagation()`, etc.
- **Data files** — `src/data/anatomyData.ts` exports `AnatomyStructure[]` with an interface. Any component that imports it gets correct autocomplete and compile-time safety.

**To extend TypeScript types:**

- Adding a new field to the store: add it to the `AppState` interface in `appStore.ts`. TypeScript will immediately flag every place that needs updating.
- Adding a new anatomy structure property: add it to the `AnatomyStructure` interface in `anatomyData.ts`. TypeScript will require all existing entries to include it.
- Adding a new procedure step field: add it to `ProcedureStep` in `procedureSteps.ts`.

---

## 3. Three.js & React Three Fiber — 3D Model Loading

### How Three.js Renders 3D

Three.js is a WebGL abstraction library. It manages:

- A **Scene** — a tree of 3D objects
- A **Camera** — defines the viewpoint and field of view
- A **Renderer** — draws the scene to a `<canvas>` element using the GPU

Every visible object in the scene is a **Mesh**: a combination of **Geometry** (vertex positions, normals, UVs) and **Material** (how light interacts with the surface — color, roughness, metallicness, transparency).

### React Three Fiber (R3F)

R3F wraps Three.js in React. Instead of imperative Three.js code, you write declarative JSX:

```tsx
// Imperative Three.js (without R3F)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 'red' });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Declarative R3F
<mesh>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="red" />
</mesh>
```

R3F creates a **fiber renderer** — a second React renderer running in parallel with the DOM renderer. It maps JSX elements to Three.js objects. When React re-renders a component, R3F diffs the 3D scene tree the same way React diffs the DOM.

### Loading the GLB Model

The model file lives at `public/models/knee.glb`. It is loaded by the `useGLTF` hook from `@react-three/drei`:

```tsx
// src/components/scene/KneeModel.tsx
const { scene } = useGLTF('/models/knee.glb');
```

`useGLTF` uses Three.js's `GLTFLoader` under the hood. It returns the parsed scene graph. It also integrates with React's `<Suspense>` system — the component suspends (pauses rendering) while the file downloads, and resumes when it's ready. This is why `<KneeScene>` wraps `<KneeModel>` in `<Suspense fallback={null}>`.

**What `useGLTF` returns:**

```
gltf.scene       — the root THREE.Group containing the full model hierarchy
gltf.nodes       — flat dictionary: { nodeName: THREE.Object3D | THREE.Mesh }
gltf.materials   — flat dictionary: { materialName: THREE.Material }
gltf.animations  — animation clips (none in this model)
```

### The Model's Node Structure

This specific model (`knee.glb`) was exported from Sketchfab with 3 combined meshes:

```
Sketchfab_model                  ← root Group (has Y-up rotation matrix)
└── caa7834d....fbx              ← Group (has 0.01 scale — cm → units)
    └── RootNode
        └── Low
            ├── Bone_Low
            │   └── Bone_Low_bone_0          ← THREE.Mesh, material: "bone"
            ├── Mash_Low
            │   └── Mash_Low_mash_0          ← THREE.Mesh, material: "mash"
            └── Transparenty_Low
                └── Transparenty_Low_Opacyty_0  ← THREE.Mesh, material: "Opacyty"
```

**Key point:** This model does not have individual per-anatomy meshes. All bones (femur, tibia, patella, fibula) are baked into one mesh. All ligaments (ACL, PCL, MCL, LCL) are baked into one transparent mesh. This is a known limitation of the source asset.

**The mapping from anatomy IDs to meshes** is defined in `src/data/modelMapping.ts`:

```typescript
export const BONE_STRUCTURE_IDS = ['femur', 'tibia', 'fibula', 'patella'];
// → all map to mesh node: 'Bone_Low_bone_0'

export const LIGAMENT_STRUCTURE_IDS = ['acl', 'pcl', 'mcl', 'lcl'];
// → all map to mesh node: 'Transparenty_Low_Opacyty_0'

export const SOFT_TISSUE_STRUCTURE_IDS = ['medial_meniscus', ...];
// → all map to mesh node: 'Mash_Low_mash_0'
```

### Material Cloning and Animation

Three.js materials are shared by reference. If two meshes share the same `THREE.MeshStandardMaterial` instance and you change its `opacity`, both meshes change. To control each mesh independently, materials are cloned on mount:

```tsx
// In KneeModel.tsx — runs once via useEffect
scene.traverse((child) => {
  if (!(child instanceof THREE.Mesh)) return;
  const mat = (child.material as THREE.MeshStandardMaterial).clone();
  mat.transparent = true;
  mat.emissive = new THREE.Color('#F5E6D3');
  mat.emissiveIntensity = 0;
  child.material = mat;            // replace shared material with our owned clone
  matsRef.current[key] = mat;      // keep a ref for animation
});
```

Opacity and emissive glow are animated every frame using `useFrame` — R3F's animation loop:

```tsx
useFrame(() => {
  const lerp = THREE.MathUtils.lerp;
  mat.opacity = lerp(mat.opacity, targetOpacity, 0.09);       // smooth fade
  mat.emissiveIntensity = lerp(mat.emissiveIntensity, targetGlow, 0.09);
});
```

`lerp(current, target, 0.09)` moves 9% of the remaining distance each frame — this produces a smooth exponential approach that feels natural without requiring a fixed animation duration.

### Auto-Centering the Model

The GLB's geometry is in centimeters. After loading, the model's bounding box is computed and a wrapper group is scaled and repositioned so the model fills a ~2.8-unit sphere centered at the origin:

```tsx
const box = new THREE.Box3().setFromObject(scene);
const center = box.getCenter(new THREE.Vector3());
const maxDim = Math.max(...box.getSize(new THREE.Vector3()).toArray());
const scale = 2.8 / maxDim;
groupRef.current.scale.setScalar(scale);
groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
```

**To iterate on this:** If a new model with individual meshes is added, update `src/data/modelMapping.ts` with the new node names, then update the `MESH_TO_KEY` and `MESH_TO_PRIMARY_ID` maps in `KneeModel.tsx`. The rest of the visibility/selection system works automatically.

### Camera System

`CameraController.tsx` provides:

1. **OrbitControls** (`@react-three/drei`) — lets the user rotate, zoom, and pan the camera by dragging and scrolling. Constrained to `minDistance: 0.8`, `maxDistance: 5.5`, with damping (`dampingFactor: 0.08`) for smooth deceleration.

2. **Procedural animation** — when `currentStep` changes in procedure mode, the camera smoothly interpolates to a preset position using cubic ease-in-out over 1 second. OrbitControls are disabled during the animation and re-enabled after.

```typescript
// Named presets in CameraController.tsx
const CAMERA_VIEWS = {
  anterior:  [new THREE.Vector3(0, 0.1, 2.5), new THREE.Vector3(0, 0, 0)],
  posterior: [new THREE.Vector3(0, 0.1, -2.5), ...],
  superior:  [new THREE.Vector3(0, 2.8, 0.4), ...],
  // ...
};
```

**To add a new camera preset:** Add an entry to `CAMERA_VIEWS` and map it in `STEP_VIEWS` at the matching step index.

---

## 4. Tailwind CSS — UI Generation

### How Tailwind Works

Tailwind CSS is a utility-first CSS framework. Instead of writing `.sidebar { background: #1e293b; padding: 12px; }` in a separate stylesheet, you compose small single-purpose classes directly in JSX:

```tsx
// Tailwind: each class does one thing
<aside className="w-60 bg-slate-800 border-r border-slate-700 overflow-y-auto p-3">
```

**At build time**, Tailwind scans every `.tsx` file for class names. It generates a CSS file containing only the classes that are actually used. Classes that don't appear in the source code are not included. This is why the final CSS bundle (`dist/assets/index-*.css`) is small (~24 KB) despite Tailwind having thousands of utility classes.

### Tailwind v4 and Custom Tokens

This project uses Tailwind v4, which reads theme configuration from a CSS file (`src/styles/index.css`) using the `@theme` directive instead of a `tailwind.config.js` file:

```css
/* src/styles/index.css */
@import "tailwindcss";

@theme {
  --color-bone:        #F5E6D3;   /* warm cream — bone structures */
  --color-ligament:    #E85D75;   /* coral red — ligament structures */
  --color-soft-tissue: #4ECDC4;   /* teal — menisci, cartilage */
  --color-accent:      #3B82F6;   /* blue — UI interaction, selection */
  --color-surface:     #1E293B;   /* dark blue-gray — panel backgrounds */
  --color-background:  #0F172A;   /* near-black — main background */
}
```

Tailwind v4 reads these `--color-*` variables and generates utility classes automatically: `bg-bone`, `text-ligament`, `border-soft-tissue`, `bg-accent/20` (20% opacity), etc.

### Dark Theme Strategy

The dark theme is built from Tailwind's `slate` color scale:

| Role | Class | Value |
|---|---|---|
| Main background | `bg-slate-900` | `#0f172a` |
| Panel background | `bg-slate-800` | `#1e293b` |
| Top bar | `bg-slate-950` | `#020617` |
| Panel borders | `border-slate-700` | `#334155` |
| Secondary text | `text-slate-400` | `#94a3b8` |
| Primary text | `text-white` | `#ffffff` |

### Responsive / Interactive States

Tailwind uses **variant prefixes** for states and breakpoints:

```tsx
// hover: prefix — applies only on hover
<button className="text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">

// sm: prefix — applies at ≥640px screen width
<span className="hidden sm:block">Mode</span>

// focus: prefix — focus ring for accessibility
<button className="focus:outline-none focus:ring-2 focus:ring-accent">
```

### Animations

Smooth panel expand/collapse is handled via CSS transitions on arbitrary values:

```tsx
// Sidebar: width transitions between 240px and 0 in 300ms
<div
  className="transition-[width] duration-300 ease-in-out"
  style={{ width: sidebarOpen ? '240px' : '0px' }}
>
```

The accordion sections in `AnatomySidebar` use `max-height` transitions:

```tsx
<div
  className="overflow-hidden transition-[max-height] duration-250 ease-in-out"
  style={{ maxHeight: isOpen ? '400px' : '0px' }}
>
```

**To add a new color to the theme:** Add a `--color-yourname: #hexvalue` line to `@theme` in `src/styles/index.css`. Tailwind will generate `bg-yourname`, `text-yourname`, `border-yourname`, etc. immediately.

**To add a new component:** Create a `.tsx` file in `src/components/ui/`, export it, and add it to `src/components/index.ts`. Use Tailwind utility classes for styling. No separate CSS file needed.

---

## 5. Zustand — Shared State

Zustand is a minimal state management library. The store is defined once in `src/store/appStore.ts` and consumed by any component using the `useAppStore` hook.

```typescript
// Reading state — subscribes to changes in visibleStructures only
const visibleStructures = useAppStore((s) => s.visibleStructures);

// Reading an action — actions don't change, so this won't trigger re-renders
const toggleStructure = useAppStore((s) => s.toggleStructure);
```

The selector pattern (`(s) => s.field`) is critical for performance: a component only re-renders when the specific slice it selects changes, not on every store update.

**State flow:**

```
Sidebar toggle switch
    → toggleStructure('acl')
        → store: visibleStructures.acl = false
            → AnatomySidebar re-renders (toggle shows off)
            → KneeModel useFrame sees target opacity = 0.12 → lerps mesh opacity down
```

```
Sidebar structure name click
    → setSelectedStructure('acl')
        → store: selectedStructure = 'acl'
            → KneeModel useFrame sees ligament group selected → lerps emissive up
            → InfoCard re-renders with ACL description
```

```
TopBar "Procedure" tab
    → setViewMode('procedure')
        → store: viewMode = 'procedure'
            → Layout right panel slides in (CSS transition)
            → CameraController animates camera to step-0 preset
```

**To add new global state:** Add the field and its setter/action to the `AppState` interface and `create()` call in `appStore.ts`. TypeScript will immediately surface all the places that need updating.

---

## 6. ACL Reconstruction Walkthrough — Step System

### Data Layer

The walkthrough content lives in `src/data/procedureSteps.ts` (TypeScript) and `src/data/procedureSteps.json` (JSON). Each step has:

```typescript
interface ProcedureStep {
  id: string;
  title: string;
  surgeonTitle: string;          // shown in surgeon mode
  patientTitle: string;          // shown in patient mode
  surgeonDescription: string;    // clinical detail
  patientDescription: string;    // plain language
  instruments: string[];         // Arthrex product names → Badge components
  focusStructures: string[];     // anatomy IDs to highlight in 3D scene
  cameraPosition?: [number, number, number]; // optional override
}
```

The `focusStructures` array drives two things simultaneously:
1. The 3D model highlights those structures (emissive glow)
2. The sidebar shows them as "selected" (accent background)

### The 8-Step ACL Walkthrough

| Step | Title | Camera | Focus Structures |
|---|---|---|---|
| 1 | Diagnosis & Examination | anterior | `acl` |
| 2 | Anesthesia & Portal Placement | anterior | none |
| 3 | Diagnostic Arthroscopy | anterior | `acl`, `medial_meniscus`, `lateral_meniscus` |
| 4 | Graft Harvesting | medial | `patellar_tendon` |
| 5 | Tibial Tunnel Drilling | inferior | `tibia`, `acl` |
| 6 | Femoral Tunnel Drilling | superior | `femur`, `acl` |
| 7 | Graft Passage & Fixation | anterior | `acl` |
| 8 | Final Assessment & Closure | default | all structures |

### How a Step Change Propagates

When the user clicks "Next" in `ProcedurePanel`:

```
ProcedurePanel: setCurrentStep(currentStep + 1)
    ↓
Zustand store: currentStep = 3
    ↓
ProcedurePanel re-renders: shows step 3 content (title, description, instruments)
    ↓
CameraController useEffect fires: begins 1s camera animation to step 3 preset ("medial")
    ↓
KneeModel useFrame: reads step 3's focusStructures → applies emissive glow to patellar tendon mesh
```

The `useContent` hook (`src/hooks/useContent.ts`) abstracts the mode switch:

```typescript
const { getText } = useContent();
// Returns surgeonDescription in surgeon mode, patientDescription in patient mode
const description = getText(step.surgeonDescription, step.patientDescription);
```

### Extending the Walkthrough

- **Add a step:** Add an entry to the `procedureSteps` array. The UI (ProgressBar, navigation) automatically adjusts — `totalSteps` is derived from the array length.
- **Add a new camera angle:** Add a preset to `CAMERA_VIEWS` in `CameraController.tsx` and reference it in `STEP_VIEWS`.
- **Add a new instrument badge:** Add the name string to the step's `instruments` array. `ProcedurePanel` maps these to `<Badge variant="instrument">` components automatically.
- **Add step-level anatomy highlighting:** Add the structure ID to `focusStructures`. The 3D model's selection system handles the glow — no additional code needed.

---

## 7. LLM Research Agent Integration

An LLM research agent is responsible for generating the text content that powers the educational layer of the app. This is separated from the code layer by design — the agent writes to JSON files that the app reads, so content can be updated without changing TypeScript source.

### What the Agent Produces

**`src/data/anatomyData.json`** — descriptions for all 12 knee structures:

```json
{
  "structures": [
    {
      "id": "acl",
      "name": "Anterior Cruciate Ligament",
      "category": "ligament",
      "color": "#E85D75",
      "surgeon_description": "Clinical detail about the ACL...",
      "patient_description": "Plain-language explanation...",
      "fun_fact": "Memorable single sentence."
    }
  ]
}
```

**`src/data/procedureSteps.json`** — 8-step ACL reconstruction content:

```json
{
  "procedure": "ACL Reconstruction",
  "steps": [
    {
      "step": 1,
      "title": "Diagnosis & Examination",
      "surgeon_description": "Clinical walkthrough...",
      "patient_description": "Patient-friendly explanation...",
      "instruments": ["Arthroscope", "Lachman Test", "MRI"],
      "anatomy_highlight": ["acl"],
      "camera_focus": "anterior"
    }
  ]
}
```

### How the App Consumes This Content

The JSON files are imported directly into the TypeScript data layer. The `anatomyData.ts` file re-exports them as typed objects, so the rest of the app uses them via the typed interface:

```typescript
// src/data/anatomyData.ts
import rawData from './anatomyData.json';
export const anatomyData: AnatomyStructure[] = rawData.structures;
```

The `useContent` hook reads `ModeContext` and returns the right text version:

```typescript
function useContent() {
  const { mode } = useModeContext();
  const getText = (surgeonText: string, patientText: string) =>
    mode === 'surgeon' ? surgeonText : patientText;
  return { getText };
}
```

### Agent Iteration Workflow

1. **Agent generates** → writes `anatomyData.json` and `procedureSteps.json`
2. **TypeScript validates** → `npm run build` catches any structural mismatches
3. **Developer reviews** → opens the app, clicks through each step and each anatomy structure
4. **Refinement cycle** → agent re-runs with feedback ("make surgeon descriptions more technical", "patient description for ACL is too scary")
5. **No code changes required** for content iteration — only the JSON files change

**To add a new procedure:** Create a new JSON file (e.g. `src/data/meniscusRepair.json`), import it in a new `procedureSteps-meniscus.ts`, and add a route or mode selector to `viewMode` in the store.

**To add a new anatomy structure:** Add an entry to `anatomyData.json`, add the ID to `appStore.ts`'s `initialStructures`, and add an entry to `src/data/modelMapping.ts`. If the model has a corresponding mesh node, add it to `MESH_TO_KEY` in `KneeModel.tsx`.

### Research Sources for the Agent

The agent should cite/use these sources for accurate content:

- **Arthrex product catalog** — arthrex.com/knee — for correct instrument names and procedure steps
- **Orthopedic patient education** — patient.orthopedia.com — for plain-language descriptions
- **ACL reconstruction literature** — for surgeon-mode clinical descriptions
- **Arthrex surgical technique guides** — PDF guides available on arthrex.com for ACL reconstruction using TightRope RT, RetroButton, and hamstring graft systems

**Key Arthrex products to reference:**

| Product | Step Used |
|---|---|
| ACL TightRope RT | Femoral fixation (Step 6–7) |
| RetroButton | Cortical femoral fixation |
| PEEK Interference Screw | Tibial fixation (Step 7) |
| Bio-Tenodesis Screw | Soft-tissue tibial fixation |
| FlipCutter III | Retrograde femoral tunnel drilling (Step 6) |
| Hamstring Graft Preparation Board | Graft prep (Step 4) |
| Tibial Aiming Device | Tibial guide placement (Step 5) |
| PassPort Cannula | Portal access (Step 2) |

---

## 8. File Map

```
arthrex-challenge/
├── public/
│   └── models/
│       └── knee.glb                 ← 3D model (15 MB, 3 mesh groups)
│       └── knee-anatomy/
│           └── source/Knee Anatomy.fbx  ← original FBX source (3 mesh groups confirmed)
│
├── src/
│   ├── main.tsx                     ← entry point, mounts <App>
│   ├── App.tsx                      ← wraps in ModeProvider + Layout
│   │
│   ├── styles/
│   │   └── index.css                ← Tailwind import + @theme custom colors
│   │
│   ├── store/
│   │   └── appStore.ts              ← Zustand store (all shared state)
│   │
│   ├── context/
│   │   └── ModeContext.tsx          ← surgeon / patient mode React Context
│   │
│   ├── hooks/
│   │   └── useContent.ts            ← mode-aware text selector hook
│   │
│   ├── data/
│   │   ├── anatomyData.ts           ← TypeScript types + re-export from JSON
│   │   ├── anatomyData.json         ← LLM-generated anatomy descriptions ← AGENT OUTPUT
│   │   ├── procedureSteps.ts        ← TypeScript types + re-export from JSON
│   │   ├── procedureSteps.json      ← LLM-generated procedure content    ← AGENT OUTPUT
│   │   └── modelMapping.ts          ← maps anatomy IDs → GLB node names
│   │
│   ├── components/
│   │   ├── index.ts                 ← barrel exports
│   │   │
│   │   ├── layout/
│   │   │   ├── Layout.tsx           ← main shell (sidebar + viewport + panel)
│   │   │   ├── TopBar.tsx           ← logo + view mode tabs + mode toggle
│   │   │   └── AnatomySidebar.tsx   ← collapsible anatomy section toggles
│   │   │
│   │   ├── scene/
│   │   │   ├── KneeScene.tsx        ← R3F Canvas + Suspense + loading overlay
│   │   │   ├── KneeModel.tsx        ← GLB loader, material animation, click/hover
│   │   │   ├── SceneLighting.tsx    ← ambient + key + fill + rim lights
│   │   │   └── CameraController.tsx ← OrbitControls + procedure camera animation
│   │   │
│   │   ├── procedure/
│   │   │   ├── ProcedurePanel.tsx   ← step navigation + content display
│   │   │   └── InfoCard.tsx         ← floating overlay for selected structure
│   │   │
│   │   └── ui/
│   │       ├── Badge.tsx            ← pill label (instrument / category / default)
│   │       ├── ToggleSwitch.tsx     ← animated on/off toggle with color tint
│   │       ├── ProgressBar.tsx      ← step progress indicator
│   │       ├── LoadingSpinner.tsx   ← 3D scene loading indicator
│   │       └── WelcomeModal.tsx     ← mode selection on first load
│
├── README.md                        ← setup, folder ownership, architecture overview
├── ARCHITECTURE.md                  ← this file
└── pitch-deck-content.md            ← hackathon pitch content
```

---

*Built for the Arthrex Hackathon. Model: Sketchfab knee anatomy (3-mesh low-poly). Stack: React 19 + TypeScript 5.9 + React Three Fiber 9 + Tailwind CSS 4 + Zustand 5.*
