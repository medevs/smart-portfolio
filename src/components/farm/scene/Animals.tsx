"use client";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { animalPose } from "./object-motion";
import { gameClock } from "@/farm/game/clock";
import { landNoise, randomSeed } from "./natural-geometry";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Ellipsoid, Rod } from "./ObjectParts";
import type { ModelProps } from "./models";

type Kind = "cow" | "sheep" | "donkey" | "dog" | "cat";
const ANATOMY = {
  cow: {
    length: 1.7,
    width: 0.38,
    depth: 0.36,
    leg: 0.76,
    color: "#a69c7e",
    muzzle: "#786e5d",
    face: 0.27,
    tail: 0.52,
  },
  sheep: {
    length: 0.92,
    width: 0.29,
    depth: 0.3,
    leg: 0.43,
    color: "#c5bfaa",
    muzzle: "#615e50",
    face: 0.19,
    tail: 0.13,
  },
  donkey: {
    length: 1.35,
    width: 0.3,
    depth: 0.32,
    leg: 0.71,
    color: "#8d8979",
    muzzle: "#b5af99",
    face: 0.26,
    tail: 0.42,
  },
  dog: {
    length: 0.76,
    width: 0.18,
    depth: 0.19,
    leg: 0.38,
    color: "#a88d62",
    muzzle: "#7a705d",
    face: 0.16,
    tail: 0.32,
  },
  cat: {
    length: 0.49,
    width: 0.115,
    depth: 0.12,
    leg: 0.22,
    color: "#a4967d",
    muzzle: "#c3bba5",
    face: 0.11,
    tail: 0.36,
  },
};
function coatGeometry(kind: Kind) {
  const cfg = ANATOMY[kind],
    g = new THREE.SphereGeometry(1, 22, 16),
    p = g.attributes.position,
    colors: number[] = [];
  const base = new THREE.Color(cfg.color),
    dark = new THREE.Color("#5a5141");
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      y = p.getY(i),
      z = p.getZ(i);
    const rib = 1 + 0.035 * Math.sin(x * 13) * Math.max(0, -y);
    p.setXYZ(i, x * cfg.length * 0.55, y * cfg.depth * rib, z * cfg.width * (1 - 0.12 * x));
    const spot =
      kind === "cow"
        ? THREE.MathUtils.smoothstep(landNoise(x * 3.1 + 5, z * 3 + y), 0.51, 0.63)
        : kind === "cat"
          ? Math.sin(x * 30 + y * 4) > 0.7
            ? 0.22
            : 0
          : 0;
    const c = base
      .clone()
      .lerp(dark, spot)
      .multiplyScalar(0.94 + landNoise(x * 12, z * 12) * 0.1);
    colors.push(c.r, c.g, c.b);
  }
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}
function mergeColored(parts: { geometry: THREE.BufferGeometry; color: string }[]) {
  const prepared = parts.map(({ geometry, color }) => {
    const g = geometry.index ? geometry.toNonIndexed() : geometry;
    const c = new THREE.Color(color),
      colors: number[] = [];
    for (let i = 0; i < g.attributes.position.count; i++) colors.push(c.r, c.g, c.b);
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  });
  const result = mergeGeometries(prepared, false)!;
  prepared.forEach((g) => g.dispose());
  parts.forEach((p) => p.geometry.dispose());
  return result;
}
function headGeometry(kind: Kind) {
  const c = ANATOMY[kind],
    f = c.face,
    parts: { geometry: THREE.BufferGeometry; color: string }[] = [];
  const oval = (
    position: [number, number, number],
    scale: [number, number, number],
    color: string,
  ) =>
    parts.push({
      geometry: new THREE.SphereGeometry(1, 12, 9).scale(...scale).translate(...position),
      color,
    });
  oval([f * 0.35, f * 0.25, 0], [f * 0.8, f * 1.2, f * 0.7], c.color);
  oval([f * 1.15, f * 0.42, 0], [f, f * 0.72, f * 0.65], c.color);
  oval([f * 1.9, f * 0.05, 0], [f * 0.65, f * 0.42, f * 0.64], c.muzzle);
  for (const z of [-1, 1]) {
    oval([f * 1.5, f * 0.65, z * f * 0.58], [f * 0.09, f * 0.075, f * 0.045], "#252d25");
    oval([f * 2.25, f * 0.12, z * f * 0.37], [f * 0.08, f * 0.05, f * 0.04], "#494c3e");
    oval(
      [f * 0.75, f * (kind === "donkey" ? 1.6 : 1.1), z * f * 0.7],
      [f * 0.34, f * (kind === "donkey" ? 0.95 : kind === "cat" ? 0.45 : 0.22), f * 0.22],
      c.color,
    );
    if (kind === "cow")
      parts.push({
        geometry: new THREE.ConeGeometry(0.025, f * 0.6, 8)
          .rotateZ(0.3)
          .translate(f * 0.58, f * 1.37, z * f * 0.7),
        color: "#b9b49c",
      });
  }
  if (kind === "donkey")
    parts.push({
      geometry: new THREE.BoxGeometry(0.06, 0.3, 0.07).translate(-0.04, 0.15, 0),
      color: "#5b5c50",
    });
  return mergeColored(parts);
}
function legGeometry(kind: Kind) {
  const c = ANATOMY[kind],
    r = kind === "cow" ? 0.065 : kind === "donkey" ? 0.045 : kind === "sheep" ? 0.035 : 0.025;
  return mergeColored([
    {
      geometry: new THREE.CylinderGeometry(r * 1.25, r, c.leg * 0.5, 8).translate(
        0,
        -c.leg * 0.25,
        0,
      ),
      color: c.color,
    },
    {
      geometry: new THREE.SphereGeometry(1, 10, 7)
        .scale(r * 1.1, r * 1.3, r * 1.1)
        .translate(0, -c.leg * 0.5, 0),
      color: c.color,
    },
    {
      geometry: new THREE.CylinderGeometry(r * 0.75, r * 0.6, c.leg * 0.5, 8).translate(
        0.015,
        -c.leg * 0.75,
        0,
      ),
      color: c.color,
    },
    {
      geometry: new THREE.BoxGeometry(r * 2.3, 0.07, r * 1.8).translate(0.035, -c.leg + 0.035, 0),
      color: "#45473d",
    },
  ]);
}
function Wool() {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const random = randomSeed(29),
      o = new THREE.Object3D();
    for (let i = 0; i < 64; i++) {
      const a = i * 2.399,
        y = 1 - (2 * (i + 0.5)) / 64,
        r = Math.sqrt(1 - y * y);
      o.position.set(Math.cos(a) * r * 0.48, y * 0.27, Math.sin(a) * r * 0.28);
      o.scale.setScalar(0.075 + random() * 0.025);
      o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, []);
  return (
    <instancedMesh name="sheep-fleece" ref={ref} args={[undefined, undefined, 64]} castShadow>
      <sphereGeometry args={[1, 7, 5]} />
      <meshStandardMaterial color="#c6c1ad" roughness={1} />
    </instancedMesh>
  );
}
export function FarmAnimal({
  kind,
  phase = 0,
  raining = false,
  motion,
}: {
  kind: Kind;
  phase?: number;
  raining?: boolean;
  motion?: ModelProps["motion"];
}) {
  const cfg = ANATOMY[kind],
    body = useRef<THREE.Group>(null),
    head = useRef<THREE.Group>(null),
    tail = useRef<THREE.Group>(null),
    legs = useRef<(THREE.Group | null)[]>([]);
  const geometry = useMemo(() => coatGeometry(kind), [kind]),
    faceGeometry = useMemo(() => headGeometry(kind), [kind]),
    limbGeometry = useMemo(() => legGeometry(kind), [kind]);
  const tailGeometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(),
          new THREE.Vector3(-cfg.tail * 0.45, kind === "dog" || kind === "cat" ? 0.12 : -0.12, 0),
          new THREE.Vector3(-cfg.tail, kind === "cat" ? 0.3 : kind === "dog" ? 0.2 : -0.35, 0.03),
        ]),
        10,
        kind === "cat" ? 0.025 : 0.018,
        6,
        false,
      ),
    [cfg.tail, kind],
  );
  useFrame(() => {
    const pose = motion?.current ?? animalPose(gameClock.seconds, phase, raining);
    if (body.current) body.current.scale.y = 1 + pose.breath;
    if (head.current) {
      head.current.rotation.z = -pose.head * 1.8;
      head.current.position.y = cfg.leg + cfg.depth * 0.85 + 0.1 - pose.head * 0.12;
    }
    if (tail.current) tail.current.rotation.y = pose.tail;
    legs.current.forEach((leg, i) => {
      if (leg) leg.rotation.z = pose.gait * 0.3 * (i === 0 || i === 3 ? 1 : -1);
    });
  });
  const y = cfg.leg + cfg.depth * 0.85;
  return (
    <group name={`natural-${kind}`}>
      <group name="animal-torso" ref={body} position={[0, y, 0]}>
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial vertexColors roughness={0.96} metalness={0} />
        </mesh>
        {kind === "sheep" && <Wool />}
      </group>
      {[-1, 1].flatMap((side, ix) =>
        [-1, 1].map((z, iz) => (
          <group
            key={`${side}:${z}`}
            name={`animal-leg-${ix * 2 + iz}`}
            ref={(node) => {
              legs.current[ix * 2 + iz] = node;
            }}
            position={[side * cfg.length * 0.34, cfg.leg, z * cfg.width * 0.69]}
          >
            <mesh geometry={limbGeometry} castShadow>
              <meshStandardMaterial vertexColors roughness={0.95} metalness={0} />
            </mesh>
          </group>
        )),
      )}
      <group name="animal-head" ref={head} position={[cfg.length * 0.38, y + 0.1, 0]}>
        <mesh geometry={faceGeometry} position={[cfg.face * 0.6, 0, 0]} castShadow>
          <meshStandardMaterial vertexColors roughness={0.85} metalness={0} />
        </mesh>
      </group>
      <group name="animal-tail" ref={tail} position={[-cfg.length * 0.51, y + 0.1, 0]}>
        <mesh geometry={tailGeometry} castShadow>
          <meshStandardMaterial color={kind === "cow" ? "#625d4c" : cfg.color} roughness={1} />
        </mesh>
      </group>
    </group>
  );
}
export const Cow = (props: ModelProps) => <FarmAnimal kind="cow" {...props} />;
export const Sheep = (props: ModelProps) => <FarmAnimal kind="sheep" {...props} />;
export const Donkey = (props: ModelProps) => <FarmAnimal kind="donkey" {...props} />;
export const Dog = (props: ModelProps) => <FarmAnimal kind="dog" {...props} />;
export const Cat = (props: ModelProps) => <FarmAnimal kind="cat" {...props} />;

