import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { type OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import type { SceneConfig } from '../../data/scenes/types';
import { useAppStore } from '../../store/appStore';

interface CameraControllerProps {
  config: SceneConfig;
}

export default function CameraController({ config }: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { currentStep, viewMode } = useAppStore();

  // Lerp targets — updated when step or scene changes
  const targetPos    = useRef(new THREE.Vector3(...config.cameraPositions.default.position));
  const targetLookAt = useRef(new THREE.Vector3(...config.cameraPositions.default.target));
  const isAnimating  = useRef(false);

  // ── Jump to default position when the scene config changes ───────────────
  useEffect(() => {
    const { position, target } = config.cameraPositions.default;
    camera.position.set(...position);
    targetPos.current.set(...position);
    targetLookAt.current.set(...target);
    if (controlsRef.current) {
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.id]);

  // ── Animate to per-step camera position in procedure mode ────────────────
  useEffect(() => {
    if (viewMode !== 'procedure' || !config.procedure) return;
    const step = config.procedure.steps[currentStep];
    if (!step) return;
    const preset = config.cameraPositions[step.cameraFocus];
    if (!preset) return;
    targetPos.current.set(...preset.position);
    targetLookAt.current.set(...preset.target);
    isAnimating.current = true;
  }, [currentStep, viewMode, config]);

  // ── Smooth lerp every frame ───────────────────────────────────────────────
  useFrame((_, delta) => {
    if (!isAnimating.current) return;

    // Exponential ease: bigger delta → faster catch-up, capped so it never overshoots
    const alpha = 1 - Math.pow(0.001, delta);

    camera.position.lerp(targetPos.current, alpha);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, alpha);
      controlsRef.current.update();
    }

    // Stop animating once close enough
    if (
      camera.position.distanceTo(targetPos.current) < 0.05 &&
      (!controlsRef.current ||
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.05)
    ) {
      camera.position.copy(targetPos.current);
      controlsRef.current?.target.copy(targetLookAt.current);
      controlsRef.current?.update();
      isAnimating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      minDistance={0.05}
      maxDistance={2.5}
      maxPolarAngle={Math.PI * 0.92}
      minPolarAngle={Math.PI * 0.05}
      enableDamping
      dampingFactor={0.06}
    />
  );
}
