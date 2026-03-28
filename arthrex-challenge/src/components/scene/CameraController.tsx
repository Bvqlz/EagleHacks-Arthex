import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/appStore';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// Named camera presets: [position, lookAt target]
const CAMERA_VIEWS: Record<string, [THREE.Vector3, THREE.Vector3]> = {
  default:   [new THREE.Vector3(0.8, 0.3, 2.5), new THREE.Vector3(0, 0, 0)],
  anterior:  [new THREE.Vector3(0,   0.1,  2.5), new THREE.Vector3(0, 0, 0)],
  posterior: [new THREE.Vector3(0,   0.1, -2.5), new THREE.Vector3(0, 0, 0)],
  lateral:   [new THREE.Vector3(2.5, 0.1,  0),   new THREE.Vector3(0, 0, 0)],
  medial:    [new THREE.Vector3(-2.5, 0.1, 0),   new THREE.Vector3(0, 0, 0)],
  superior:  [new THREE.Vector3(0,   2.8,  0.4), new THREE.Vector3(0, 0, 0)],
  inferior:  [new THREE.Vector3(0,  -2.8,  0.4), new THREE.Vector3(0, 0, 0)],
};

// Procedure step index → camera view name
const STEP_VIEWS = [
  'default',   // 0 - Patient Positioning
  'anterior',  // 1 - Diagnostic Arthroscopy
  'anterior',  // 2 - ACL Stump Debridement
  'lateral',   // 3 - Graft Harvesting
  'inferior',  // 4 - Tibial Tunnel Drilling
  'superior',  // 5 - Femoral Tunnel Drilling
  'anterior',  // 6 - Graft Passage & Fixation
  'default',   // 7 - Closure & Rehab
];

const ANIM_DURATION = 1.0; // seconds

export default function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const currentStep = useAppStore((s) => s.currentStep);
  const viewMode = useAppStore((s) => s.viewMode);

  // Animation state (all in refs to avoid re-renders)
  const animating = useRef(false);
  const animProgress = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());
  const targetTarget = useRef(new THREE.Vector3());

  // Trigger camera animation when procedure step changes
  useEffect(() => {
    if (viewMode !== 'procedure') return;

    const viewKey = STEP_VIEWS[currentStep] ?? 'default';
    const [pos, tgt] = CAMERA_VIEWS[viewKey];

    startPos.current.copy(camera.position);
    startTarget.current.copy(
      controlsRef.current ? controlsRef.current.target : new THREE.Vector3()
    );
    targetPos.current.copy(pos);
    targetTarget.current.copy(tgt);

    animProgress.current = 0;
    animating.current = true;

    if (controlsRef.current) controlsRef.current.enabled = false;
  }, [currentStep, viewMode]);

  useFrame((_, delta) => {
    if (!animating.current) return;

    animProgress.current = Math.min(animProgress.current + delta / ANIM_DURATION, 1);

    // Cubic ease-in-out
    const p = animProgress.current;
    const t = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

    camera.position.lerpVectors(startPos.current, targetPos.current, t);

    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(startTarget.current, targetTarget.current, t);
      controlsRef.current.update();
    }

    if (animProgress.current >= 1) {
      animating.current = false;
      if (controlsRef.current) controlsRef.current.enabled = true;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      minDistance={0.8}
      maxDistance={5.5}
      maxPolarAngle={Math.PI * 0.88}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.65}
      zoomSpeed={0.9}
      panSpeed={0.5}
    />
  );
}
