"use client";

import { useLayoutEffect, useMemo, useRef, type ReactElement } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { CELL } from "@/farm/world";

export type ModelProps = {
  night: boolean;
  golden?: boolean;
  cols?: number;
  rows?: number;
};

function Mat({
  color,
  golden,
  roughness = 0.78,
  metalness = 0.04,
}: {
  color: string;
  golden?: boolean;
  roughness?: number;
  metalness?: number;
}) {
  if (golden) {
    return (
      <meshStandardMaterial
        color="#e7c56b"
        metalness={1}
        roughness={0.2}
        emissive="#b8862a"
        emissiveIntensity={0.55}
      />
    );
  }
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />;
}

function Glass({ night, w = 0.46, h = 0.62 }: { night: boolean; w?: number; h?: number }) {
  return (
    <mesh>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial
        color={night ? "#ffd7a8" : "#b7dbe6"}
        emissive={night ? "#ffb15e" : "#000000"}
        emissiveIntensity={night ? 2.4 : 0}
        roughness={0.12}
        metalness={0.05}
      />
    </mesh>
  );
}

export function Barn({ night, golden }: ModelProps) {
  return (
    <group>
      <RoundedBox args={[6.1, 0.32, 4.15]} position={[0, 0.16, 0]} radius={0.04} smoothness={2} receiveShadow>
        <Mat color="#9a9188" roughness={0.92} />
      </RoundedBox>
      <RoundedBox args={[5.7, 2.7, 3.75]} position={[0, 1.67, 0]} radius={0.05} smoothness={2} castShadow receiveShadow>
        <Mat color="#c4453c" golden={golden} roughness={0.74} />
      </RoundedBox>
      <mesh position={[0, 2.95, 0]} castShadow>
        <boxGeometry args={[5.85, 0.1, 3.9]} />
        <Mat color="#f3e6d0" roughness={0.55} />
      </mesh>
      <mesh position={[-0.72, 1.15, 1.9]} castShadow>
        <boxGeometry args={[1.22, 2.15, 0.08]} />
        <Mat color="#f6efe2" roughness={0.5} />
      </mesh>
      <mesh position={[0.72, 1.15, 1.9]} castShadow>
        <boxGeometry args={[1.22, 2.15, 0.08]} />
        <Mat color="#efe4d0" roughness={0.5} />
      </mesh>
      <mesh position={[-0.72, 1.2, 1.96]} rotation={[0, 0, 0.78]}>
        <boxGeometry args={[1.55, 0.06, 0.04]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[-0.72, 1.2, 1.96]} rotation={[0, 0, -0.78]}>
        <boxGeometry args={[1.55, 0.06, 0.04]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[0.72, 1.2, 1.96]} rotation={[0, 0, 0.78]}>
        <boxGeometry args={[1.55, 0.06, 0.04]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[0.72, 1.2, 1.96]} rotation={[0, 0, -0.78]}>
        <boxGeometry args={[1.55, 0.06, 0.04]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[-1.45, 3.7, 0]} rotation={[0, 0, 0.58]} castShadow>
        <boxGeometry args={[3.35, 0.14, 4.15]} />
        <Mat color="#6d2826" roughness={0.68} golden={golden} />
      </mesh>
      <mesh position={[1.45, 3.7, 0]} rotation={[0, 0, -0.58]} castShadow>
        <boxGeometry args={[3.35, 0.14, 4.15]} />
        <Mat color="#7a302c" roughness={0.68} golden={golden} />
      </mesh>
      <mesh position={[-0.72, 4.55, 0]} rotation={[0, 0, 0.28]} castShadow>
        <boxGeometry args={[2.15, 0.12, 4.2]} />
        <Mat color="#5c221f" roughness={0.7} />
      </mesh>
      <mesh position={[0.72, 4.55, 0]} rotation={[0, 0, -0.28]} castShadow>
        <boxGeometry args={[2.15, 0.12, 4.2]} />
        <Mat color="#5c221f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.35, 1.9]}>
        <boxGeometry args={[0.85, 0.7, 0.06]} />
        <Mat color="#f4ead8" />
      </mesh>
      <group position={[0, 3.35, 1.95]}>
        <Glass night={night} w={0.7} h={0.55} />
      </group>
      <mesh position={[0, 5.15, 0]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <Mat color="#f4ead8" />
      </mesh>
      <mesh position={[0, 5.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.62, 0.5, 4]} />
        <Mat color="#6d2826" />
      </mesh>
      <group position={[-2.15, 2.15, 1.9]}>
        <Glass night={night} w={0.42} h={0.48} />
      </group>
      <group position={[2.15, 2.15, 1.9]}>
        <Glass night={night} w={0.42} h={0.48} />
      </group>
    </group>
  );
}

export function Farmhouse({ night, golden }: ModelProps) {
  return (
    <group>
      <RoundedBox args={[4.6, 2.5, 3.4]} position={[0, 1.45, 0]} radius={0.06} smoothness={2} castShadow receiveShadow>
        <Mat color="#f0ddc0" golden={golden} roughness={0.86} />
      </RoundedBox>
      <mesh position={[-1.15, 3.15, 0]} rotation={[0, 0, 0.48]} castShadow>
        <boxGeometry args={[2.9, 0.14, 3.7]} />
        <Mat color="#7a4a2c" roughness={0.72} />
      </mesh>
      <mesh position={[1.15, 3.15, 0]} rotation={[0, 0, -0.48]} castShadow>
        <boxGeometry args={[2.9, 0.14, 3.7]} />
        <Mat color="#6a3e26" roughness={0.72} />
      </mesh>
      <mesh position={[1.35, 3.7, -0.4]} castShadow>
        <boxGeometry args={[0.42, 0.9, 0.42]} />
        <Mat color="#a86848" />
      </mesh>
      <Smoke position={[1.35, 4.2, -0.4]} />
      <mesh position={[0, 0.55, 1.85]} castShadow>
        <boxGeometry args={[0.7, 1.15, 0.08]} />
        <Mat color="#6b3e24" />
      </mesh>
      <group position={[-1.35, 1.85, 1.72]}>
        <Glass night={night} />
      </group>
      <group position={[1.25, 1.85, 1.72]}>
        <Glass night={night} />
      </group>
      <group position={[-1.35, 0.85, 1.72]}>
        <Glass night={night} w={0.42} h={0.5} />
      </group>
      <mesh position={[0, 0.18, 2.15]} receiveShadow>
        <boxGeometry args={[4.8, 0.16, 1.1]} />
        <Mat color="#c4894e" roughness={0.8} />
      </mesh>
      <mesh position={[-2.05, 0.55, 2.15]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 8]} />
        <Mat color="#6b3e24" />
      </mesh>
      <mesh position={[2.05, 0.55, 2.15]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 8]} />
        <Mat color="#6b3e24" />
      </mesh>
    </group>
  );
}

