import type { SceneConfig } from './types';

// Node names confirmed by inspecting lower-limb.glb (462 nodes, 452 meshes).
// Camera positions are approximate — tune after seeing the model in-browser.
// The model appears to use a Y-up, metre-scale coordinate system.
// The knee region sits roughly at world Y ≈ 0 when the full limb is centred.
// Procedure steps and anatomy descriptions are filled in by Teammate A.

export const kneeScene: SceneConfig = {
  id: 'knee',
  name: 'Knee Joint',
  description: 'Explore the anatomy of the knee and walk through an ACL reconstruction procedure',

  structures: [
    // ── BONES ──────────────────────────────────────────────────────────────
    { nodeName: 'Femur.r',   displayName: 'Femur',   category: 'bone', group: 'Bones' },
    { nodeName: 'Tibia.r',   displayName: 'Tibia',   category: 'bone', group: 'Bones' },
    { nodeName: 'Fibula.r',  displayName: 'Fibula',  category: 'bone', group: 'Bones' },
    { nodeName: 'Patella.r', displayName: 'Patella', category: 'bone', group: 'Bones' },

    // ── ARTICULAR CARTILAGE ────────────────────────────────────────────────
    { nodeName: 'Art cart of femur distal end.r',                  displayName: 'Femoral Cartilage',         category: 'ligament', group: 'Cartilage' },
    { nodeName: 'Art cart of tibia proximal end.r',                displayName: 'Tibial Cartilage',          category: 'ligament', group: 'Cartilage' },
    { nodeName: 'Art cart of patella.r',                           displayName: 'Patellar Cartilage',        category: 'ligament', group: 'Cartilage' },
    { nodeName: 'Art cart of fibula proximal tibiofibular joint.r',displayName: 'Prox. Tibiofib. Cartilage', category: 'ligament', group: 'Cartilage' },

    // ── MENISCI ────────────────────────────────────────────────────────────
    { nodeName: 'Medial meniscus.r',                     displayName: 'Medial Meniscus',             category: 'ligament', group: 'Menisci' },
    { nodeName: 'Lateral meniscus.r',                    displayName: 'Lateral Meniscus',            category: 'ligament', group: 'Menisci' },
    { nodeName: 'Anterior horn of Medial meniscus.r',    displayName: 'Medial Meniscus (Ant. Horn)', category: 'ligament', group: 'Menisci' },
    { nodeName: 'Posterior horn of Medial meniscus.r',   displayName: 'Medial Meniscus (Post. Horn)',category: 'ligament', group: 'Menisci' },
    { nodeName: 'Anterior horn of Lateral meniscus.r',   displayName: 'Lateral Meniscus (Ant. Horn)',category: 'ligament', group: 'Menisci' },
    { nodeName: 'Posterior horn of Lateral meniscus.r',  displayName: 'Lateral Meniscus (Post. Horn)',category: 'ligament', group: 'Menisci' },

    // ── CRUCIATE LIGAMENTS ─────────────────────────────────────────────────
    { nodeName: 'Anterior cruciate ligament.r',  displayName: 'ACL', category: 'ligament', group: 'Cruciate Ligaments' },
    { nodeName: 'Posterior cruciate ligament.r', displayName: 'PCL', category: 'ligament', group: 'Cruciate Ligaments' },

    // ── COLLATERAL LIGAMENTS & CAPSULE ─────────────────────────────────────
    { nodeName: 'Fibular collateral ligament.r',          displayName: 'LCL (Fibular Collateral)',  category: 'ligament', group: 'Collateral & Capsule' },
    { nodeName: 'Articular capsule of knee joint.r',      displayName: 'Joint Capsule',             category: 'ligament', group: 'Collateral & Capsule' },
    { nodeName: 'Transverse ligament of knee.r',          displayName: 'Transverse Ligament',       category: 'ligament', group: 'Collateral & Capsule' },
    { nodeName: 'Posterior meniscofemoral ligament.r',    displayName: 'Meniscofemoral Ligament',   category: 'ligament', group: 'Collateral & Capsule' },
    { nodeName: 'Ligaments of fibular head.r',            displayName: 'Proximal Tibiofib. Ligaments', category: 'ligament', group: 'Collateral & Capsule' },
    { nodeName: 'Iliotibial tract.r',                     displayName: 'Iliotibial Band (IT Band)', category: 'ligament', group: 'Collateral & Capsule' },
    { nodeName: 'Synovial membranes of knee.r',           displayName: 'Synovial Membrane',         category: 'ligament', group: 'Collateral & Capsule' },

    // ── QUADRICEPS ─────────────────────────────────────────────────────────
    { nodeName: 'Rectus femoris.r',                               displayName: 'Rectus Femoris',    category: 'muscle', group: 'Quadriceps' },
    { nodeName: 'Vastus lateralis muscle.r',                      displayName: 'Vastus Lateralis',  category: 'muscle', group: 'Quadriceps' },
    { nodeName: 'Vastus medialis muscle.r',                       displayName: 'Vastus Medialis',   category: 'muscle', group: 'Quadriceps' },
    { nodeName: 'Vastus intermedius muscle.r',                    displayName: 'Vastus Intermedius',category: 'muscle', group: 'Quadriceps' },
    { nodeName: 'Articularis genus.r',                            displayName: 'Articularis Genus', category: 'muscle', group: 'Quadriceps' },
    { nodeName: 'Quadriceps common tendon and patellar ligament.r',displayName: 'Patellar Tendon',  category: 'muscle', group: 'Quadriceps' },
    { nodeName: 'Infrapatellar fat pad.r',                        displayName: 'Infrapatellar Fat Pad', category: 'muscle', group: 'Quadriceps' },

    // ── HAMSTRINGS ─────────────────────────────────────────────────────────
    { nodeName: 'Semimembranosus muscle.r',                                        displayName: 'Semimembranosus',          category: 'muscle', group: 'Hamstrings' },
    { nodeName: 'Semimembranosus muscle tendon.r',                                 displayName: 'Semimembranosus Tendon',   category: 'muscle', group: 'Hamstrings' },
    { nodeName: 'Semitendinosus muscle.r',                                         displayName: 'Semitendinosus',           category: 'muscle', group: 'Hamstrings' },
    { nodeName: 'Long head of biceps femoris.r',                                   displayName: 'Biceps Femoris (Long)',    category: 'muscle', group: 'Hamstrings' },
    { nodeName: 'Short head of biceps femoris.r',                                  displayName: 'Biceps Femoris (Short)',   category: 'muscle', group: 'Hamstrings' },
    { nodeName: 'Common tendon of biceps femoris.r',                               displayName: 'Biceps Femoris Tendon',   category: 'muscle', group: 'Hamstrings' },
    { nodeName: 'Common tendon of Semitendinosus and Long head of biceps femoris', displayName: 'Semitendinosus Tendon',   category: 'muscle', group: 'Hamstrings' },

    // ── CALF (cross-knee) ──────────────────────────────────────────────────
    { nodeName: 'Medial head of gastrocnemius.r',  displayName: 'Gastrocnemius (Medial)', category: 'muscle', group: 'Calf' },
    { nodeName: 'Lateral head of gastrocnemius.r', displayName: 'Gastrocnemius (Lateral)',category: 'muscle', group: 'Calf' },
    { nodeName: 'Plantaris muscle.r',              displayName: 'Plantaris',             category: 'muscle', group: 'Calf' },

    // ── OTHER ──────────────────────────────────────────────────────────────
    { nodeName: 'Popliteus muscle.r',         displayName: 'Popliteus',      category: 'muscle', group: 'Other' },
    { nodeName: 'Sartorius muscle.r',          displayName: 'Sartorius',      category: 'muscle', group: 'Other' },
    { nodeName: 'Gracilis muscle.r',           displayName: 'Gracilis',       category: 'muscle', group: 'Other' },
    { nodeName: 'Pes anserinus common tendon.r',displayName: 'Pes Anserinus', category: 'muscle', group: 'Other' },
  ],

  // ── CAMERA POSITIONS ──────────────────────────────────────────────────────
  // Model is real-world metre scale. Full bounding box: X[-0.16,0.06] Y[0.00,1.17] Z[-0.12,0.14]
  // Knee joint midpoint: X≈-0.09, Y≈0.45, Z≈0.00
  // (Femur centre Y≈0.66, Tibia centre Y≈0.25)
  cameraPositions: {
    default:   { position: [-0.09, 0.45, 0.35], target: [-0.09, 0.45, 0.0] },
    anterior:  { position: [-0.09, 0.45, 0.35], target: [-0.09, 0.45, 0.0] },
    posterior: { position: [-0.09, 0.45,-0.35], target: [-0.09, 0.45, 0.0] },
    lateral:   { position: [ 0.25, 0.45, 0.0 ], target: [-0.09, 0.45, 0.0] },
    medial:    { position: [-0.40, 0.45, 0.0 ], target: [-0.09, 0.45, 0.0] },
    superior:  { position: [-0.09, 0.75, 0.2 ], target: [-0.09, 0.45, 0.0] },
    inferior:  { position: [-0.09, 0.15, 0.2 ], target: [-0.09, 0.45, 0.0] },
  },

  procedure: {
    name: 'ACL Reconstruction',
    steps: [
      // 0 — Diagnosis & Examination: full anterior overview
      { step: 0, title: 'Diagnosis & Examination', surgeonDescription: '', patientDescription: '', instruments: [], anatomyHighlight: [], cameraFocus: 'anterior' },
      // 1 — Anesthesia & Portal Placement: anterior, show patellar region
      { step: 1, title: 'Anesthesia & Portal Placement', surgeonDescription: '', patientDescription: '', instruments: [], anatomyHighlight: [], cameraFocus: 'anterior' },
      // 2 — Diagnostic Arthroscopy: medial view into intercondylar notch
      { step: 2, title: 'Diagnostic Arthroscopy', surgeonDescription: '', patientDescription: '', instruments: [], anatomyHighlight: [], cameraFocus: 'medial' },
      // 3 — Graft Harvest: inferior view, patellar tendon / hamstrings
      { step: 3, title: 'Graft Harvesting', surgeonDescription: '', patientDescription: '', instruments: [], anatomyHighlight: [], cameraFocus: 'inferior' },
      // 4 — Tibial Tunnel: inferior view, tibial plateau
      { step: 4, title: 'Tibial Tunnel Drilling', surgeonDescription: '', patientDescription: '', instruments: [], anatomyHighlight: [], cameraFocus: 'inferior' },
      // 5 — Femoral Tunnel: superior view, femoral condyle
      { step: 5, title: 'Femoral Tunnel Drilling', surgeonDescription: '', patientDescription: '', instruments: [], anatomyHighlight: [], cameraFocus: 'superior' },
      // 6 — Graft Passage & Fixation: anterior full view
      { step: 6, title: 'Graft Passage & Fixation', surgeonDescription: '', patientDescription: '', instruments: [], anatomyHighlight: [], cameraFocus: 'anterior' },
      // 7 — Final Assessment: anterior full overview
      { step: 7, title: 'Final Assessment & Closure', surgeonDescription: '', patientDescription: '', instruments: [], anatomyHighlight: [], cameraFocus: 'anterior' },
    ],
  },
  anatomyDescriptions: {},
};
