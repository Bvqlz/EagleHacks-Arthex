// TODO: You — Set up the main R3F Canvas and 3D scene
// Use @react-three/fiber Canvas with shadows enabled.
// Compose SceneLighting, KneeModel, and CameraController inside.
// Layer InfoCard over the canvas using absolute positioning.

export default function KneeScene() {
  return (
    <div className="w-full h-full bg-background relative">
      {/* TODO: <Canvas shadows camera={{ position: [0, 0, 3], fov: 45 }}>
            <SceneLighting />
            <KneeModel />
            <CameraController />
          </Canvas>
          <InfoCard /> */}
      <p className="text-slate-400 p-4">KneeScene placeholder — You</p>
    </div>
  );
}
