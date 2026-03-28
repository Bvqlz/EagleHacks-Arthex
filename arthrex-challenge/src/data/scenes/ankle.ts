import type { SceneConfig } from './types';

// Placeholder ankle scene — shows the architecture supports multiple joints.
// Relevant nodes in the model include: Talus.r, Calcaneus.r, Tibia.r, Fibula.r,
// Anterior talofibular ligament.r, Calcaneofibular ligament.r, etc.

export const ankleScene: SceneConfig = {
  id: 'ankle',
  name: 'Ankle Joint',
  description: 'Explore ankle anatomy and ligament repair procedures',

  structures: [], // TODO: populate with ankle-region nodes from lower-limb.glb

  cameraPositions: {
    default:   { position: [20, -30, 35],  target: [0, -35, 0] },
    anterior:  { position: [0,  -35,  50], target: [0, -35, 0] },
    posterior: { position: [0,  -35, -50], target: [0, -35, 0] },
    lateral:   { position: [50, -35,   0], target: [0, -35, 0] },
    medial:    { position: [-50, -35,  0], target: [0, -35, 0] },
    superior:  { position: [0,    0,  10], target: [0, -35, 0] },
    inferior:  { position: [0,  -65,  10], target: [0, -35, 0] },
  },

  procedure: null, // explore-only for now

  anatomyDescriptions: {},
};
