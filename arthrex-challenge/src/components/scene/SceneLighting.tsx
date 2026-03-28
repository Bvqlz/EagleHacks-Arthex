// SceneLighting — 3-point medical visualization lighting.
// Warm main key light + cool fill + subtle rim for depth without drama.

export default function SceneLighting() {
  return (
    <>
      {/* Soft ambient fill so shadow areas stay visible */}
      <ambientLight intensity={0.45} color="#e8eeff" />

      {/* Key light — upper right, slightly warm (clinical white) */}
      <directionalLight
        position={[40, 80, 50]}
        intensity={1.1}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={300}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />

      {/* Fill light — lower left, cool tone to separate depth planes */}
      <directionalLight
        position={[-40, -20, -30]}
        intensity={0.28}
        color="#c0d8ff"
      />

      {/* Rim / back light — behind model, adds silhouette separation */}
      <directionalLight
        position={[5, 20, -70]}
        intensity={0.18}
        color="#ffffff"
      />
    </>
  );
}
