import { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/appStore';
import { resolveStructureId, STRUCTURE_EMISSIVE } from '../../data/modelMapping';

const GHOST_OPACITY = 0.12;
const SELECT_EMISSIVE = 0.4;
const HOVER_EMISSIVE = 0.14;
const LERP_SPEED = 0.09;
const MODEL_PATH = '/models/knee.glb';

export default function KneeModel() {
  const { scene } = useGLTF(MODEL_PATH);
  const { gl } = useThree();

  const visibleStructures = useAppStore((s) => s.visibleStructures);
  const selectedStructure = useAppStore((s) => s.selectedStructure);
  const setSelectedStructure = useAppStore((s) => s.setSelectedStructure);

  const [hovered, setHovered] = useState<string | null>(null);

  // Per-structure material and animation refs
  const matsRef = useRef<Record<string, THREE.MeshStandardMaterial>>({});
  const opacityRef = useRef<Record<string, number>>({});
  const emissiveRef = useRef<Record<string, number>>({});

  // Reverse map: mesh UUID → structure ID (for fast event lookup)
  const meshIdToStructure = useRef<Record<string, string>>({});

  const groupRef = useRef<THREE.Group>(null);
  const setupDone = useRef(false);

  useEffect(() => {
    if (setupDone.current) return;
    setupDone.current = true;

    const unresolved: string[] = [];

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const structureId = resolveStructureId(child.name);

      // Always log so the team can see what names the model actually uses
      if (structureId) {
        console.log(`[KneeModel] ✓ "${child.name}" → "${structureId}"`);
      } else {
        unresolved.push(child.name);
      }

      if (!structureId) return;

      const original = child.material as THREE.MeshStandardMaterial;
      const mat = original.clone();
      mat.transparent = true;
      mat.depthWrite = false;
      mat.side = THREE.DoubleSide;
      mat.emissive = new THREE.Color(STRUCTURE_EMISSIVE[structureId] ?? '#ffffff');
      mat.emissiveIntensity = 0;
      child.material = mat;

      matsRef.current[structureId] = mat;
      opacityRef.current[structureId] = 1;
      emissiveRef.current[structureId] = 0;
      meshIdToStructure.current[child.uuid] = structureId;
    });

    if (unresolved.length > 0) {
      console.warn(
        '[KneeModel] Unresolved mesh names — add aliases to src/data/modelMapping.ts:',
        unresolved
      );
    }

    // Auto-center and scale the whole scene to fit a ~2.8-unit bounding sphere
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(...box.getSize(new THREE.Vector3()).toArray());
    const scale = 2.8 / maxDim;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scale);
      groupRef.current.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale
      );
    }
  }, [scene]);

  // Cursor
  useEffect(() => {
    gl.domElement.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { gl.domElement.style.cursor = 'auto'; };
  }, [hovered, gl]);

  // Per-structure opacity + emissive animation
  useFrame(() => {
    const lerp = THREE.MathUtils.lerp;

    Object.keys(matsRef.current).forEach((id) => {
      const mat = matsRef.current[id];
      const isVisible = visibleStructures[id] ?? true;
      const isSelected = selectedStructure === id;
      const isHovered = hovered === id;

      const targetOpacity = isVisible ? 1 : GHOST_OPACITY;
      const targetEmissive = isSelected
        ? SELECT_EMISSIVE
        : isHovered
        ? HOVER_EMISSIVE
        : 0;

      opacityRef.current[id] = lerp(opacityRef.current[id], targetOpacity, LERP_SPEED);
      emissiveRef.current[id] = lerp(emissiveRef.current[id], targetEmissive, LERP_SPEED);

      mat.opacity = opacityRef.current[id];
      mat.emissiveIntensity = emissiveRef.current[id];
      mat.depthWrite = opacityRef.current[id] > 0.9;
    });
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const id = meshIdToStructure.current[(e.object as THREE.Mesh).uuid];
    if (!id) return;
    setSelectedStructure(selectedStructure === id ? null : id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const id = meshIdToStructure.current[(e.object as THREE.Mesh).uuid];
    if (id) setHovered(id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(null);
  };

  return (
    <group ref={groupRef} dispose={null}>
      <primitive
        object={scene}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
