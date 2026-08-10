import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
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

/** Padmasana (lotus pose) meditating silhouette, drawn with simple primitives */
const Padmasana = ({ color }: { color: THREE.Color }) => {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    // slow breath cycle: inhale/exhale
    const breathe = 1 + Math.sin(t * 0.45) * 0.035;
    group.current.scale.setScalar(breathe);
    group.current.position.y = -0.6 + Math.sin(t * 0.45) * 0.05;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.2,
      0.02,
    );
  });

  const mat = (opacity: number) => (
    <meshStandardMaterial
      color={color}
      roughness={0.35}
      metalness={0.35}
      transparent
      opacity={opacity}
    />
  );

  return (
    <group ref={group} position={[0, -0.6, 0]}>
      {/* head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.34, 32, 32]} />
        {mat(0.5)}
      </mesh>
      {/* neck */}
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.2, 20]} />
        {mat(0.45)}
      </mesh>
      {/* torso */}
      <mesh position={[0, 0.62, 0]}>
        <capsuleGeometry args={[0.34, 0.72, 12, 24]} />
        {mat(0.45)}
      </mesh>
      {/* crossed legs — two overlapping flattened tori */}
      <mesh position={[0, -0.02, 0.08]} rotation={[Math.PI / 2, 0, 0.18]} scale={[1, 1, 0.45]}>
        <torusGeometry args={[0.62, 0.16, 20, 80]} />
        {mat(0.42)}
      </mesh>
      <mesh position={[0, -0.14, -0.02]} rotation={[Math.PI / 2, 0, -0.18]} scale={[1, 1, 0.45]}>
        <torusGeometry args={[0.7, 0.15, 20, 80]} />
        {mat(0.35)}
      </mesh>
      {/* arms resting on knees */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.42, 0.66, 0.06]} rotation={[0, 0, s * 0.55]}>
            <capsuleGeometry args={[0.09, 0.6, 8, 16]} />
            {mat(0.4)}
          </mesh>
          {/* dhyana mudra hand on knee */}
          <mesh position={[s * 0.62, 0.16, 0.18]}>
            <sphereGeometry args={[0.12, 20, 20]} />
            {mat(0.5)}
          </mesh>
        </group>
      ))}
    </group>
  );
};

/** Lotus flower petals opening slowly beneath the figure */
const LotusPetals = ({ color }: { color: THREE.Color }) => {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.05;
    group.current.children.forEach((child, i) => {
      child.rotation.x = -1.15 + Math.sin(t * 0.4 + i * 0.5) * 0.08;
    });
  });

  const petals = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  return (
    <group ref={group} position={[0, -1.5, 0]}>
      {petals.map((i) => {
        const a = (i / petals.length) * Math.PI * 2;
        const r = 0.85 + (i % 2) * 0.25;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, 0, Math.sin(a) * r]}
            rotation={[-1.15, -a + Math.PI / 2, 0]}
            scale={[0.4, 1, 0.12]}
          >
            <sphereGeometry args={[0.6, 20, 20]} />
            <meshStandardMaterial
              color={color}
              roughness={0.3}
              metalness={0.3}
              transparent
              opacity={i % 2 ? 0.22 : 0.32}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/** Seven chakra light points rising along the spine */
const Chakras = ({ color }: { color: THREE.Color }) => {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const pulse = 0.5 + Math.sin(t * 1.1 - i * 0.6) * 0.5;
      child.scale.setScalar(0.7 + pulse * 0.6);
      const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = 0.15 + pulse * 0.35;
    });
  });

  return (
    <group ref={group}>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0, -0.5 + i * 0.42, 0.02]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
};

/** Concentric mandala rings, like a yantra behind the practitioner */
const Mandala = ({ color }: { color: THREE.Color }) => {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.z = t * 0.05;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.2, 0.03);
    group.current.scale.setScalar(1 + Math.sin(t * 0.45) * 0.03);
  });

  return (
    <group ref={group} position={[0, 0.2, -2]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}>
          <torusGeometry args={[3.4 + i * 0.6, 0.012, 8, 180]} />
          <meshBasicMaterial color={color} transparent opacity={0.26 - i * 0.06} />
        </mesh>
      ))}
      {/* petal ring of the yantra */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <mesh key={`p${i}`} position={[Math.cos(a) * 2.7, Math.sin(a) * 2.7, 0]} rotation={[0, 0, a]}>
            <circleGeometry args={[0.16, 3]} />
            <meshBasicMaterial color={color} transparent opacity={0.18} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Slow breath particles, like incense drifting upward */
const BreathParticles = ({ color }: { color: THREE.Color }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 380;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const attr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      let y = attr.getY(i) + 0.004 + (i % 5) * 0.0006;
      if (y > 6) y = -6;
      attr.setY(i, y);
      attr.setX(i, attr.getX(i) + Math.sin(t * 0.3 + i) * 0.0008);
    }
    attr.needsUpdate = true;
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
        size={0.05}
        color={color}
        transparent
        opacity={0.45}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

/** Floating mudra rings (gyan mudra: thumb + index circle) */
const MudraRings = ({ primary, accent }: { primary: THREE.Color; accent: THREE.Color }) => (
  <>
    <Float speed={0.9} rotationIntensity={0.5} floatIntensity={1.2}>
      <group position={[-4.6, 1.9, -4]} rotation={[0.3, 0.4, 0.2]}>
        <mesh>
          <torusGeometry args={[0.42, 0.05, 20, 90]} />
          <meshStandardMaterial color={primary} roughness={0.25} metalness={0.6} transparent opacity={0.45} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0.34 + i * 0.16, 0.34 - i * 0.06, 0]} rotation={[0, 0, 0.5]}>
            <capsuleGeometry args={[0.045, 0.34, 6, 12]} />
            <meshStandardMaterial color={primary} roughness={0.3} metalness={0.5} transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
    </Float>

    <Float speed={0.75} rotationIntensity={0.4} floatIntensity={1}>
      <group position={[4.9, -1.7, -4]} rotation={[-0.2, -0.4, -0.15]}>
        <mesh>
          <torusGeometry args={[0.38, 0.045, 20, 90]} />
          <meshStandardMaterial color={accent} roughness={0.25} metalness={0.55} transparent opacity={0.42} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[-0.3 - i * 0.15, 0.3 - i * 0.06, 0]} rotation={[0, 0, -0.5]}>
            <capsuleGeometry args={[0.04, 0.3, 6, 12]} />
            <meshStandardMaterial color={accent} roughness={0.3} metalness={0.5} transparent opacity={0.36} />
          </mesh>
        ))}
      </group>
    </Float>

    {/* diyas / floating lotus buds */}
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.9}>
      <mesh position={[3.2, 2.7, -6]} scale={[0.5, 1, 0.5]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color={accent} roughness={0.15} metalness={0.7} transparent opacity={0.35} />
      </mesh>
    </Float>
    <Float speed={1} rotationIntensity={0.3} floatIntensity={1.1}>
      <mesh position={[-3.5, -2.5, -5]} scale={[0.5, 1, 0.5]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color={primary} roughness={0.15} metalness={0.7} transparent opacity={0.32} />
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
    <div className="pointer-events-none absolute inset-0 z-0 opacity-60" aria-hidden="true">
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
          <BreathParticles color={primary} />
          <group position={[0, -0.2, 0]} scale={1.05}>
            <Padmasana color={primary} />
            <LotusPetals color={accent} />
            <Chakras color={accent} />
          </group>
          <MudraRings primary={primary} accent={accent} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PractitionerScene;
