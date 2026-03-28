export interface JointStructure {
  nodeName: string;       // Exact mesh name from GLB (e.g. "Anterior cruciate ligament.r")
  displayName: string;    // Clean UI label (e.g. "ACL")
  category: 'bone' | 'ligament' | 'muscle';
  group: string;          // Sidebar group header (e.g. "Cruciate Ligaments")
}

export interface CameraPosition {
  position: [number, number, number];
  target: [number, number, number];
}

export interface ProcedureStep {
  step: number;
  title: string;
  surgeonDescription: string;
  patientDescription: string;
  instruments: string[];
  anatomyHighlight: string[];                          // nodeName values to highlight in scene
  cameraFocus: keyof SceneConfig['cameraPositions'];   // which preset to animate to
}

export interface SceneConfig {
  id: string;          // e.g. "knee"
  name: string;        // e.g. "Knee Joint"
  description: string; // short blurb for a future scene selector

  structures: JointStructure[];

  cameraPositions: {
    default: CameraPosition;
    anterior: CameraPosition;
    posterior: CameraPosition;
    lateral: CameraPosition;
    medial: CameraPosition;
    superior: CameraPosition;
    inferior: CameraPosition;
  };

  procedure: {
    name: string;          // e.g. "ACL Reconstruction"
    steps: ProcedureStep[];
  } | null;               // null → explore-only scene

  anatomyDescriptions: Record<string, {
    surgeonDescription: string;
    patientDescription: string;
    funFact?: string;
  }>;
}
