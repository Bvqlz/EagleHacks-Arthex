# OrthoVision 3D — Architecture & Developer Guide

This document explains how the system is built, how each layer works, and how to extend it. It is written for developers who understand basic web development but may be new to React, TypeScript, Three.js, or Tailwind CSS.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [React + TypeScript](#2-react--typescript)
3. [Three.js & React Three Fiber — 3D Model Loading](#3-threejs--react-three-fiber--3d-model-loading)
4. [Tailwind CSS — UI Generation](#4-tailwind-css--ui-generation)
5. [Zustand — Shared State](#5-zustand--shared-state)
6. [Multi-Scene Architecture](#6-multi-scene-architecture)
7. [ACL Reconstruction Walkthrough — Step System](#7-acl-reconstruction-walkthrough--step-system)
8. [Hand Tracking Sidecar](#8-hand-tracking-sidecar)
9. [File Map](#9-file-map)

---

## 1. Project Overview

OrthoVision 3D is a browser-based 3D educational tool for orthopaedic surgery. It has two audiences:

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
| Hand tracking | MediaPipe Hands (Python sidecar) | mediapipe 0.10.21 |

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

React re-renders a component whenever its **props** (passed-in values) or **state** (internal values managed with `useState`) change.

The component tree in this project:

```
App
└── ModeProvider              ← React Context: surgeon / patient mode
    ├── Layout                ← Shell: TopBar + sidebar + viewport + right panel
    │   ├── TopBar            ← Logo + view mode tabs (Explore/Procedure) + mode toggle
    │   ├── AnatomySidebar    ← Collapsible structure groups with toggle switches
    │   ├── JointScene        ← R3F Canvas (3D rendering)
    │   │   ├── SceneLighting
    │   │   ├── JointModel    ← GLB mesh rendering + selection + visibility
    │   │   └── CameraController  ← OrbitControls + procedure camera + gesture drive
    │   ├── InfoCard          ← Floating overlay for selected structure
    │   └── GestureOverlay    ← Hand tracking status + active gesture label
    └── WelcomeModal          ← Mode selection on first load
```

**Hooks used:**

| Hook | What it does |
|---|---|
| `useState` | Local component state (e.g. sidebar open/closed, section collapse) |
| `useEffect` | Side effects after render (e.g. camera reset on scene change) |
| `useRef` | Mutable value that doesn't trigger re-render (e.g. Three.js object refs, WebSocket ref) |
| `useMemo` | Memoize expensive computation (e.g. building the controlled/background mesh lists) |
| `useContext` | Read from React Context (surgeon/patient mode) |

### How TypeScript Fits In

TypeScript adds **static types** to JavaScript. Every component's props, store shapes, and data structures are typed.

**Where TypeScript matters most:**

- **`SceneConfig`** (`src/data/scenes/types.ts`) — the shape of every scene definition (structures, camera positions, procedure steps). Any scene file that doesn't match the interface is a compile error.
- **`AppState`** (`src/store/appStore.ts`) — describes every field and action in the main Zustand store.
- **`GestureStore`** (`src/store/gestureStore.ts`) — describes the hand tracking rates emitted by the Python sidecar.
- **`AnatomyStructure`** (`src/data/anatomyData.ts`) — typed inline array; `anatomyById` lookup is derived from it.
- **`StructureId`** (`src/data/modelMapping.ts`) — a `const` union of all canonical structure ID strings. TypeScript rejects any code that uses an unknown ID.
- **Three.js interop** — `THREE.Mesh`, `THREE.MeshStandardMaterial`, `THREE.Vector3` are fully typed. Cast `child as THREE.Mesh` to get autocomplete on `.geometry`, `.material`, etc.
- **R3F event types** — click and pointer events are typed as `ThreeEvent<MouseEvent>`. Provides `.object.name`, `.stopPropagation()`, etc.

---

## 3. Three.js & React Three Fiber — 3D Model Loading

### How Three.js Renders 3D

Three.js manages a **Scene**, a **Camera**, and a **Renderer** that draws to a `<canvas>` using WebGL. Every visible object is a **Mesh** = Geometry (vertices) + Material (surface properties).

### React Three Fiber (R3F)

R3F wraps Three.js in React. Instead of imperative API calls, you write declarative JSX:

```tsx
// Declarative R3F
<mesh>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="red" />
</mesh>
```

R3F creates a second React renderer (the "fiber" renderer) running alongside the DOM renderer. When React re-renders, R3F diffs the 3D scene tree the same way React diffs the DOM.

### The 3D Model

The model file is `public/models/lower-limb.glb`. It is a real-world-scale anatomical model of the lower limb (~462 nodes, ~452 meshes) loaded by `useGLTF`:

```tsx
// src/components/scene/JointModel.tsx
useGLTF.preload('/models/lower-limb.glb');
const gltf = useGLTF('/models/lower-limb.glb');
```

Unlike the original Sketchfab 3-mesh prototype, this model has **individual mesh nodes per anatomical structure** — each ligament, bone, and muscle is a separate `THREE.Mesh` with its own node name.

**Node name sanitization**

Three.js `GLTFLoader` modifies node names during parsing:
- Spaces → underscore `_`
- Dots → removed entirely

```
"Anterior cruciate ligament.r" → "Anterior_cruciate_ligamentr"
"Femur.r"                      → "Femurr"
"Art cart of femur distal end.r" → "Art_cart_of_femur_distal_endr"
```

This is handled by `sanitizeNodeName()` in `JointModel.tsx` when building the allowlist, and by the normalisation in `resolveStructureId()` in `modelMapping.ts`:

```typescript
function resolveStructureId(meshName: string): StructureId | null {
  const key = meshName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/, '');
  return MESH_NAME_ALIASES[key] ?? null;
}
```

### Controlled vs. Background Meshes

`JointModel` splits the scene into two categories:

| Type | Description | Interaction |
|---|---|---|
| **Controlled** | Resolves to a canonical `StructureId` via `MESH_NAME_ALIASES` | Toggleable, selectable, animated |
| **Background** | Listed in `config.structures` but no canonical ID | Always visible, not interactive |

Only meshes whose sanitized names appear in the active `SceneConfig.structures` array are rendered — all other nodes (veins, nerves, skin, etc.) are filtered out.

```typescript
// JointModel.tsx — allowlist from config
const allowedNames = useMemo(
  () => new Set(config.structures.map((s) => sanitizeNodeName(s.nodeName))),
  [config.structures]
);
```

### Material Cloning and Animation

Materials are shared by reference in the GLB. To control each mesh independently, `StructureMesh` clones the material with `useMemo`:

```tsx
const mat = useMemo(() => {
  const m = (originalMaterial as THREE.MeshStandardMaterial).clone();
  m.transparent = true;
  m.emissive = new THREE.Color(0);
  return m;
}, [originalMaterial]);
```

Opacity and emissive glow are animated every frame in `useFrame` with exponential lerp:

```tsx
useFrame(() => {
  const targetOpacity   = isVisible ? baseOpacity : 0.05;
  const targetIntensity = isSelected ? 0.45 : isHighlighted ? 0.25 : 0.0;

  mat.opacity           = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);
  mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetIntensity, 0.1);
  // ...
});
```

`lerp(current, target, 0.08)` moves 8% of the remaining distance each frame — a smooth exponential approach that needs no fixed animation duration.

**Emissive color by structure type** is defined in `STRUCTURE_EMISSIVE` in `modelMapping.ts`:

| Category | Color |
|---|---|
| bone | `#F5E6D3` warm cream |
| ligament | `#E85D75` coral red |
| meniscus | `#4ECDC4` teal |
| cartilage | `#85C1E9` light blue |
| tendon | `#F39C12` amber |
| muscle | `#E57373` salmon red |

Selected structures get an accent-blue emissive (`#3B82F6`) and a 2.5% scale-up.

### Lighting

`SceneLighting` uses a 3-point medical visualization setup:

| Light | Position | Color | Role |
|---|---|---|---|
| Ambient | global | `#e8eeff` cool white | Soft fill, prevents pure black shadows |
| Key (directional) | upper-right front | `#fff8f0` warm clinical white | Primary shading, casts shadows |
| Fill (directional) | lower-left rear | `#c0d8ff` cool blue | Separates depth planes |
| Rim (directional) | directly behind | `#ffffff` | Silhouette separation |

### Camera System

`CameraController` provides three behaviours that run together in `useFrame`:

1. **OrbitControls** (`@react-three/drei`) — mouse/touch drag, scroll zoom. Constrained to `minDistance: 0.05`, `maxDistance: 2.5`, with `dampingFactor: 0.06`.

2. **Gesture-driven control** — reads `gestureStore` each frame and applies zoom, rotateX, and rotateY rates scaled by `delta` time. This overrides OrbitControls while active and cancels any in-progress procedural animation.

3. **Procedural animation** — when `currentStep` changes in procedure mode, the camera smoothly lerps to the step's `cameraFocus` preset using `1 - Math.pow(0.001, delta)` per frame (exponential approach).

Camera presets come from `SceneConfig.cameraPositions` — six named views (`default`, `anterior`, `posterior`, `lateral`, `medial`, `superior`, `inferior`) each with a `position` and `target`.

---

## 4. Tailwind CSS — UI Generation

### How Tailwind Works

Tailwind CSS is a utility-first CSS framework. Classes are composed directly in JSX rather than in separate stylesheets:

```tsx
<aside className="w-60 bg-slate-800 border-r border-slate-700 overflow-y-auto p-3">
```

At build time, Tailwind scans every `.tsx` file and generates only the classes that are used. The final CSS bundle is ~24 KB.

### Tailwind v4 and Custom Tokens

This project uses Tailwind v4, configured via the `@theme` directive in `src/styles/index.css`:

```css
@theme {
  --color-bone:        #F5E6D3;   /* warm cream — bone structures */
  --color-ligament:    #E85D75;   /* coral red — ligament structures */
  --color-soft-tissue: #4ECDC4;   /* teal — menisci, cartilage */
  --color-accent:      #3B82F6;   /* blue — UI interaction, selection */
  --color-surface:     #1E293B;   /* dark blue-gray — panel backgrounds */
  --color-background:  #0F172A;   /* near-black — main background */
}
```

Tailwind v4 auto-generates `bg-bone`, `text-ligament`, `border-soft-tissue`, `bg-accent/20` (20% opacity), etc. from these variables.

### Dark Theme

| Role | Class | Value |
|---|---|---|
| Main background | `bg-slate-900` | `#0f172a` |
| Panel background | `bg-slate-800` | `#1e293b` |
| Top bar | `bg-slate-950` | `#020617` |
| Panel borders | `border-slate-700` | `#334155` |
| Secondary text | `text-slate-400` | `#94a3b8` |
| Primary text | `text-white` | `#ffffff` |

### Panel Animations

The sidebar (left) and procedure panel (right) slide open/closed via CSS `width` transitions:

```tsx
<div
  className="transition-[width] duration-300 ease-in-out"
  style={{ width: sidebarOpen ? '240px' : '0px' }}
>
```

`AnatomySidebar` accordion sections use `max-height` transitions:

```tsx
<div
  className="overflow-hidden transition-[max-height] duration-250 ease-in-out"
  style={{ maxHeight: isOpen ? '400px' : '0px' }}
>
```

---

## 5. Zustand — Shared State

There are two independent Zustand stores.

### `appStore` (`src/store/appStore.ts`)

The main application state.

```typescript
interface AppState {
  activeSceneId: string;         // 'knee' | 'hip' | 'ankle'
  visibleStructures: Record<string, boolean>;
  selectedStructure: string | null;
  highlightedStructures: string[];
  currentStep: number;
  totalSteps: number;             // 8 (derived from procedureSteps array length)
  viewMode: 'explore' | 'procedure';
  // ... actions: setActiveScene, toggleStructure, showAll, hideAll,
  //              showAllInCategory, hideAllInCategory, setSelectedStructure,
  //              setHighlightedStructures, setCurrentStep, setViewMode, initStructures
}
```

**Switching scenes** (`setActiveScene`) resets `selectedStructure`, `highlightedStructures`, `currentStep`, and `viewMode` to defaults.

**`initStructures(ids)`** is called to re-initialize `visibleStructures` to all-visible for a new set of canonical IDs. Use this when adding a new scene.

**State flow example:**

```
Sidebar toggle switch
    → toggleStructure('acl')
        → store: visibleStructures.acl = false
            → AnatomySidebar re-renders (toggle shows off)
            → JointModel StructureMesh useFrame sees target opacity = 0.05 → lerps down
```

```
Structure name click
    → setSelectedStructure('acl')
        → store: selectedStructure = 'acl'
            → StructureMesh useFrame: emissive lerps to accent blue + scale 1.025
            → InfoCard renders with ACL descriptions
```

```
TopBar "Procedure" tab
    → setViewMode('procedure')
        → store: viewMode = 'procedure'
            → Layout right panel width transitions from 0 → 320px
            → CameraController useEffect fires → begins lerp to step-0 camera preset
```

### `gestureStore` (`src/store/gestureStore.ts`)

Holds real-time rate values streamed from the Python hand tracking sidecar over WebSocket.

```typescript
interface GestureStore {
  connected:   boolean;
  gesture:     string | null;   // 'zoom' | 'point_rotate' | 'fist_holding' | 'reset' | null
  hands:       number;          // 0, 1, or 2
  zoomRate:    number;          // camera distance change rate (per second)
  spinYRate:   number;          // reserved — always 0 currently
  rotateXRate: number;          // pitch rate (rad/s)
  rotateYRate: number;          // yaw rate (rad/s)
  reset:       boolean;
  // actions: update, setConnected, consumeReset
}
```

`CameraController` calls `useGestureStore.getState()` inside `useFrame` (not the hook) to read rates without causing React re-renders.

`GestureOverlay` uses the Zustand hook (`useGestureStore((s) => s.connected)`) — it only re-renders when those specific fields change.

---

## 6. Multi-Scene Architecture

The app supports multiple joints (knee, hip, ankle) through a shared `SceneConfig` type.

### `SceneConfig` (`src/data/scenes/types.ts`)

```typescript
interface SceneConfig {
  id: string;
  name: string;
  description: string;
  structures: JointStructure[];           // explicit allowlist of mesh nodes to render
  cameraPositions: {
    default, anterior, posterior,
    lateral, medial, superior, inferior   // each: { position, target }
  };
  procedure: {
    name: string;
    steps: ProcedureStep[];
  } | null;                               // null = explore-only scene
  anatomyDescriptions: Record<string, { ... }>;
}
```

`JointStructure` describes a single mesh:

```typescript
interface JointStructure {
  nodeName: string;     // exact GLB name, e.g. "Anterior cruciate ligament.r"
  displayName: string;  // UI label, e.g. "ACL"
  category: 'bone' | 'ligament' | 'muscle';
  group: string;        // sidebar group header, e.g. "Cruciate Ligaments"
}
```

### Scene Registry

```typescript
// src/data/scenes/index.ts
export const scenes: Record<string, SceneConfig> = {
  knee:  kneeScene,   // full scene: 45 structures, 8-step ACL reconstruction
  hip:   hipScene,    // placeholder — structures array empty, no procedure
  ankle: ankleScene,  // placeholder — structures array empty, no procedure
};
```

`Layout` reads `activeSceneId` from `appStore` and passes `scenes[activeSceneId]` as a `config` prop down to `JointScene`, `JointModel`, and `CameraController`. Every component is scene-agnostic — they read everything from `config`.

### The Knee Scene

`src/data/scenes/knee.ts` defines 45 structures across 8 sidebar groups:

| Group | Structures |
|---|---|
| Bones | Femur, Tibia, Fibula, Patella |
| Cartilage | Femoral, Tibial, Patellar, Prox. Tibiofib. cartilages |
| Menisci | Medial, Lateral (+ individual horns) |
| Cruciate Ligaments | ACL, PCL |
| Collateral & Capsule | LCL, Joint Capsule, Transverse Lig., Meniscofemoral Lig., Prox. Tibiofib. Ligs., IT Band, Synovial Membrane |
| Quadriceps | Rectus Femoris, Vastus ×3, Articularis Genus, Patellar Tendon, Infrapatellar Fat Pad |
| Hamstrings | Semimembranosus, Semitendinosus, Biceps Femoris ×2 (+ tendons), Pes Anserinus |
| Calf | Gastrocnemius (Medial/Lateral), Plantaris |
| Other | Popliteus, Sartorius, Gracilis |

Camera positions are in real-world metre scale. The knee joint midpoint is approximately `X≈-0.09, Y≈0.45, Z≈0.00` in the lower-limb model's coordinate system.

### Adding a New Scene

1. Create `src/data/scenes/yourjoint.ts` implementing `SceneConfig`.
2. Populate `structures` with `nodeName` values from the GLB. (Inspect with `console.log` of `gltf.scene` or use Blender/glTF viewer.)
3. Add camera presets tuned to the joint's bounding box.
4. Register it in `src/data/scenes/index.ts`.
5. Add anatomy descriptions to `anatomyData.ts` for any structures you want to make selectable.
6. Add entries to `MESH_NAME_ALIASES` in `modelMapping.ts` for the new canonical IDs.

---

## 7. ACL Reconstruction Walkthrough — Step System

### Data Layer

All step content lives in `src/data/procedureSteps.ts` as a plain TypeScript array. Each step implements:

```typescript
interface ProcedureStep {
  id: string;
  title: string;
  surgeonTitle: string;
  patientTitle: string;
  surgeonDescription: string;   // clinical detail
  patientDescription: string;   // plain language
  instruments: string[];        // Arthrex product/instrument names
  focusStructures: string[];    // canonical structure IDs to highlight
  cameraPosition?: [number, number, number];
}
```

`focusStructures` simultaneously drives:
1. The 3D emissive highlight (via `highlightedStructures` in `appStore`)
2. The "Anatomy Focus" badge list in `ProcedurePanel`

### The 8-Step ACL Walkthrough

| # | Step ID | Title | Focus Structures |
|---|---|---|---|
| 1 | `step_01_diagnosis` | Diagnosis & Examination | acl, femur, tibia, medial_meniscus, lateral_meniscus |
| 2 | `step_02_anesthesia_portals` | Anesthesia & Portal Placement | femur, tibia, patella, patellar_tendon |
| 3 | `step_03_diagnostic_arthroscopy` | Diagnostic Arthroscopy | acl, medial_meniscus, lateral_meniscus, articular_cartilage, femur, tibia |
| 4 | `step_04_graft_harvest` | Graft Harvesting | patellar_tendon, patella, tibia |
| 5 | `step_05_tibial_tunnel` | Tibial Tunnel Drilling | tibia, acl, medial_meniscus, lateral_meniscus |
| 6 | `step_06_femoral_tunnel` | Femoral Tunnel Drilling | femur, acl, articular_cartilage |
| 7 | `step_07_graft_passage_fixation` | Graft Passage & Fixation | acl, femur, tibia |
| 8 | `step_08_assessment_closure` | Final Assessment & Closure | acl, femur, tibia, medial_meniscus, lateral_meniscus, articular_cartilage |

### How a Step Change Propagates

```
ProcedurePanel: setCurrentStep(n)
    ↓
appStore: currentStep = n
    ↓
ProcedurePanel re-renders: shows step n (title, description, instruments, focus badges)
    ↓
CameraController useEffect: reads config.procedure.steps[n].cameraFocus
                            → starts lerp to that named camera preset
    ↓
JointModel StructureMesh useFrame: reads highlightedStructures
                                   → applies emissive glow to focus structures
```

### `useContent` Hook

Abstracts mode switching so components don't touch `ModeContext` directly:

```typescript
const { getText } = useContent();
// mode = 'surgeon' → reads obj.surgeonDescription
// mode = 'patient' → reads obj.patientDescription
const desc = getText(step as unknown as Record<string, unknown>, 'Description');
const title = getText(step as unknown as Record<string, unknown>, 'Title');
```

### Extending the Walkthrough

- **Add a step:** Append to the `procedureSteps` array. `totalSteps` is hardcoded to 8 in `appStore` — update it to match.
- **Add a camera angle:** Add a preset to the scene's `cameraPositions` object and reference it in the step's `cameraFocus` field.
- **Add an instrument badge:** Add the name string to `instruments`. `ProcedurePanel` maps these to `<Badge variant="instrument">` automatically.
- **Add anatomy highlighting:** Add the canonical ID to `focusStructures`. The `StructureMesh` glow logic handles the rest.

---

## 8. Hand Tracking Sidecar

The hand tracking system is a Python process that runs alongside the browser, streams gesture data over WebSocket, and drives the 3D camera.

### System Diagram

```
Webcam
  ↓
Python hand_tracker.py
  ├── MediaPipe Hands   (landmark detection, 30 fps)
  ├── Gesture logic     (pointing, fist, two-hand zoom)
  ├── GestureDebouncer  (hysteresis: 3 frames in, 5 frames out)
  ├── EMA smoothing     (α = 0.4)
  └── WebSocket server  (ws://localhost:8765)
        ↓  JSON @ 30 fps
useHandTracking hook (TypeScript)
  ├── Auto-reconnect (exponential backoff: 1 s → 30 s)
  ├── Stale-message guard (zeroes rates if no message >200 ms)
  └── gestureStore (Zustand)
        ↓
CameraController.useFrame()
  └── Applies zoomRate / rotateXRate / rotateYRate to camera position
```

### Python Sidecar (`hand_tracker/hand_tracker.py`)

**Threading model:**
- **Main thread** — runs the OpenCV window + MediaPipe inference loop (`camera_loop`)
- **Background thread** — runs the asyncio WebSocket server (`start_ws_server`)
- **`shared_state` dict + `threading.Lock`** — the only shared data between threads

**Gesture set:**

| Gesture | Detection | Action |
|---|---|---|
| Both index fingers extended, move apart/together | Both hands present; `index_extended()` true on each; delta of `dist2d(INDEX_TIP₀, INDEX_TIP₁)` drives rate | `zoomRate` |
| Open palm + drag | ≥3 of 4 fingers extended; tracks palm centre | `rotateXRate`, `rotateYRate` |
| Closed fist held 1 s | All 4 fingers not extended (debounced); timer in `HandState` | `reset = True` |

**Gesture design rationale:**
- **Two-index zoom** — both index fingers extended, distance between their tips drives zoom rate (moving apart = zoom in, together = zoom out). Index tips are the most accurate landmarks when the finger is fully extended. The gesture requires deliberate bilateral pointing, preventing accidental triggers. Falls through to single-hand gestures when fewer than 2 hands are present or either index isn't extended.
- **Open palm rotate** — most stable MediaPipe detection state; maximum landmark spread yields highest accuracy. No contact point, no strict per-finger state. Checked *after* pinch so that a partial open hand during pinch release never accidentally triggers rotation.
- **Closed fist reset** — 1-second hold with debouncer prevents accidental trigger.

**Reliability mechanisms:**

| Mechanism | Implementation |
|---|---|
| `GestureDebouncer` | 3-frame entry / 5-frame exit hysteresis on all gestures |
| Palm-centre distance | Averages wrist + index MCP + pinky MCP for zoom (more stable than wrist-only) |
| Rate clamping | `±MAX_RATE = 5.0` before EMA, prevents re-detection spikes |
| EMA smoothing | `α = 0.4` per-gesture accumulator, resets on gesture change |
| Dead zones | `ZOOM_DEAD = 0.003`, `ROTATE_DEAD = 0.004` — sub-threshold deltas ignored |
| Frame-drop recovery | Resets gesture state after 10 consecutive `cap.read()` failures |
| State reset on no hands | All rates zeroed, all debouncers reset when hands leave frame |

**WebSocket payload** (30 Hz JSON):

```json
{
  "gesture": "point_rotate",
  "hands": 1,
  "zoomRate": 0.0,
  "spinYRate": 0.0,
  "rotateXRate": -1.24,
  "rotateYRate": 0.83,
  "reset": false
}
```

### TypeScript Hook (`src/hooks/useHandTracking.ts`)

`useHandTracking()` is called once in `Layout`. It:

1. Opens a WebSocket to `ws://localhost:8765`
2. Parses every message and calls `gestureStore.update()`
3. Applies a client-side dead zone (`RATE_DEAD = 0.06`) to filter residual noise
4. Reconnects automatically with exponential backoff (1 s base, 1.5× per attempt, 30 s cap)
5. Runs a 100 ms interval that zeroes all rates if no message has arrived in >200 ms (guards against a stalled Python camera thread while the socket stays open)

### `GestureOverlay` (`src/components/ui/GestureOverlay.tsx`)

A non-interactive overlay at the bottom center of the viewport showing:
- **Green pill**: "Hand tracking · N hand(s)" when connected
- **Gray pill**: "Hand tracking offline — run …" when disconnected
- **White pill**: Active gesture label (e.g. "↻ Zoom (two hands)") when a gesture is detected

### Running the Sidecar

```bash
cd hand_tracker
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python hand_tracker.py
```

See `hand_tracker/README.md` for full setup instructions, Python version requirements, and macOS camera permission notes.

---

## 9. File Map

```
arthrex-challenge/
├── public/
│   ├── models/
│   │   └── lower-limb.glb           ← 3D model (452 meshes, real-world metre scale)
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── main.tsx                     ← entry point, mounts <App> in StrictMode
│   ├── App.tsx                      ← wraps in ModeProvider + Layout + WelcomeModal
│   │
│   ├── styles/
│   │   └── index.css                ← Tailwind v4 import + @theme custom colors + global base
│   │
│   ├── store/
│   │   ├── appStore.ts              ← Zustand: scene, visibility, selection, step, viewMode
│   │   └── gestureStore.ts          ← Zustand: hand tracking connection + gesture rates
│   │
│   ├── context/
│   │   └── ModeContext.tsx          ← React Context: 'surgeon' | 'patient', persisted to localStorage
│   │
│   ├── hooks/
│   │   ├── useContent.ts            ← mode-aware text selector: getText(obj, 'Description')
│   │   └── useHandTracking.ts       ← WebSocket client: auto-reconnect, stale guard, feeds gestureStore
│   │
│   ├── data/
│   │   ├── anatomyData.ts           ← typed array of 16 AnatomyStructure entries + anatomyById lookup
│   │   ├── procedureSteps.ts        ← typed array of 8 ProcedureStep entries (full ACL walkthrough)
│   │   ├── modelMapping.ts          ← MESH_NAME_ALIASES map + resolveStructureId() + STRUCTURE_EMISSIVE
│   │   └── scenes/
│   │       ├── types.ts             ← SceneConfig, JointStructure, CameraPosition, ProcedureStep interfaces
│   │       ├── index.ts             ← scenes registry: { knee, hip, ankle }
│   │       ├── knee.ts              ← full knee scene: 45 structures, 6 camera presets, ACL procedure
│   │       ├── hip.ts               ← placeholder hip scene (structures: empty)
│   │       └── ankle.ts             ← placeholder ankle scene (structures: empty)
│   │
│   ├── components/
│   │   ├── index.ts                 ← barrel exports
│   │   │
│   │   ├── layout/
│   │   │   ├── Layout.tsx           ← shell: sidebar + viewport + right panel, mounts useHandTracking
│   │   │   ├── TopBar.tsx           ← logo + Explore/Procedure tabs + Patient/Surgeon mode toggle
│   │   │   └── AnatomySidebar.tsx   ← collapsible sections (Bones/Ligaments/Soft Tissue/Muscles) + toggles
│   │   │
│   │   ├── scene/
│   │   │   ├── JointScene.tsx       ← R3F Canvas + Suspense + LoadingSpinner fallback
│   │   │   ├── JointModel.tsx       ← GLB loader, StructureMesh + BackgroundMesh, allowlist filtering
│   │   │   ├── SceneLighting.tsx    ← ambient + key + fill + rim lights (medical 3-point setup)
│   │   │   └── CameraController.tsx ← OrbitControls + gesture drive (gestureStore) + procedure lerp
│   │   │
│   │   ├── procedure/
│   │   │   ├── ProcedurePanel.tsx   ← step navigation, content display, instrument badges, step dots
│   │   │   └── InfoCard.tsx         ← floating card for selected structure (description + clinical relevance)
│   │   │
│   │   └── ui/
│   │       ├── Badge.tsx            ← pill label (instrument / category / default variants)
│   │       ├── GestureOverlay.tsx   ← hand tracking status indicator + active gesture label
│   │       ├── LoadingSpinner.tsx   ← 3D scene loading indicator
│   │       ├── ProgressBar.tsx      ← step progress bar
│   │       ├── ToggleSwitch.tsx     ← animated on/off toggle with per-structure color tint
│   │       └── WelcomeModal.tsx     ← mode selection on first load
│
├── hand_tracker/
│   ├── hand_tracker.py              ← Python: MediaPipe + WebSocket sidecar (main entry point)
│   ├── requirements.txt             ← mediapipe==0.10.21, opencv-python>=4.8, websockets>=12.0
│   └── README.md                   ← setup, Python version requirements, gesture reference
│
├── ARCHITECTURE.md                  ← this file
├── README.md                        ← project overview + quick start
├── index.html                       ← Vite HTML entry
├── vite.config.ts
├── tsconfig.app.json
└── eslint.config.js
```

---

*Built for the Arthrex Hackathon. Model: lower-limb.glb (anatomical multi-mesh). Stack: React 19 + TypeScript 5.9 + React Three Fiber 9 + Tailwind CSS 4 + Zustand 5 + MediaPipe Hands.*
