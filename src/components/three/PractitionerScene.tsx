import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, TorusKnot } from "@react-three/drei";
import * as THREE from "three";

/** Reads an HSL design token from CSS and returns a THREE.Color */
const tokenColor = (name: string, fallback = "200 50% 50%") => {
  const raw =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : "";
  const [h, s, l] = (raw || fallback).replace(/%/g, "").split(/\s+/).map(Number);
  const c = new THREE.Color();
  c.setHSL((h || 0) / 360, (s || 50) / 100, (l || 50) / 100);
  return c;
};

const Particles = ({ color }: { color: THREE.Color }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 420;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.03;
    ref.current.position.y = Math.sin(t * 0.25) * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color={color}
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

const Mandala = ({ color }: { color: THREE.Color }) => {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.z = t * 0.06;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointer.y * 0.25,
      0.03,
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.25,
      0.03,
    );
    const breathe = 1 + Math.sin(t * 0.5) * 0.04;
    group.current.scale.setScalar(breathe);
  });

  return (
    <group ref={group}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}>
          <torusGeometry args={[3.6 + i * 0.55, 0.012, 8, 180]} />
          <meshBasicMaterial color={color} transparent opacity={0.28 - i * 0.06} />
        </mesh>
      ))}
    </group>
  );
};

const Shapes = ({ primary, accent }: { primary: THREE.Color; accent: THREE.Color }) => (
  <>
    <Float speed={1.1} rotationIntensity={0.7} floatIntensity={1.4}>
      <TorusKnot args={[0.75, 0.22, 160, 24]} position={[-4.4, 1.4, -2]}>
        <meshStandardMaterial
          color={primary}
          roughness={0.25}
          metalness={0.6}
          transparent
          opacity={0.45}
        />
      </TorusKnot>
    </Float>

    <Float speed={0.8} rotationIntensity={0.5} floatIntensity={1.1}>
      <Icosahedron args={[0.9, 0]} position={[4.6, -1.2, -1.5]}>
        <meshStandardMaterial
          color={accent}
          roughness={0.35}
          metalness={0.4}
          transparent
          opacity={0.4}
          flatShading
        />
      </Icosahedron>
    </Float>

    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.9}>
      <mesh position={[3.1, 2.2, -3]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color={primary}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.35}
        />
      </mesh>
    </Float>

    <Float speed={1} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh position={[-3.4, -2.1, -2.5]} rotation={[0.4, 0.3, 0]}>
        <torusGeometry args={[0.7, 0.08, 24, 100]} />
        <meshStandardMaterial
          color={accent}
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.4}
        />
      </mesh>
    </Float>
  </>
);

const PractitionerScene = () => {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { primary, accent } = useMemo(
    () => ({
      primary: tokenColor("--primary", "205 55% 30%"),
      accent: tokenColor("--accent", "172 70% 55%"),
    }),
    [],
  );

  if (prefersReduced) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 opacity-70"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 9], fov: 50 }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={1.1} />
        <pointLight position={[-6, -4, 2]} intensity={0.6} color={accent} />
        <Suspense fallback={null}>
          <Mandala color={accent} />
          <Particles color={primary} />
          <Shapes primary={primary} accent={accent} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PractitionerScene;
