import { useMemo, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/appStore';
import { resolveStructureId } from '../../data/modelMapping';

const _box    = new THREE.Box3();
const _mshBox = new THREE.Box3();

/**
 * Computes the bounding box of all meshes for the AI-focused structure,
 * renders a transparent highlight box around them, and publishes the box
 * center to the store so CameraController can animate toward it without
 * needing its own GLTF reference (which would break Suspense boundaries).
 */
export default function StructureBoundingBox() {
  const aiFocusStructure = useAppStore((s) => s.aiFocusStructure);
  const setAiFocusCenter = useAppStore((s) => s.setAiFocusCenter);
  const gltf = useGLTF('/models/lower-limb.glb');

  // ── Bounding-box computation (stable between renders) ───────────────────
  const boxData = useMemo(() => {
    if (!aiFocusStructure) return null;

    _box.makeEmpty();
    let found = false;

    gltf.scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (resolveStructureId(child.name) !== aiFocusStructure) return;

      const geom = child.geometry as THREE.BufferGeometry;
      if (!geom.boundingBox) geom.computeBoundingBox();
      if (!geom.boundingBox) return;

      child.updateWorldMatrix(true, false);
      _mshBox.copy(geom.boundingBox).applyMatrix4(child.matrixWorld);
      _box.union(_mshBox);
      found = true;
    });

    if (!found || _box.isEmpty()) return null;

    const center = new THREE.Vector3();
    const size   = new THREE.Vector3();
    _box.getCenter(center);
    _box.getSize(size);
    size.multiplyScalar(1.05); // 5 % padding

    return { center, size };
  }, [aiFocusStructure, gltf.scene]);

  // Publish center to store whenever it changes so CameraController can use it
  useEffect(() => {
    if (boxData) {
      const { x, y, z } = boxData.center;
      setAiFocusCenter([x, y, z]);
    } else {
      setAiFocusCenter(null);
    }
  }, [boxData, setAiFocusCenter]);

  // ── Stable geometries (only reallocated when box dimensions change) ──────
  const { boxGeom, edgeGeom } = useMemo(() => {
    const s = boxData?.size ?? new THREE.Vector3(0.001, 0.001, 0.001);
    const bg = new THREE.BoxGeometry(s.x, s.y, s.z);
    return { boxGeom: bg, edgeGeom: new THREE.EdgesGeometry(bg) };
  }, [boxData]);

  // ── Fade-in / fade-out via per-frame material mutation ───────────────────
  const fillMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial  | null>(null);
  const alphaRef   = useRef(0);
  const targetAlpha = boxData ? 1 : 0;

  useFrame((_, delta) => {
    alphaRef.current = THREE.MathUtils.lerp(
      alphaRef.current,
      targetAlpha,
      1 - Math.pow(0.001, delta),
    );
    const a = alphaRef.current;
    if (fillMatRef.current) {
      fillMatRef.current.opacity = 0.07 * a;
      fillMatRef.current.visible = a > 0.01;
    }
    if (edgeMatRef.current) {
      edgeMatRef.current.opacity = 0.75 * a;
      edgeMatRef.current.visible = a > 0.01;
    }
  });

  // Don't mount at all until we have something (or are fading out)
  if (!boxData && alphaRef.current < 0.01) return null;

  const pos = boxData?.center ?? new THREE.Vector3();

  return (
    <group position={pos}>
      {/* Transparent fill */}
      <mesh geometry={boxGeom}>
        <meshBasicMaterial
          ref={fillMatRef}
          color="#3B82F6"
          transparent
          opacity={0.07}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe edges */}
      <lineSegments geometry={edgeGeom}>
        <lineBasicMaterial
          ref={edgeMatRef}
          color="#60A5FA"
          transparent
          opacity={0.75}
        />
      </lineSegments>
    </group>
  );
}
