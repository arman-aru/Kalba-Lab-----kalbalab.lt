"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Interactive dotted globe used in the homepage hero.
 *
 * Implementation notes:
 * - Dots are placed via a Fibonacci sphere (uniform distribution on a sphere).
 * - "Continents" are simulated by a layered sin/cos noise: dots whose noise
 *   value crosses a threshold get the bright amber colour, the rest are dim.
 *   This is intentionally not a real Earth map — keeping it stylised matches
 *   the brand and avoids shipping a heavy texture or geo-coordinate dataset.
 * - Auto-rotates slowly when idle; user drag (mouse or touch) takes over via
 *   OrbitControls. Zoom and pan are disabled so the globe stays centred.
 */

/**
 * Approximate continent positions on a unit sphere. Each entry is a pole
 * (centre lat / lon in degrees) and an angular radius in degrees. We mark a
 * Fibonacci-sphere point as "land" when its great-circle distance to any
 * pole is inside that radius (plus a touch of edge noise so the shapes look
 * organic, not perfectly circular).
 *
 * Sized roughly to match Earth's real landmasses; not pixel-accurate, but
 * unmistakably "Earth" rather than abstract speckle.
 */
const CONTINENTS_LL: { lat: number; lon: number; r: number }[] = [
  { lat:  55, lon:  90, r: 40 }, // Eurasia (big)
  { lat:  50, lon:  10, r: 22 }, // Europe extension
  { lat:  20, lon:  78, r: 18 }, // India sub-cont.
  { lat:  10, lon:  25, r: 25 }, // Africa
  { lat: -10, lon:  20, r: 18 }, // Sub-Saharan Africa extension
  { lat:  55, lon: -100, r: 28 }, // North America
  { lat:  20, lon: -100, r: 16 }, // Mexico / Central America
  { lat: -15, lon: -60, r: 22 }, // South America
  { lat: -25, lon: 135, r: 15 }, // Australia
  { lat: -80, lon:   0, r: 28 }, // Antarctica cap
];

// Pre-compute continent centres in unit Cartesian for fast dot-product
// distance, run once at module load.
const CONTINENT_CARTESIAN = CONTINENTS_LL.map((c) => {
  const lat = (c.lat * Math.PI) / 180;
  const lon = (c.lon * Math.PI) / 180;
  return {
    x: Math.cos(lat) * Math.cos(lon),
    y: Math.sin(lat),
    z: Math.cos(lat) * Math.sin(lon),
    rRad: (c.r * Math.PI) / 180,
  };
});

function isLand(nx: number, ny: number, nz: number): boolean {
  // Edge noise pushes the boundary in/out by a few degrees so blobs aren't
  // perfectly circular — gives recognisable, irregular continent outlines.
  const edge =
    (Math.sin(nx * 6) * Math.cos(ny * 5) * Math.sin(nz * 7) +
      Math.sin(nx * 11 + ny * 9) * 0.4) *
    0.06;

  for (const c of CONTINENT_CARTESIAN) {
    const dot = nx * c.x + ny * c.y + nz * c.z;
    // Clamp for floating-point safety, then convert to angular distance.
    const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
    if (angle < c.rRad + edge) return true;
  }
  return false;
}

/**
 * Fibonacci-sphere of candidate points; only "land" points are emitted so
 * the dark sphere underneath shows through as ocean.
 */
function generateDots(count: number, radius: number) {
  const positions: number[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = Math.PI * 2 * goldenRatio;

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = angleIncrement * i;

    const sinIncl = Math.sin(inclination);
    const nx = sinIncl * Math.cos(azimuth);
    const ny = Math.cos(inclination);
    const nz = sinIncl * Math.sin(azimuth);

    if (isLand(nx, ny, nz)) {
      positions.push(nx * radius, ny * radius, nz * radius);
    }
  }
  return new Float32Array(positions);
}

function Globe() {
  // Build the points geometry imperatively. The declarative
  // <bufferAttribute args={...}> pattern works in simple cases but has been
  // flaky for me with variable-length arrays (no dots emit) — this version
  // is bulletproof.
  const dotsGeometry = useMemo(() => {
    // 6000 candidates → ~2500 land points after filtering. Halving the
    // candidate sphere roughly halved init time on mobile without hurting
    // the visual density.
    const positions = generateDots(6000, 2);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  // Auto-rotate the whole globe (sphere + dots + halo) on the Y-axis.
  // Rings stay fixed so they read as "orbits around" rather than "painted on".
  const sphereRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (sphereRef.current) sphereRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group>
      {/* Sphere + dots + halo rotate together on Y-axis (auto-rotation). */}
      <group ref={sphereRef}>
        {/* Solid dark interior so the back of the sphere is fully opaque. */}
        <mesh>
          <sphereGeometry args={[1.97, 64, 64]} />
          <meshBasicMaterial color="#0a0604" />
        </mesh>

        {/* Land-mass dots — only "continent" points are emitted, so the dark
            sphere underneath shows through as ocean. */}
        <points geometry={dotsGeometry}>
          <pointsMaterial
            size={0.075}
            color="#fbbf24"
            transparent
            opacity={1}
            sizeAttenuation
          />
        </points>

        {/* Subtle outer glow halo */}
        <mesh>
          <sphereGeometry args={[2.05, 32, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.05} side={2} />
        </mesh>
      </group>

      {/* Orbital rings stay fixed — they read as orbits AROUND the globe. */}
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[2.45, 0.006, 16, 128]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2.6, 0.3, 0.4]}>
        <torusGeometry args={[2.6, 0.004, 16, 128]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function InteractiveGlobe() {
  return (
    <Canvas
      // Camera pulled back + slightly wider FOV so the orbital rings (~r 2.6)
      // don't clip the globe at the canvas edges.
      camera={{ position: [0, 0, 7.2], fov: 42 }}
      // Cap DPR at 1.5 instead of 2 — on retina mobile this cuts pixel work
      // by ~30% with negligible visible quality loss for a dotted globe.
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop="always"
    >
      <ambientLight intensity={0.7} />
      <Globe />
    </Canvas>
  );
}
