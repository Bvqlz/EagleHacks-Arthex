import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, useProgress } from '@react-three/drei';
import SceneLighting from './SceneLighting';
import KneeModel from './KneeModel';
import CameraController from './CameraController';

function LoadingOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/70 z-10 pointer-events-none">
      <div className="w-10 h-10 border-2 border-slate-700 border-t-accent rounded-full animate-spin" />
      <span className="text-xs text-slate-400">
        Loading anatomy model… {Math.round(progress)}%
      </span>
    </div>
  );
}

export default function KneeScene() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0.8, 0.3, 2.5], fov: 45, near: 0.01, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        shadows
        dpr={[1, 2]}
      >
        <SceneLighting />

        <Suspense fallback={null}>
          <KneeModel />
        </Suspense>

        <CameraController />

        {/* Adapt pixel ratio and event sampling for performance */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>

      <LoadingOverlay />
    </div>
  );
}