function Smoke({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Points>(null);
  const seeds = useMemo(() => {
    const arr = new Float32Array(18 * 3);
    for (let i = 0; i < 18; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.2;
      arr[i * 3 + 1] = Math.random();
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return arr;
  }, []);
  useFrame(({ clock }) => {
    const pts = ref.current;
    if (!pts) return;
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    const t = clock.elapsedTime;
    for (let i = 0; i < 18; i++) {
      const life = (t * 0.25 + seeds[i * 3 + 1]) % 1;
      pos.setXYZ(i, seeds[i * 3] + Math.sin(t + i) * 0.08, life * 1.4, seeds[i * 3 + 2]);
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seeds, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f4f1ec" size={0.18} transparent opacity={0.45} depthWrite={false} />
    </points>
  );
}

export function Silo({ night, golden }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.05, 4.2, 20]} />
        <Mat color="#efe6d6" golden={golden} roughness={0.45} metalness={golden ? 1 : 0.35} />
      </mesh>
      <mesh position={[0, 4.25, 0]} castShadow>
        <sphereGeometry args={[0.95, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Mat color="#d4534a" roughness={0.55} />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[1.06, 1.06, 0.12, 20]} />
        <Mat color="#c4453c" metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.55, 0.95]} castShadow>
        <boxGeometry args={[0.5, 0.9, 0.08]} />
        <Mat color="#6b3e24" />
      </mesh>
      <group position={[0, 1.8, 1.02]}>
        <Glass night={night} w={0.28} h={0.28} />
      </group>
    </group>
  );
}

