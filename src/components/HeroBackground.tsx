"use client";

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Per Aspera hero background — Three.js cube and nodes version.
 */

const COLORS = {
  bg: '#0A0A0A',
  wire: '#F5F5F5',
  accent: '#FF6B35', // Match Peraspera orange accent color
  muted: '#6B6B6B',
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
  return visible;
}

function useGlowTexture() {
  return useMemo(() => {
    if (typeof window === 'undefined') return new THREE.Texture();
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

interface CubeProps {
  rotationSpeed?: number;
}

function Cube({ rotationSpeed = 1 }: CubeProps) {
  const ref = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.BoxGeometry(2, 2, 2), []);
  const glowTexture = useGlowTexture();

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.0126 * rotationSpeed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.2 + 0.25;
  });

  const vertices: [number, number, number][] = [
    [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1],
  ];

  return (
    <group ref={ref}>
      <lineSegments>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color={COLORS.wire} transparent opacity={0.4} />
      </lineSegments>
      {vertices.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color={COLORS.accent} transparent opacity={0.7} />
        </mesh>
      ))}
      <sprite scale={[4, 4, 1]} position={[0, 0, -0.3]}>
        <spriteMaterial map={glowTexture} color={COLORS.accent} transparent opacity={0.5} depthWrite={false} />
      </sprite>
      <mesh>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={COLORS.accent} />
      </mesh>
    </group>
  );
}

interface NodeData {
  angle: number;
  tilt: number;
  radius: number;
  speed: number;
  phase: number;
  pulseSpeed: number;
  size: number;
}

interface NodeProps {
  node: NodeData;
  glowTexture: THREE.Texture;
}

function Node({ node, glowTexture }: NodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dotRef = useRef<THREE.Sprite>(null);
  const lineRef = useRef<any>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const linePositions = useMemo(() => new Float32Array([0, 0, 0, 0, 0, 0]), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = node.angle + t * node.speed;
    const x = Math.cos(angle) * node.radius;
    const z = Math.sin(angle) * node.radius;
    const y = Math.sin(t * 0.2 + node.phase) * node.radius * node.tilt * 0.4;

    if (groupRef.current) groupRef.current.position.set(x, y, z);

    const pulse = (Math.sin(t * node.pulseSpeed + node.phase) + 1) / 2;
    if (dotRef.current) {
      const s = node.size * (0.7 + pulse * 0.6);
      dotRef.current.scale.set(s, s, 1);
      dotRef.current.material.opacity = 0.35 + pulse * 0.55;
    }
    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
      positions.setXYZ(1, x, y, z);
      positions.needsUpdate = true;
    }
    if (lineMatRef.current) {
      lineMatRef.current.opacity = 0.05 + pulse * 0.12;
    }
  });

  return (
    <>
      <line ref={lineRef as any}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial ref={lineMatRef} color={COLORS.accent} transparent opacity={0.08} />
      </line>
      <group ref={groupRef}>
        <sprite ref={dotRef} scale={[0.05, 0.05, 1]}>
          <spriteMaterial map={glowTexture} color={COLORS.accent} transparent opacity={0.6} depthWrite={false} />
        </sprite>
      </group>
    </>
  );
}

function Nodes({ count = 16 }: { count?: number }) {
  const glowTexture = useGlowTexture();
  const nodes = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      angle: Math.random() * Math.PI * 2,
      tilt: (Math.random() - 0.5) * 0.9,
      radius: 2.6 + Math.random() * 1.8,
      speed: 0.03 + Math.random() * 0.08,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.4 + Math.random() * 0.6,
      size: 0.02 + Math.random() * 0.025,
    }));
  }, [count]);

  return (
    <>
      {nodes.map((n, i) => (
        <Node key={i} node={n} glowTexture={glowTexture} />
      ))}
    </>
  );
}

interface SceneRigProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function SceneRig({ children, containerRef }: SceneRigProps) {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const maxTilt = THREE.MathUtils.degToRad(8);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, target.current.x * maxTilt, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -target.current.y * maxTilt, 0.04);

    if (containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const progress = THREE.MathUtils.clamp(1 - Math.max(0, -rect.top) / (rect.height * 0.8), 0, 1);
      const scale = 0.85 + progress * 0.15;
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

interface HeroBackgroundProps {
  nodeCount?: number;
  rotationSpeed?: number;
  accentColor?: string;
  className?: string;
}

export default function HeroBackground({
  nodeCount = 16,
  rotationSpeed = 1,
  accentColor = COLORS.accent,
  className = '',
}: HeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisible();

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, background: COLORS.bg, pointerEvents: 'none', overflow: 'hidden' }}
      aria-hidden="true"
    >
      {reducedMotion ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 45%, ${accentColor}33 0%, transparent 55%)`,
          }}
        />
      ) : (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6], fov: 45 }}
          frameloop={pageVisible ? 'always' : 'never'}
          gl={{ antialias: true, alpha: true }}
        >
          <SceneRig containerRef={containerRef}>
            <Cube rotationSpeed={rotationSpeed} />
            <Nodes count={nodeCount} />
          </SceneRig>
        </Canvas>
      )}
    </div>
  );
}
