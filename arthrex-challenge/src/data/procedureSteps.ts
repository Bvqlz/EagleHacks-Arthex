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
  // TODO: Add all 8 steps:
  // 1. Diagnosis & Examination
  // 2. Anesthesia & Portal Placement
  // 3. Diagnostic Arthroscopy
  // 4. Graft Harvesting
  // 5. Tibial Tunnel Drilling
  // 6. Femoral Tunnel Drilling
  // 7. Graft Passage & Fixation
  // 8. Final Assessment & Closure
];