export function Shed({ night, golden }: ModelProps) {
  return (
    <group>
      <RoundedBox args={[2.6, 1.6, 2.1]} position={[0, 0.95, 0]} radius={0.05} smoothness={2} castShadow receiveShadow>
        <Mat color="#e4c48a" golden={golden} />
      </RoundedBox>
      <mesh position={[-0.7, 2.05, 0]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[1.7, 0.1, 2.35]} />
        <Mat color="#5c3a2a" />
      </mesh>
      <mesh position={[0.7, 2.05, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[1.7, 0.1, 2.35]} />
        <Mat color="#5c3a2a" />
      </mesh>
      <mesh position={[0, 0.55, 1.08]}>
        <boxGeometry args={[0.55, 1.05, 0.06]} />
        <Mat color="#6b3e24" />
      </mesh>
      <group position={[-0.75, 1.15, 1.08]}>
        <Glass night={night} w={0.4} h={0.36} />
      </group>
    </group>
  );
}

export function Windmill({ night, golden }: ModelProps) {
  const blades = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (blades.current) blades.current.rotation.z -= dt * 0.7;
  });
  return (
    <group>
      <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.95, 4.2, 8]} />
        <Mat color="#f0e2c8" golden={golden} roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.35, 0]} castShadow>
        <coneGeometry args={[0.7, 0.7, 8]} />
        <Mat color="#7a4a2c" />
      </mesh>
      <group position={[0, 3.5, 0.62]} ref={blades}>
        {[0, 1, 2, 3].map((i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
            <mesh position={[0, 0.85, 0]} castShadow>
              <boxGeometry args={[0.22, 1.7, 0.06]} />
              <Mat color={i % 2 ? "#e07a55" : "#d4534a"} roughness={0.55} />
            </mesh>
          </group>
        ))}
        <mesh>
          <sphereGeometry args={[0.16, 12, 12]} />
          <Mat color="#f6ead2" />
        </mesh>
      </group>
      <group position={[0, 1.4, 0.9]}>
        <Glass night={night} w={0.28} h={0.34} />
      </group>
    </group>
  );
}

export function WaterTower({ night, golden }: ModelProps) {
  return (
    <group>
      {[
        [-0.55, 0, -0.55],
        [0.55, 0, -0.55],
        [-0.55, 0, 0.55],
        [0.55, 0, 0.55],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], 1.5, p[2]]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 3, 6]} />
          <Mat color="#8d8680" metalness={0.45} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 3.15, 0]} castShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.85, 16]} />
        <Mat color="#d5e4ea" golden={golden} metalness={golden ? 1 : 0.55} roughness={0.28} />
      </mesh>
      <mesh position={[0, 3.65, 0]} castShadow>
        <coneGeometry args={[1.05, 0.45, 16]} />
        <Mat color="#6b3e24" />
      </mesh>
      <group position={[0, 3.15, 0.97]}>
        <Glass night={night} w={0.2} h={0.2} />
      </group>
    </group>
  );
}

export function Coop({ night }: ModelProps) {
  return (
    <group>
      <RoundedBox args={[1.7, 1.05, 1.3]} position={[0, 0.7, 0]} radius={0.05} smoothness={2} castShadow receiveShadow>
        <Mat color="#f0d7a4" />
      </RoundedBox>
      <mesh position={[0, 1.45, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.25, 0.55, 4]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[0, 0.4, 0.68]}>
        <boxGeometry args={[0.4, 0.55, 0.05]} />
        <Mat color="#6b3e24" />
      </mesh>
      <group position={[0.45, 0.85, 0.68]}>
        <Glass night={night} w={0.22} h={0.22} />
      </group>
    </group>
  );
}

