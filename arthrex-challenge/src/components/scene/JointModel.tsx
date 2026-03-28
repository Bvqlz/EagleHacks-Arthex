import { useRef, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneConfig } from '../../data/scenes/types';
import { useAppStore } from '../../store/appStore';
import { resolveStructureId, STRUCTURE_EMISSIVE } from '../../data/modelMapping';

// Pre-allocate colours to avoid GC pressure in useFrame
const SELECTED_COLOR = new THREE.Color('#3B82F6'); // accent blue
const BLACK          = new THREE.Color(0, 0, 0);

useGLTF.preload('/models/lower-limb.glb');

/**
 * Three.js GLTFLoader sanitizes node names before assigning to Object3D.name:
 *   spaces  → underscore (_)
 *   dots    → removed entirely
 * e.g. "Anterior cruciate ligament.r" → "Anterior_cruciate_ligamentr"
 * We apply the same transform to build an allowlist from the scene config.
 */
function sanitizeNodeName(name: string): string {
  return name.replace(/ /g, '_').replace(/\./g, '');
}

// ─── Controlled mesh (maps to a canonical structure ID) ───────────────────────
interface StructureMeshProps {
  canonicalId: string;
  geometry: THREE.BufferGeometry;
  originalMaterial: THREE.Material;
  emissiveColor: THREE.Color;
}

function StructureMesh({ canonicalId, geometry, originalMaterial, emissiveColor }: StructureMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { visibleStructures, selectedStructure, highlightedStructures, setSelectedStructure } =
    useAppStore();

  const mat = useMemo(() => {
    const m = (originalMaterial as THREE.MeshStandardMaterial).clone();
    m.transparent = true;
    if (m.opacity === 0) m.opacity = 1.0;
    m.emissive = new THREE.Color(0);
    m.emissiveIntensity = 0;
    return m;
  }, [originalMaterial]);

  const baseOpacity = useMemo(() => {
    const src = originalMaterial as THREE.MeshStandardMaterial;
    return src.transparent && src.opacity > 0 ? src.opacity : 1.0;
  }, [originalMaterial]);

  useFrame(() => {
    const isVisible     = visibleStructures[canonicalId] ?? true;
    const isSelected    = selectedStructure === canonicalId;
    const isHighlighted = highlightedStructures.includes(canonicalId);

    const targetOpacity = isVisible ? baseOpacity : 0.05;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);

    const targetIntensity = isSelected ? 0.45 : isHighlighted ? 0.25 : 0.0;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetIntensity, 0.1);

    if (isSelected) {
      mat.emissive.lerp(SELECTED_COLOR, 0.15);
    } else if (isHighlighted) {
      mat.emissive.lerp(emissiveColor, 0.15);
    } else {
      mat.emissive.lerp(BLACK, 0.12);
    }

    if (meshRef.current) {
      const targetScale = isSelected ? 1.025 : 1.0;
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
      );
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSelectedStructure(selectedStructure === canonicalId ? null : canonicalId);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={mat}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
    />
  );
}

// ─── Background mesh (named in config but no canonical ID — muscles, capsule, etc.) ──
interface BackgroundMeshProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
}

function BackgroundMesh({ geometry, material }: BackgroundMeshProps) {
  const mat = useMemo(() => (material as THREE.MeshStandardMaterial).clone(), [material]);
  return <mesh geometry={geometry} material={mat} castShadow receiveShadow />;
}

// ─── Main JointModel component ────────────────────────────────────────────────
interface JointModelProps {
  config: SceneConfig;
}

/**
 * Renders only meshes that are explicitly listed in config.structures.
 * This filters out veins, nerves, and other structures not relevant to the scene.
 *
 * Meshes are split into two groups:
 *   - Controlled  → resolve to a canonical ID (sidebar-toggleable, selectable)
 *   - Background  → in config but no canonical ID (always visible: muscles, capsule, etc.)
 */
export default function JointModel({ config }: JointModelProps) {
  const gltf = useGLTF('/models/lower-limb.glb');
  const { setSelectedStructure } = useAppStore();

  // Allowlist: sanitized Three.js names for every structure in the scene config
  const allowedNames = useMemo(
    () => new Set(config.structures.map((s) => sanitizeNodeName(s.nodeName))),
    [config.structures]
  );

  const { controlledMeshes, backgroundMeshes } = useMemo(() => {
    const controlled: {
      key: string;
      canonicalId: string;
      geometry: THREE.BufferGeometry;
      material: THREE.Material;
      emissiveColor: THREE.Color;
    }[] = [];

    const background: {
      key: string;
      geometry: THREE.BufferGeometry;
      material: THREE.Material;
    }[] = [];

    const counts: Record<string, number> = {};
    let bgCount = 0;

    gltf.scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      // Skip anything not in our scene config allowlist (veins, nerves, skin, etc.)
      if (!allowedNames.has(child.name)) return;

      const canonicalId = resolveStructureId(child.name);
      const geom = child.geometry as THREE.BufferGeometry;
      const mat  = child.material as THREE.Material;

      if (canonicalId) {
        counts[canonicalId] = (counts[canonicalId] ?? 0) + 1;
        const emissiveHex = STRUCTURE_EMISSIVE[canonicalId as keyof typeof STRUCTURE_EMISSIVE] ?? '#ffffff';
        controlled.push({
          key: `${canonicalId}-${counts[canonicalId]}`,
          canonicalId,
          geometry: geom,
          material: mat,
          emissiveColor: new THREE.Color(emissiveHex),
        });
      } else {
        bgCount++;
        background.push({ key: `bg-${bgCount}`, geometry: geom, material: mat });
      }
    });

    console.log(
      `[JointModel] controlled: ${controlled.length} meshes (${Object.keys(counts).length} structures) | background: ${background.length} meshes`
    );

    return { controlledMeshes: controlled, backgroundMeshes: background };
  }, [gltf.scene, allowedNames]);

  useEffect(() => () => { document.body.style.cursor = 'default'; }, []);

  return (
    <group onClick={() => setSelectedStructure(null)}>
      {/* Background anatomy from config (muscles, capsule, etc.) — always visible */}
      {backgroundMeshes.map(({ key, geometry, material }) => (
        <BackgroundMesh key={key} geometry={geometry} material={material} />
      ))}

      {/* Controlled structures — sidebar-toggleable, selectable */}
      {controlledMeshes.map(({ key, canonicalId, geometry, material, emissiveColor }) => (
        <StructureMesh
          key={key}
          canonicalId={canonicalId}
          geometry={geometry}
          originalMaterial={material}
          emissiveColor={emissiveColor}
        />
      ))}
    </group>
  );
}
