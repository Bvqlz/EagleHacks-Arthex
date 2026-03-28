import type { SceneConfig } from './types';

// Placeholder hip scene — shows the architecture supports multiple joints.
// Populate structures from the lower-limb.glb model when hip scene is built.
// Relevant nodes in the model include: Hip bone.r, Art cart of femur head.r,
// Acetabular labrum.r, Hip joint capsule.r, Ligament of head of femur.r, etc.

export const hipScene: SceneConfig = {
  id: 'hip',
  name: 'Hip Joint',
  description: 'Explore hip anatomy and labral repair procedures',

  structures: [],  // TODO: populate with hip-region nodes from lower-limb.glb

  cameraPositions: {
    default:   { position: [30, 50, 40],  target: [0, 40, 0] },
    anterior:  { position: [0,  40,  55], target: [0, 40, 0] },
    posterior: { position: [0,  40, -55], target: [0, 40, 0] },
    lateral:   { position: [55, 40,   0], target: [0, 40, 0] },
    medial:    { position: [-55, 40,  0], target: [0, 40, 0] },
    superior:  { position: [0,  80,  10], target: [0, 40, 0] },
    inferior:  { position: [0,   0,  10], target: [0, 40, 0] },
  },

  procedure: null, // explore-only for now

  anatomyDescriptions: {},
};
