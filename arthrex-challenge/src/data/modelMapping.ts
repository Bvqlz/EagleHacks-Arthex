/**
 * Model mapping — lower-limb.glb edition
 *
 * Resolves Three.js mesh names to canonical structure IDs.
 *
 * Three.js GLTFLoader sanitizes node names:
 *   spaces → underscore (_)
 *   dots   → removed entirely
 * e.g. "Femur.r" → "Femurr", "Anterior cruciate ligament.r" → "Anterior_cruciate_ligamentr"
 *
 * The normalisation used for MESH_NAME_ALIASES lookups is:
 *   meshName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/, '')
 */

// ─── Canonical structure IDs ────────────────────────────────────────────────

export const ALL_STRUCTURE_IDS = [
  // Bones
  'femur',
  'tibia',
  'fibula',
  'patella',
  // Ligaments
  'acl',
  'pcl',
  'mcl',
  'lcl',
  // Soft tissue
  'medial_meniscus',
  'lateral_meniscus',
  'articular_cartilage',
  'patellar_tendon',
  // Muscles
  'quadriceps',
  'hamstrings',
  'gastrocnemius',
  'other_muscles',
] as const;

export type StructureId = (typeof ALL_STRUCTURE_IDS)[number];

export const BONE_STRUCTURE_IDS: StructureId[]        = ['femur', 'tibia', 'fibula', 'patella'];
export const LIGAMENT_STRUCTURE_IDS: StructureId[]    = ['acl', 'pcl', 'mcl', 'lcl'];
export const SOFT_TISSUE_STRUCTURE_IDS: StructureId[] = [
  'medial_meniscus', 'lateral_meniscus', 'articular_cartilage', 'patellar_tendon',
];
export const MUSCLE_STRUCTURE_IDS: StructureId[] = [
  'quadriceps', 'hamstrings', 'gastrocnemius', 'other_muscles',
];

// ─── Mesh name aliases ───────────────────────────────────────────────────────
// Key   = normalised mesh name  (meshName.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/,''))
// Value = canonical StructureId