export function Pond() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
      <circleGeometry args={[2.15, 40]} />
      <shaderMaterial
        ref={mat}
        transparent
        uniforms={{
          uTime: { value: 0 },
          uShallow: { value: new THREE.Color("#3aa7c4") },
          uDeep: { value: new THREE.Color("#0e4d63") },
        }}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vPos;
          uniform float uTime;
          void main() {
            vUv = uv;
            vec3 p = position;
            p.z += sin(position.x * 3.0 + uTime * 1.4) * 0.03 + cos(position.y * 2.4 + uTime) * 0.02;
            vPos = p;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uShallow;
          uniform vec3 uDeep;
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vPos;
          void main() {
            float d = distance(vUv, vec2(0.5));
            float fres = pow(smoothstep(0.15, 0.5, d), 1.2);
            float ripple = sin(vPos.x * 18.0 + uTime * 2.0) * sin(vPos.y * 14.0 - uTime * 1.6);
            vec3 col = mix(uDeep, uShallow, fres + ripple * 0.08);
            col += vec3(0.15, 0.18, 0.12) * smoothstep(0.02, 0.0, abs(ripple) - 0.92);
            gl_FragColor = vec4(col, 0.92);
          }
        `}
      />
    </mesh>
  );
}

export function Tree({ golden }: ModelProps) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.8) * 0.015;
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.4, 6]} />
        <Mat color="#6b4228" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.72, 16, 12]} />
        <Mat color="#1c8f84" golden={golden} roughness={0.85} />
      </mesh>
      <mesh position={[-0.4, 1.45, 0.15]} castShadow>
        <sphereGeometry args={[0.48, 12, 10]} />
        <Mat color="#146e66" roughness={0.88} />
      </mesh>
      <mesh position={[0.38, 1.5, -0.1]}>
        <sphereGeometry args={[0.42, 12, 10]} />
        <Mat color="#2fbfb0" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function Blossom() {
  return (
    <group>
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 1.3, 6]} />
        <Mat color="#6b4228" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.66, 14, 12]} />
        <Mat color="#f2a3c0" roughness={0.8} />
      </mesh>
      <mesh position={[-0.35, 1.4, 0.1]}>
        <sphereGeometry args={[0.4, 10, 8]} />
        <Mat color="#e56b93" roughness={0.82} />
      </mesh>
      <mesh position={[0.32, 1.45, -0.08]}>
        <sphereGeometry args={[0.36, 10, 8]} />
        <Mat color="#ffd0e0" roughness={0.75} />
      </mesh>
    </group>
  );
}

export function Wheat({ cols = 4, rows = 2 }: ModelProps) {
  return <Field color="#e2b14a" cols={cols} rows={rows} height={0.85} />;
}

export function Crops({ cols = 3, rows = 1 }: ModelProps) {
  return <Field color="#2f8f45" cols={cols} rows={rows} height={0.45} />;
}

function Field({ color, cols, rows, height }: { color: string; cols: number; rows: number; height: number }) {
  const w = Math.max(1.2, cols * CELL * 0.85);
  const d = Math.max(1.2, rows * CELL * 0.85);
  const count = Math.min(220, Math.floor((w * d) / 0.18));
  const geom = useMemo(() => new THREE.ConeGeometry(0.035, height, 4), [height]);
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set((Math.random() - 0.5) * w, height / 2, (Math.random() - 0.5) * d);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.scale.setScalar(0.75 + Math.random() * 0.5);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, d, dummy, height, w]);
  return (
    <instancedMesh ref={ref} args={[geom, undefined, count]}>
      <meshStandardMaterial color={color} roughness={0.85} />
    </instancedMesh>
  );
}

export function Scarecrow() {
  return (
    <group>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.8, 6]} />
        <Mat color="#6b4228" />
      </mesh>
      <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 1.1, 6]} />
        <Mat color="#6b4228" />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.55, 0.45, 0.2]} />
        <Mat color="#c4453c" />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.18, 12, 10]} />
        <Mat color="#f0d2a4" />
      </mesh>
      <mesh position={[0, 1.82, 0]}>
        <coneGeometry args={[0.22, 0.28, 8]} />
        <Mat color="#2c241c" />
      </mesh>
    </group>
  );
}

function BirdBody({ color, comb }: { color: string; comb: string }) {
  const head = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!head.current) return;
    const t = clock.elapsedTime;
    head.current.rotation.x = Math.sin(t * 3.2) > 0.65 ? 0.5 : 0;
  });
  return (
    <group>
      <mesh position={[0, 0.22, 0]} castShadow>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <group ref={head} position={[0.12, 0.3, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0.08, 0.06, 0]}>
          <coneGeometry args={[0.03, 0.06, 4]} />
          <meshStandardMaterial color={comb} />
        </mesh>
      </group>
    </group>
  );
}

export function Chicken() {
  return <BirdBody color="#f4efe4" comb="#e1534a" />;
}
export function Hen() {
  return <BirdBody color="#e0a84a" comb="#c4453c" />;
}

export function Cow() {
  const tail = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (tail.current) tail.current.rotation.z = Math.sin(clock.elapsedTime * 2.2) * 0.4;
  });
  return (
    <group>
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.32, 0.7, 4, 8]} />
        <meshStandardMaterial color="#f6f1e6" roughness={0.72} />
      </mesh>
      <mesh position={[-0.18, 0.72, 0.1]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial color="#5c4638" roughness={0.8} />
      </mesh>
      <mesh position={[-0.55, 0.62, 0]} castShadow>
        <sphereGeometry args={[0.2, 10, 8]} />
        <meshStandardMaterial color="#f6f1e6" roughness={0.7} />
      </mesh>
      <group ref={tail} position={[0.48, 0.7, 0]}>
        <mesh position={[0.12, -0.05, 0]} rotation={[0, 0, 0.6]}>
          <cylinderGeometry args={[0.02, 0.02, 0.28, 4]} />
          <meshStandardMaterial color="#5c4638" />
        </mesh>
      </group>
    </group>
  );
}

export function Sheep() {
  return (
    <group>
      <mesh position={[0, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.32, 12, 10]} />
        <meshStandardMaterial color="#f7f4ef" roughness={1} />
      </mesh>
      <mesh position={[-0.28, 0.48, 0]} castShadow>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#f3efe8" roughness={0.85} />
      </mesh>
      <mesh position={[-0.4, 0.46, 0]}>
        <sphereGeometry args={[0.07, 8, 6]} />
        <meshStandardMaterial color="#3a2c24" />
      </mesh>
    </group>
  );
}

export function Cat() {
  const tail = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (tail.current) tail.current.rotation.z = Math.sin(clock.elapsedTime * 2.4) * 0.5;
  });
  return (
    <group>
      <mesh position={[0, 0.16, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.18, 3, 6]} />
        <meshStandardMaterial color="#e39a4e" roughness={0.7} />
      </mesh>
      <mesh position={[0.16, 0.26, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#e39a4e" />
      </mesh>
      <group ref={tail} position={[-0.18, 0.2, 0]}>
        <mesh rotation={[0, 0, 0.8]} position={[-0.08, 0.06, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.2, 4]} />
          <meshStandardMaterial color="#c4844a" />
        </mesh>
      </group>
    </group>
  );
}

export function Dog() {
  const tail = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (tail.current) tail.current.rotation.z = Math.sin(clock.elapsedTime * 6) * 0.45;
  });
  return (
    <group>
      <mesh position={[0, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.14, 0.28, 4, 8]} />
        <meshStandardMaterial color="#c47a3a" roughness={0.7} />
      </mesh>
      <mesh position={[0.28, 0.38, 0]} castShadow>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color="#d08a48" />
      </mesh>
      <mesh position={[0.22, 0.32, 0]}>
        <boxGeometry args={[0.16, 0.05, 0.16]} />
        <meshStandardMaterial color="#c4453c" />
      </mesh>
      <group ref={tail} position={[-0.28, 0.36, 0]}>
        <mesh rotation={[0, 0, 1]} position={[-0.1, 0.04, 0]}>
          <cylinderGeometry args={[0.02, 0.025, 0.22, 5]} />
          <meshStandardMaterial color="#a86830" />
        </mesh>
      </group>
    </group>
  );
}

export function Tractor() {
  const wheel = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (wheel.current) wheel.current.rotation.x -= dt * 0.8;
  });
  return (
    <group>
      <mesh ref={wheel} position={[-0.35, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.18, 12]} />
        <meshStandardMaterial color="#2a241c" roughness={0.85} />
      </mesh>
      <mesh position={[0.4, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.12, 10]} />
        <meshStandardMaterial color="#2a241c" />
      </mesh>
      <mesh position={[0.05, 0.42, 0]} castShadow>
        <boxGeometry args={[0.85, 0.32, 0.5]} />
        <meshStandardMaterial color="#d4534a" roughness={0.55} metalness={0.15} />
      </mesh>
      <mesh position={[0.28, 0.68, 0]}>
        <boxGeometry args={[0.32, 0.28, 0.42]} />
        <meshStandardMaterial color="#b7e0ea" roughness={0.15} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function Mailbox() {
  const flag = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (flag.current) flag.current.rotation.z = Math.sin(clock.elapsedTime * 1.6) * 0.15;
  });
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.9, 6]} />
        <Mat color="#6b3e24" />
      </mesh>
      <mesh position={[0.12, 0.85, 0]} castShadow>
        <boxGeometry args={[0.42, 0.22, 0.22]} />
        <meshStandardMaterial color="#d4534a" roughness={0.5} metalness={0.15} />
      </mesh>
      <group ref={flag} position={[0.32, 0.95, 0]}>
        <mesh position={[0.08, 0.08, 0]}>
          <boxGeometry args={[0.16, 0.1, 0.02]} />
          <meshStandardMaterial color="#e1534a" />
        </mesh>
      </group>
    </group>
  );
}

export function Stall() {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <boxGeometry args={[1.5, 0.12, 0.7]} />
        <Mat color="#c4894e" />
      </mesh>
      <mesh position={[0, 0.85, 0]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.7, 0.06, 0.9]} />
        <meshStandardMaterial color="#f4a0be" roughness={0.6} />
      </mesh>
      <mesh position={[-0.55, 0.55, 0]}>
        <boxGeometry args={[0.28, 0.22, 0.28]} />
        <Mat color="#e2b14a" />
      </mesh>
    </group>
  );
}

export function Sign() {
  return (
    <group>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 1.1, 6]} />
        <Mat color="#6b3e24" />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.7, 0.4, 0.06]} />
        <Mat color="#f3e6d0" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function Fence({ cols = 2 }: ModelProps) {
  const w = Math.max(CELL, (cols ?? 2) * CELL * 0.92);
  const posts = Math.max(2, Math.round(w / 1.1));
  return (
    <group>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[w, 0.06, 0.06]} />
        <Mat color="#e7d3b0" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[w, 0.06, 0.06]} />
        <Mat color="#f0e2c8" roughness={0.7} />
      </mesh>
      {Array.from({ length: posts }, (_, i) => {
        const x = -w / 2 + (i * w) / (posts - 1);
        return (
          <mesh key={i} position={[x, 0.45, 0]} castShadow>
            <boxGeometry args={[0.08, 0.9, 0.08]} />
            <Mat color="#f4ead8" />
          </mesh>
        );
      })}
    </group>
  );
}

export function Hay() {
  return (
    <mesh position={[0, 0.28, 0]} rotation={[0, 0.4, 0]} castShadow>
      <cylinderGeometry args={[0.38, 0.42, 0.5, 10]} />
      <meshStandardMaterial color="#e2b14a" roughness={0.9} />
    </mesh>
  );
}

export function Greenhouse() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.6, 0.2, 1.1]} />
        <Mat color="#c4894e" />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.75, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d7f3f4" transparent opacity={0.45} roughness={0.05} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <Mat color="#1f9a8e" />
      </mesh>
    </group>
  );
}

export function FencePeg({ golden }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.9, 6]} />
        <Mat color="#f0e2c8" golden={golden} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <Mat color="#e2b14a" golden={golden} metalness={golden ? 1 : 0.1} />
      </mesh>
    </group>
  );
}

export function FlowerSign({ golden }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.7, 5]} />
        <Mat color="#3d7a32" />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.16, 8, 6]} />
        <meshStandardMaterial color={golden ? "#e7c56b" : "#f4a0be"} emissive={golden ? "#b8862a" : "#000"} emissiveIntensity={golden ? 0.4 : 0} roughness={0.45} metalness={golden ? 0.8 : 0} />
      </mesh>
      <mesh position={[0, 0.75, 0.08]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#e2b14a" />
      </mesh>
    </group>
  );
}

export function AnimalSign() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.08, 1, 0.08]} />
        <Mat color="#6b3e24" />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.55, 0.32, 0.05]} />
        <Mat color="#f6ead2" />
      </mesh>
    </group>
  );
}

export function PlotStake({ golden }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.07, 0.9, 0.07]} />
        <Mat color="#6b3e24" golden={golden} />
      </mesh>
      <mesh position={[0.18, 0.78, 0]}>
        <boxGeometry args={[0.28, 0.16, 0.03]} />
        <Mat color="#f6ead2" golden={golden} />
      </mesh>
    </group>
  );
}

export const MODELS: Record<string, (props: ModelProps) => ReactElement> = {
  barn: Barn,
  farmhouse: Farmhouse,
  silo: Silo,
  shed: Shed,
  windmill: Windmill,
  waterTower: WaterTower,
  coop: Coop,
  pond: Pond,
  tree: Tree,
  blossom: Blossom,
  wheat: Wheat,
  crops: Crops,
  scarecrow: Scarecrow,
  chicken: Chicken,
  hen: Hen,
  cow: Cow,
  sheep: Sheep,
  cat: Cat,
  dog: Dog,
  tractor: Tractor,
  mailbox: Mailbox,
  stall: Stall,
  sign: Sign,
  fence: Fence,
  hay: Hay,
  greenhouse: Greenhouse,
  fencePeg: FencePeg,
  flowerSign: FlowerSign,
  animalSign: AnimalSign,
  plotStake: PlotStake,
};
