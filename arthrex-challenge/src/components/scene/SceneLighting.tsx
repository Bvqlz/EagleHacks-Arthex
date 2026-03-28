export default function SceneLighting() {
  return (
    <>
      {/* Soft base fill */}
      <ambientLight intensity={0.4} />

      {/* Key light — upper right, slightly warm */}
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.0}
        color="#FFF8F0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />

      {/* Fill light — lower left, cool */}
      <directionalLight position={[-3, -2, -2]} intensity={0.3} color="#E8F4FF" />

      {/* Subtle rim / back light for depth */}
      <pointLight position={[0, -2, -4]} intensity={0.25} color="#A8D8EA" />
    </>
  );
}
