// TODO: Teammate A — Fill out anatomy structure descriptions and metadata
// Each entry should have:
//   id: matches the mesh name in the GLB model (update after inspecting knee.glb)
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
  {
    id: 'femur',
    label: 'Femur',
    category: 'bone',
    color: '#F5E6D3',
    surgeonDescription: 'TODO: Clinical description of femur',
    patientDescription: 'TODO: Plain-language description of femur',
    clinicalRelevance: 'TODO: Role in ACL reconstruction',
  },
  {
    id: 'tibia',
    label: 'Tibia',
    category: 'bone',
    color: '#F5E6D3',
    surgeonDescription: 'TODO: Clinical description of tibia',
    patientDescription: 'TODO: Plain-language description of tibia',
    clinicalRelevance: 'TODO: Role in ACL reconstruction',
  },
  {
    id: 'acl',
    label: 'Anterior Cruciate Ligament',
    category: 'ligament',
    color: '#E85D75',
    surgeonDescription: 'TODO: Clinical description of ACL',
    patientDescription: 'TODO: Plain-language description of ACL',
    clinicalRelevance: 'TODO: Primary target of reconstruction procedure',
  },
  // TODO: Add fibula, patella, pcl, mcl, lcl, medial_meniscus, lateral_meniscus,
  //        articular_cartilage, patellar_tendon
];

export const anatomyById = Object.fromEntries(anatomyData.map((s) => [s.id, s]));
