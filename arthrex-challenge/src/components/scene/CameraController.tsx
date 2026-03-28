import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { type OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import type { SceneConfig } from '../../data/scenes/types';
import { useAppStore } from '../../store/appStore';
import { useGestureStore } from '../../store/gestureStore';

// Gesture sensitivity multipliers (tune without touching Python)
const ZOOM_SENS   = 0.35;
const SPIN_Y_SENS = 1.0;
const ROTATE_SENS = 1.0;

// Clamp helpers
const MIN_DIST = 0.05;
const MAX_DIST = 2.5;

// Module-level scratch vectors — never written from multiple places simultaneously
const _up     = new THREE.Vector3(0, 1, 0);
const _offset = new THREE.Vector3();
const _right  = new THREE.Vector3();

interface CameraControllerProps {
  config: SceneConfig;
}

export default function CameraController({ config }: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { currentStep, viewMode } = useAppStore();

  const targetPos    = useRef(new THREE.Vector3(...config.cameraPositions.default.position));
  const targetLookAt = useRef(new THREE.Vector3(...config.cameraPositions.default.target));
  const isAnimating  = useRef(false);

  // ── Jump to default position when the scene config changes ──────────────
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

  // ── Animate to per-step camera position in procedure mode ───────────────
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

  // ── Main per-frame loop ─────────────────────────────────────────────────
  useFrame((_, delta) => {
    const controls = controlsRef.current;

    // ── Gesture-driven camera control ──────────────────────────────────────
    const g = useGestureStore.getState();

    if (g.reset) {
      useGestureStore.getState().consumeReset();
      const { position, target } = config.cameraPositions.default;
      targetPos.current.set(...position);
      targetLookAt.current.set(...target);
      isAnimating.current = true;
    } else if (
      g.connected &&
      (g.zoomRate || g.spinYRate || g.rotateXRate || g.rotateYRate)
    ) {
      const orbitTarget = controls ? controls.target : targetLookAt.current;

      // Offset = vector from orbit target to camera
      _offset.copy(camera.position).sub(orbitTarget);

      // 1. Zoom — scale the orbit distance
      if (g.zoomRate !== 0) {
        const scale = 1 - g.zoomRate * ZOOM_SENS * delta;
        _offset.multiplyScalar(Math.max(MIN_DIST / _offset.length(), Math.min(MAX_DIST / _offset.length(), scale)));
      }

      // 2. Spin Y — rotate around world-up
      if (g.spinYRate !== 0) {
        _offset.applyAxisAngle(_up, g.spinYRate * SPIN_Y_SENS * delta);
      }

      // 3. Fine rotate Y (yaw) — same as spin but from pinch drag
      if (g.rotateYRate !== 0) {
        _offset.applyAxisAngle(_up, g.rotateYRate * ROTATE_SENS * delta);
      }

      // 4. Fine rotate X (pitch) — rotate around camera right axis
      if (g.rotateXRate !== 0) {
        _right.crossVectors(_up, _offset);
        if (_right.lengthSq() > 1e-6) {
          _right.normalize();
          _offset.applyAxisAngle(_right, g.rotateXRate * ROTATE_SENS * delta);
        }
      }

      // Clamp orbit distance
      const dist = _offset.length();
      if (dist < MIN_DIST) _offset.setLength(MIN_DIST);
      if (dist > MAX_DIST) _offset.setLength(MAX_DIST);

      camera.position.copy(orbitTarget).add(_offset);
      controls?.update();

      // Interrupt procedural step animation while user is gesturing
      isAnimating.current = false;
    }

    // ── Procedural lerp (step/scene change) ────────────────────────────────
    if (!isAnimating.current) return;

    const alpha = 1 - Math.pow(0.001, delta);
    camera.position.lerp(targetPos.current, alpha);

    if (controls) {
      controls.target.lerp(targetLookAt.current, alpha);
      controls.update();
    }

    if (
      camera.position.distanceTo(targetPos.current) < 0.05 &&
      (!controls || controls.target.distanceTo(targetLookAt.current) < 0.05)
    ) {
      camera.position.copy(targetPos.current);
      controls?.target.copy(targetLookAt.current);
      controls?.update();
      isAnimating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      minDistance={MIN_DIST}
      maxDistance={MAX_DIST}
      maxPolarAngle={Math.PI * 0.92}
      minPolarAngle={Math.PI * 0.05}
      enableDamping
      dampingFactor={0.06}
    />
  );
}