function Poultry({
  brown = false,
  phase = 0,
  raining = false,
}: {
  brown?: boolean;
  phase?: number;
  raining?: boolean;
}) {
  const head = useRef<THREE.Group>(null),
    feet = useRef<(THREE.Group | null)[]>([]);
  useFrame(() => {
    const p = animalPose(gameClock.seconds, phase, raining);
    if (head.current) head.current.rotation.z = -p.head * 2.1;
    feet.current.forEach((f, i) => {
      if (f) f.rotation.z = p.gait * 0.45 * (i ? 1 : -1);
    });
  });
  const feather = brown ? "#9b8057" : "#c9c6b2";
  return (
    <group name="natural-poultry">
      <Ellipsoid position={[0, 0.25, 0]} scale={[0.24, 0.16, 0.14]} color={feather} />
      {[-1, 1].map((side) => (
        <group key={side}>
          <Ellipsoid
            position={[-0.03, 0.28, side * 0.12]}
            scale={[0.17, 0.095, 0.035]}
            color={brown ? "#867151" : "#b7b7a6"}
          />
          <group
            ref={(node) => {
              feet.current[side === -1 ? 0 : 1] = node;
            }}
            position={[0.02, 0.17, side * 0.065]}
          >
            <Rod a={[0, 0, 0]} b={[0.015, -0.14, 0]} r={0.012} color="#9e895c" />
            {[-1, 0, 1].map((z) => (
              <Rod
                key={z}
                a={[0.015, -0.14, 0]}
                b={[0.09, -0.15, z * 0.035]}
                r={0.006}
                color="#9e895c"
              />
            ))}
          </group>
        </group>
      ))}
      <group ref={head} position={[0, 0.33, 0]}>
        <group position={[0.15, 0, 0]}>
          <Ellipsoid position={[0, 0.05, 0]} scale={[0.055, 0.12, 0.055]} color={feather} />
          <Ellipsoid position={[0.035, 0.15, 0]} scale={[0.075, 0.07, 0.06]} color={feather} />
          <mesh position={[0.115, 0.14, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.025, 0.065, 7]} />
            <meshStandardMaterial color="#b69d5e" roughness={1} />
          </mesh>
          {[-1, 1].map((side) => (
            <Ellipsoid
              key={side}
              position={[0.065, 0.175, side * 0.052]}
              scale={[0.009, 0.009, 0.006]}
              color="#252c23"
            />
          ))}
          {[0, 1, 2].map((i) => (
            <Ellipsoid
              key={i}
              position={[0.01 + i * 0.025, 0.22, 0]}
              scale={[0.025, 0.04, 0.018]}
              color="#975348"
            />
          ))}
        </group>
      </group>
      {[-1, 0, 1].map((i) => (
        <Ellipsoid
          key={i}
          position={[-0.21, 0.35, i * 0.04]}
          scale={[0.13, 0.045, 0.035]}
          color={brown ? "#625e47" : "#969c88"}
        />
      ))}
    </group>
  );
}
export const Chicken = (props: ModelProps) => <Poultry {...props} />;
export const Hen = (props: ModelProps) => <Poultry brown {...props} />;
