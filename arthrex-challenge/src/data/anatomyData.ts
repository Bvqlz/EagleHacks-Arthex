// TODO: Teammate A — Fill out anatomy structure descriptions and metadata
// Each entry should have:
//   id: matches the mesh name resolved in modelMapping.ts
//   label: display name
//   category: 'bone' | 'ligament' | 'meniscus' | 'tendon' | 'cartilage'
//   color: hex string matching the theme palette
//   surgeonDescription: clinical description
//   patientDescription: plain-language description
//   clinicalRelevance: why it matters in ACL reconstruction

export interface AnatomyStructure {
  id: string;
  label: string;
  category: 'bone' | 'ligament' | 'meniscus' | 'tendon' | 'cartilage';
  color: string;
  surgeonDescription: string;
  patientDescription: string;
  clinicalRelevance: string;
}

export const anatomyData: AnatomyStructure[] = [
  // TODO: Add all 12 structures:
  // femur, tibia, fibula, patella,
  // acl, pcl, mcl, lcl,
  // medial_meniscus, lateral_meniscus, articular_cartilage, patellar_tendon
];

export const anatomyById = Object.fromEntries(anatomyData.map((s) => [s.id, s]));
