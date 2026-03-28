import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import type { SceneConfig } from '../../data/scenes/types';
import SceneLighting from './SceneLighting';
import JointModel from './JointModel';
import CameraController from './CameraController';
import LoadingSpinner from '../ui/LoadingSpinner';

interface JointSceneProps {
  config: SceneConfig;
}

export default function JointScene({ config }: JointSceneProps) {
  const { position } = config.cameraPositions.default;

  return (
    <div className="absolute inset-0 bg-background">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="lg" label="Loading model…" />
          </div>
        }
      >
        <Canvas
          shadows
          camera={{ position, fov: 42, near: 0.01, far: 100 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          <SceneLighting />

          <Suspense fallback={null}>
            <JointModel config={config} />
          </Suspense>

          <CameraController config={config} />
        </Canvas>
      </Suspense>
    </div>
  );
}
