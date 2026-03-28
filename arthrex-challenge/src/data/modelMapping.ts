/**
 * Model mapping — individual-mesh edition
 *
 * Expects the incoming GLB to have one named mesh per anatomy structure.
 * The mesh name resolution is flexible: exact match first, then the
 * MESH_NAME_ALIASES table for common naming conventions (CamelCase,
 * spaces, suffixes like _001, etc.).
 *
 * When your friend drops in the new model, run the app with the browser
 * console open. KneeModel.tsx logs every mesh name it finds and whether
 * it resolved to a known structure ID. Add any unresolved names to
 * MESH_NAME_ALIASES below and rebuild.
 */

// ─── Canonical structure IDs ────────────────────────────────────────────────

export const ALL_STRUCTURE_IDS = [
  'femur',
  'tibia',
  'fibula',
  'patella',
  'acl',
  'pcl',
  'mcl',
  'lcl',
  'medial_meniscus',
  'lateral_meniscus',
  'articular_cartilage',
  'patellar_tendon',
] as const;

export type StructureId = (typeof ALL_STRUCTURE_IDS)[number];

// Convenience groupings (still used by CameraController step targets and
// AnatomySidebar show-all / hide-all buttons)
export const BONE_STRUCTURE_IDS: StructureId[] = ['femur', 'tibia', 'fibula', 'patella'];
export const LIGAMENT_STRUCTURE_IDS: StructureId[] = ['acl', 'pcl', 'mcl', 'lcl'];
export const SOFT_TISSUE_STRUCTURE_IDS: StructureId[] = [
  'medial_meniscus',
  'lateral_meniscus',
  'articular_cartilage',
  'patellar_tendon',
];

// ─── Mesh name aliases ───────────────────────────────────────────────────────
// Key   = mesh name after lowercasing + replacing non-alphanumeric chars with _
// Value = canonical StructureId
//
// Add rows here when the incoming model uses different naming conventions.
// The normalisation step is: meshName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

export const MESH_NAME_ALIASES: Record<string, StructureId> = {
  // ── Bones ──
  femur: 'femur',
  thigh_bone: 'femur',
  femur_001: 'femur',
  femur_bone: 'femur',

  tibia: 'tibia',
  shin_bone: 'tibia',
  tibia_001: 'tibia',
  tibia_bone: 'tibia',

  fibula: 'fibula',
  fibula_001: 'fibula',
  fibula_bone: 'fibula',

  patella: 'patella',
  kneecap: 'patella',
  patella_001: 'patella',

  // ── Ligaments ──
  acl: 'acl',
  anterior_cruciate_ligament: 'acl',
  anterior_cruciate: 'acl',
  acl_001: 'acl',

  pcl: 'pcl',
  posterior_cruciate_ligament: 'pcl',
  posterior_cruciate: 'pcl',
  pcl_001: 'pcl',

  mcl: 'mcl',
  medial_collateral_ligament: 'mcl',
  medial_collateral: 'mcl',
  mcl_001: 'mcl',

  lcl: 'lcl',
  lateral_collateral_ligament: 'lcl',
  lateral_collateral: 'lcl',
  lcl_001: 'lcl',

  // ── Soft tissue ──
  medial_meniscus: 'medial_meniscus',
  medial_meniscus_001: 'medial_meniscus',

  lateral_meniscus: 'lateral_meniscus',
  lateral_meniscus_001: 'lateral_meniscus',

  articular_cartilage: 'articular_cartilage',
  cartilage: 'articular_cartilage',
  articular_cartilage_001: 'articular_cartilage',

  patellar_tendon: 'patellar_tendon',
  patellar_ligament: 'patellar_tendon',
  patellar_tendon_001: 'patellar_tendon',
};

/** Normalise a mesh name to a lookup key, then resolve to a StructureId. */
export function resolveStructureId(meshName: string): StructureId | null {
  const key = meshName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/, '');
  return MESH_NAME_ALIASES[key] ?? null;
}

// ─── Visual properties per category ──────────────────────────────────────────

export const CATEGORY_EMISSIVE_COLOR: Record<string, string> = {
  bone: '#F5E6D3',
  ligament: '#E85D75',
  meniscus: '#4ECDC4',
  cartilage: '#85C1E9',
  tendon: '#F39C12',
};

/** Default emissive color for a structure, keyed by structure ID. */
export const STRUCTURE_EMISSIVE: Record<StructureId, string> = {
  femur: CATEGORY_EMISSIVE_COLOR.bone,
  tibia: CATEGORY_EMISSIVE_COLOR.bone,
  fibula: CATEGORY_EMISSIVE_COLOR.bone,
  patella: CATEGORY_EMISSIVE_COLOR.bone,
  acl: CATEGORY_EMISSIVE_COLOR.ligament,
  pcl: CATEGORY_EMISSIVE_COLOR.ligament,
  mcl: CATEGORY_EMISSIVE_COLOR.ligament,
  lcl: CATEGORY_EMISSIVE_COLOR.ligament,
  medial_meniscus: CATEGORY_EMISSIVE_COLOR.meniscus,
  lateral_meniscus: CATEGORY_EMISSIVE_COLOR.meniscus,
  articular_cartilage: CATEGORY_EMISSIVE_COLOR.cartilage,
  patellar_tendon: CATEGORY_EMISSIVE_COLOR.tendon,
};