export const MESH_NAME_ALIASES: Record<string, StructureId> = {

  // ── Bones (generic) ────────────────────────────────────────────────────
  femur: 'femur', thigh_bone: 'femur', femur_001: 'femur', femur_bone: 'femur',
  tibia: 'tibia', shin_bone: 'tibia', tibia_001: 'tibia', tibia_bone: 'tibia',
  fibula: 'fibula', fibula_001: 'fibula', fibula_bone: 'fibula',
  patella: 'patella', kneecap: 'patella', patella_001: 'patella',

  // ── Bones — lower-limb.glb sanitized ("Femur.r" → "Femurr" → "femurr") ─
  femurr: 'femur',
  tibiar: 'tibia',
  fibular: 'fibula',
  patellar: 'patella',

  // ── Cruciate ligaments (generic) ───────────────────────────────────────
  acl: 'acl', anterior_cruciate_ligament: 'acl', anterior_cruciate: 'acl', acl_001: 'acl',
  pcl: 'pcl', posterior_cruciate_ligament: 'pcl', posterior_cruciate: 'pcl', pcl_001: 'pcl',

  // ── Cruciate ligaments — lower-limb.glb sanitized ──────────────────────
  anterior_cruciate_ligamentr: 'acl',
  posterior_cruciate_ligamentr: 'pcl',

  // ── Collateral ligaments (generic) ────────────────────────────────────
  mcl: 'mcl', medial_collateral_ligament: 'mcl', medial_collateral: 'mcl', mcl_001: 'mcl',
  lcl: 'lcl', lateral_collateral_ligament: 'lcl', lateral_collateral: 'lcl', lcl_001: 'lcl',

  // ── Collateral ligaments — lower-limb.glb sanitized ───────────────────
  // "Fibular collateral ligament.r" → "Fibular_collateral_ligamentr"
  fibular_collateral_ligamentr: 'lcl',

  // ── Menisci (generic) ─────────────────────────────────────────────────
  medial_meniscus: 'medial_meniscus', medial_meniscus_001: 'medial_meniscus',
  lateral_meniscus: 'lateral_meniscus', lateral_meniscus_001: 'lateral_meniscus',

  // ── Menisci — lower-limb.glb sanitized ────────────────────────────────
  medial_meniscusr: 'medial_meniscus',
  lateral_meniscusr: 'lateral_meniscus',
  // Meniscal horns map to their parent meniscus
  anterior_horn_of_medial_meniscusr: 'medial_meniscus',
  posterior_horn_of_medial_meniscusr: 'medial_meniscus',
  anterior_horn_of_lateral_meniscusr: 'lateral_meniscus',
  posterior_horn_of_lateral_meniscusr: 'lateral_meniscus',

  // ── Articular cartilage (generic) ─────────────────────────────────────
  articular_cartilage: 'articular_cartilage', cartilage: 'articular_cartilage',
  articular_cartilage_001: 'articular_cartilage',

  // ── Articular cartilage — lower-limb.glb sanitized ────────────────────
  art_cart_of_femur_distal_endr: 'articular_cartilage',
  art_cart_of_tibia_proximal_endr: 'articular_cartilage',
  art_cart_of_patellar: 'articular_cartilage',
  art_cart_of_fibula_proximal_tibiofibular_jointr: 'articular_cartilage',

  // ── Patellar tendon (generic) ─────────────────────────────────────────
  patellar_tendon: 'patellar_tendon', patellar_ligament: 'patellar_tendon',
  patellar_tendon_001: 'patellar_tendon',

  // ── Patellar tendon — lower-limb.glb sanitized ────────────────────────
  // "Quadriceps common tendon and patellar ligament.r" → sanitize → normalize
  quadriceps_common_tendon_and_patellar_ligamentr: 'patellar_tendon',

  // ── Quadriceps — lower-limb.glb sanitized ─────────────────────────────
  // "Rectus femoris.r" → "Rectus_femorisr" → "rectus_femorisr"
  rectus_femorisr: 'quadriceps',
  vastus_lateralis_muscler: 'quadriceps',
  vastus_medialis_muscler: 'quadriceps',
  vastus_intermedius_muscler: 'quadriceps',
  articularis_genusr: 'quadriceps',
  infrapatellar_fat_padr: 'quadriceps',

  // ── Hamstrings — lower-limb.glb sanitized ─────────────────────────────
  // "Semimembranosus muscle.r" → "Semimembranosus_muscler" → "semimembranosus_muscler"
  semimembranosus_muscler: 'hamstrings',
  semimembranosus_muscle_tendonr: 'hamstrings',
  semitendinosus_muscler: 'hamstrings',
  long_head_of_biceps_femorisr: 'hamstrings',
  short_head_of_biceps_femorisr: 'hamstrings',
  common_tendon_of_biceps_femorisr: 'hamstrings',
  common_tendon_of_semitendinosus_and_long_head_of_biceps_femoris: 'hamstrings',
  pes_anserinus_common_tendonr: 'hamstrings',

  // ── Gastrocnemius / calf — lower-limb.glb sanitized ───────────────────
  // "Medial head of gastrocnemius.r" → "Medial_head_of_gastrocnemiusr"
  medial_head_of_gastrocnemiusr: 'gastrocnemius',
  lateral_head_of_gastrocnemiusr: 'gastrocnemius',
  plantaris_muscler: 'gastrocnemius',

  // ── Other knee muscles — lower-limb.glb sanitized ─────────────────────
  popliteus_muscler: 'other_muscles',
  sartorius_muscler: 'other_muscles',
  gracilis_muscler: 'other_muscles',
  // "Iliotibial tract.r" → "Iliotibial_tractr" — IT band runs lateral thigh to tibia
  iliotibial_tractr: 'other_muscles',

  // ── Remaining capsule / minor ligaments — mapped to closest canonical ID ─
  // These are all in config.structures so they render, but without aliases
  // they were BackgroundMesh (always visible, not toggleable). Fix them here.
  //
  // "Articular capsule of knee joint.r" → wrap the whole knee → articular_cartilage
  articular_capsule_of_knee_jointr: 'articular_cartilage',
  // "Synovial membranes of knee.r" → lines the joint capsule → articular_cartilage
  synovial_membranes_of_kneer: 'articular_cartilage',
  // "Transverse ligament of knee.r" → connects anterior meniscal horns → medial_meniscus
  transverse_ligament_of_kneer: 'medial_meniscus',
  // "Posterior meniscofemoral ligament.r" → posterior capsular ligament → pcl
  posterior_meniscofemoral_ligamentr: 'pcl',
  // "Ligaments of fibular head.r" → proximal tibiofibular joint → lcl
  ligaments_of_fibular_headr: 'lcl',
};

/** Normalise a mesh name to a lookup key, then resolve to a StructureId. */
export function resolveStructureId(meshName: string): StructureId | null {
  const key = meshName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/, '');
  return MESH_NAME_ALIASES[key] ?? null;
}

// ─── Visual properties ────────────────────────────────────────────────────────

export const CATEGORY_EMISSIVE_COLOR: Record<string, string> = {
  bone:      '#F5E6D3',
  ligament:  '#E85D75',
  meniscus:  '#4ECDC4',
  cartilage: '#85C1E9',
  tendon:    '#F39C12',
  muscle:    '#E57373',
};

export const STRUCTURE_EMISSIVE: Record<StructureId, string> = {
  femur:              CATEGORY_EMISSIVE_COLOR.bone,
  tibia:              CATEGORY_EMISSIVE_COLOR.bone,
  fibula:             CATEGORY_EMISSIVE_COLOR.bone,
  patella:            CATEGORY_EMISSIVE_COLOR.bone,
  acl:                CATEGORY_EMISSIVE_COLOR.ligament,
  pcl:                CATEGORY_EMISSIVE_COLOR.ligament,
  mcl:                CATEGORY_EMISSIVE_COLOR.ligament,
  lcl:                CATEGORY_EMISSIVE_COLOR.ligament,
  medial_meniscus:    CATEGORY_EMISSIVE_COLOR.meniscus,
  lateral_meniscus:   CATEGORY_EMISSIVE_COLOR.meniscus,
  articular_cartilage: CATEGORY_EMISSIVE_COLOR.cartilage,
  patellar_tendon:    CATEGORY_EMISSIVE_COLOR.tendon,
  quadriceps:         CATEGORY_EMISSIVE_COLOR.muscle,
  hamstrings:         CATEGORY_EMISSIVE_COLOR.muscle,
  gastrocnemius:      CATEGORY_EMISSIVE_COLOR.muscle,
  other_muscles:      CATEGORY_EMISSIVE_COLOR.muscle,
};
