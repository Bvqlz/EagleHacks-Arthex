// TODO: Teammate A — Fill out ACL reconstruction procedure steps
// Each step should have:
//   id: unique step identifier
//   title: short step name
//   surgeonTitle / patientTitle: mode-appropriate heading
//   surgeonDescription: clinical walkthrough text
//   patientDescription: plain-language explanation
//   instruments: array of instrument names (Badge variant="instrument")
//   focusStructures: array of anatomy IDs to highlight in the 3D scene
//   cameraPosition?: optional [x,y,z] hint for CameraController to frame the step

export interface ProcedureStep {
  id: string;
  title: string;
  surgeonTitle: string;
  patientTitle: string;
  surgeonDescription: string;
  patientDescription: string;
  instruments: string[];
  focusStructures: string[];
  cameraPosition?: [number, number, number];
}

export const procedureSteps: ProcedureStep[] = [
  {
    id: 'step-1',
    title: 'Patient Positioning',
    surgeonTitle: 'Patient Positioning & Setup',
    patientTitle: 'Getting Ready for Surgery',
    surgeonDescription: 'TODO: Describe supine positioning, leg holder setup, tourniquet application, and prep/drape.',
    patientDescription: 'TODO: Explain how the surgical team positions you comfortably before the procedure begins.',
    instruments: ['Leg Holder', 'Tourniquet'],
    focusStructures: [],
  },
  {
    id: 'step-2',
    title: 'Diagnostic Arthroscopy',
    surgeonTitle: 'Diagnostic Arthroscopy',
    patientTitle: 'Looking Inside Your Knee',
    surgeonDescription: 'TODO: Describe anteromedial and anterolateral portal placement, scope insertion, and joint survey.',
    patientDescription: 'TODO: Explain the small camera inserted to assess the inside of the knee.',
    instruments: ['Arthroscope', 'Cannula', 'Probe'],
    focusStructures: ['acl', 'medial_meniscus', 'lateral_meniscus'],
  },
  // TODO: Add steps 3-8:
  //   3. ACL Stump Debridement
  //   4. Graft Harvesting (patellar tendon / hamstring)
  //   5. Tibial Tunnel Drilling
  //   6. Femoral Tunnel Drilling
  //   7. Graft Passage & Fixation
  //   8. Closure & Rehabilitation Overview
];
