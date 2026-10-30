"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  CameraControls,
  Environment,
  Html,
  PerformanceMonitor,
} from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, N8AO, SMAA, Vignette, wrapEffect } from "@react-three/postprocessing";
import * as THREE from "three";
import type { FarmData } from "@/farm/types";
import type { Placed } from "@/farm/loadFarm";
import { plateFor } from "@/farm/plates";
import { CELL, plotPosition } from "@/farm/world";
import { MODELS, type ModelProps } from "./models";
import { SketchEffect, sketchState } from "./SketchEffect";

const SketchPass = wrapEffect(SketchEffect);

type Quality = "low" | "high";

export type FarmCanvasProps = {
  placed: Placed[];
  farm: FarmData;
  night: boolean;
  phase: "intro" | "sketch" | "color";
  reducedMotion: boolean;
  quality: Quality;
  activeId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onReady: () => void;
  onSketchDone: () => void;
  showGrid: boolean;
  plain: boolean;
};

export default function FarmCanvas(props: FarmCanvasProps) {
  return (
    <Canvas
      shadows
      dpr={props.quality === "low" ? [1, 1.2] : [1, 1.6]}
      camera={{ position: [16, 11.5, 18], fov: 35, near: 0.1, far: 140 }}
      gl={{
        antialias: props.quality === "high",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(props.night ? "#07091c" : "#f2a878");
        props.onReady();
      }}
    >
      <AdaptiveDpr pixelated={false} />
      <Scene {...props} />
    </Canvas>
  );
}

function Scene(props: FarmCanvasProps) {
  const { placed, farm, night, quality, activeId, reducedMotion } = props;
  const controls = useRef<CameraControls>(null);
  const tier = useRef(quality === "low" ? 0 : 1);

  useEffect(() => {
    const controlsApi = controls.current;
    if (!controlsApi) return;
    controlsApi.setLookAt(18, 12.5, 20, 0.2, 1.6, -1, false);
  }, []);

  useEffect(() => {
    const controlsApi = controls.current;
    if (!controlsApi || !activeId) return;
    const entry = placed.find((item) => item.plot.id === activeId || item.item.id === activeId);
    if (!entry) return;
    const [x, , z] = plotPosition(entry.plot, farm.grid);
    controlsApi.setLookAt(x + 6.2, 4.8, z + 7.4, x, 1.7, z, !reducedMotion);
  }, [activeId, farm.grid, placed, reducedMotion]);

  const fog = night ? "#14162c" : "#f0b48a";

  return (
    <>
      <PerformanceMonitor
        onDecline={() => {
          tier.current = 0;
        }}
      />
      <color attach="background" args={[night ? "#07091c" : "#f2a878"]} />
      <fog attach="fog" args={[fog, 48, 110]} />
      <Sky night={night} />
      <Lights night={night} quality={quality} />
      <Environment resolution={128} frames={1}>
        <mesh scale={20}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={night ? "#1a2048" : "#ffb07a"} side={THREE.BackSide} />
        </mesh>
      </Environment>
      <Ground />
      <Grass placed={placed} grid={farm.grid} count={quality === "low" ? 900 : 2200} />
      <Clouds night={night} />
      <Birds />
      {placed.map((entry) => (
        <PlacedModel
          key={entry.plot.id}
          entry={entry}
          farm={farm}
          night={night}
          hot={props.hoveredId === entry.plot.id}
          onHover={props.onHover}
          onSelect={props.onSelect}
        />
      ))}
      {props.showGrid && <GridHelper grid={farm.grid} />}
      <CameraControls
        ref={controls}
        makeDefault
        minDistance={5}
        maxDistance={34}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={0.35}
        minAzimuthAngle={-Math.PI * 0.85}
        maxAzimuthAngle={Math.PI * 0.35}
        smoothTime={reducedMotion ? 0 : 0.45}
      />
      {props.plain ? null : (
        <Effects night={night} phase={props.phase} reduced={reducedMotion} quality={quality} onSketchDone={props.onSketchDone} focused={!!activeId} />
      )}
    </>
  );
}

function Lights({ night, quality }: { night: boolean; quality: Quality }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const blend = useRef(night ? 1 : 0);
  const warm = useMemo(() => new THREE.Color("#ffb06a"), []);
  const cool = useMemo(() => new THREE.Color("#9eb6ff"), []);
  const ambDay = useMemo(() => new THREE.Color("#ffe0c4"), []);
  const ambNight = useMemo(() => new THREE.Color("#1c2348"), []);

  useFrame((_, dt) => {
    blend.current = THREE.MathUtils.damp(blend.current, night ? 1 : 0, 2.2, dt);
    const k = blend.current;
    if (sun.current) {
      sun.current.intensity = THREE.MathUtils.lerp(2.55, 0.42, k);
      sun.current.color.copy(warm).lerp(cool, k);
      sun.current.position.set(THREE.MathUtils.lerp(18, -12, k), THREE.MathUtils.lerp(11, 18, k), THREE.MathUtils.lerp(8, -4, k));
    }
    if (amb.current) {
      amb.current.intensity = THREE.MathUtils.lerp(0.38, 0.16, k);
      amb.current.color.copy(ambDay).lerp(ambNight, k);
    }
    if (hemi.current) {
      hemi.current.intensity = THREE.MathUtils.lerp(0.55, 0.18, k);
    }
  });

  const map = quality === "low" ? 1024 : 2048;
  return (
    <>
      <ambientLight ref={amb} intensity={0.38} color="#ffe0c4" />
      <hemisphereLight ref={hemi} args={["#ffd2a8", "#3c7a42", 0.55]} />
      <directionalLight
        ref={sun}
        castShadow
        position={[18, 11, 8]}
        intensity={2.55}
        color="#ffb06a"
        shadow-mapSize={[map, map]}
        shadow-bias={-0.00025}
        shadow-camera-near={1}
        shadow-camera-far={48}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />
    </>
  );
}

function Sky({ night }: { night: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const blend = useRef(night ? 1 : 0);
  useFrame((_, dt) => {
    blend.current = THREE.MathUtils.damp(blend.current, night ? 1 : 0, 2.2, dt);
    if (mat.current) mat.current.uniforms.uNight.value = blend.current;
  });
  return (
    <mesh scale={90}>
      <sphereGeometry args={[1, 32, 20]} />
      <shaderMaterial
        ref={mat}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={{ uNight: { value: night ? 1 : 0 } }}
        vertexShader={`
          varying vec3 vDir;
          void main() {
            vDir = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vDir;
          uniform float uNight;
          void main() {
            vec3 dir = normalize(vDir);
            float h = dir.y;
            vec3 dayTop = vec3(0.28, 0.22, 0.62);
            vec3 dayMid = vec3(0.86, 0.42, 0.62);
            vec3 dayHor = vec3(1.0, 0.62, 0.38);
            vec3 nightTop = vec3(0.02, 0.03, 0.1);
            vec3 nightHor = vec3(0.16, 0.12, 0.28);
            vec3 top = mix(dayTop, nightTop, uNight);
            vec3 mid = mix(dayMid, vec3(0.08, 0.08, 0.2), uNight);
            vec3 hor = mix(dayHor, nightHor, uNight);
            vec3 col = mix(hor, mid, smoothstep(0.0, 0.28, h));
            col = mix(col, top, smoothstep(0.2, 0.85, h));
            vec3 sunDir = normalize(vec3(0.55, 0.28, 0.25));
            float sun = pow(max(dot(dir, sunDir), 0.0), 280.0);
            col += sun * vec3(1.0, 0.82, 0.45) * (1.0 - uNight);
            float stars = fract(sin(dot(floor(dir.xy * 180.0), vec2(12.9, 78.2))) * 43758.5);
            float star = step(0.992, stars) * step(0.15, h) * uNight;
            col += star;
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Ground() {
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(90, 90, 70, 70);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const grass = new THREE.Color("#3e9a4c");
    const yard = new THREE.Color("#c6a56a");
    const far = new THREE.Color("#2f6e3c");
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const roll = Math.sin(x * 0.12) * 0.45 + Math.cos(z * 0.09) * 0.3;
      const dist = Math.hypot(x, z);
      const flat = THREE.MathUtils.smoothstep(dist, 10, 20);
      pos.setY(i, roll * flat - 0.02);
      const yardMix = 1 - THREE.MathUtils.smoothstep(dist, 4, 11);
      const c = grass.clone().lerp(far, THREE.MathUtils.smoothstep(dist, 12, 28)).lerp(yard, yardMix * 0.55);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geom} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.95} metalness={0} />
    </mesh>
  );
}

function Grass({ placed, grid, count }: { placed: Placed[]; grid: FarmData["grid"]; count: number }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array([-0.08, 0, 0, 0.08, 0, 0, 0.02, 0.42, 0.02, -0.02, 0.42, -0.02]);
    const normals = new Float32Array([0, 0.3, 1, 0, 0.3, 1, 0, 0.4, 1, 0, 0.4, 1]);
    const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    return g;
  }, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  const material = useMemo(() => {
    const mat = new THREE.MeshLambertMaterial({ color: "#4ea85a", side: THREE.DoubleSide });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.vertexShader =
        "attribute float aPhase;\nuniform float uTime;\n" +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           float tip = uv.y;
           transformed.x += sin(uTime * 1.5 + aPhase) * tip * 0.12;
           transformed.z += cos(uTime * 1.2 + aPhase * 0.7) * tip * 0.08;`
        );
      mat.userData.shader = shader;
    };
    return mat;
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const phases = new Float32Array(count);
    let n = 0;
    let guard = 0;
    while (n < count && guard < count * 12) {
      guard++;
      const x = (Math.random() - 0.5) * 48;
      const z = (Math.random() - 0.5) * 48;
      if (Math.hypot(x, z) > 23) continue;
      let blocked = false;
      for (const entry of placed) {
        const [px, , pz] = plotPosition(entry.plot, grid);
        const r = 0.7 + (entry.plot.cols ?? 1) * 0.55;
        if ((x - px) ** 2 + (z - pz) ** 2 < r * r) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;
      dummy.position.set(x, 0, z);
      dummy.rotation.y = Math.random() * Math.PI;
      const s = 0.45 + Math.random() * 0.55;
      dummy.scale.set(s, 0.7 + Math.random() * 0.8, s);
      dummy.updateMatrix();
      mesh.setMatrixAt(n, dummy.matrix);
      phases[n] = Math.random() * Math.PI * 2;
      n++;
    }
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.geometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
  }, [count, grid, placed]);

  useFrame(({ clock }) => {
    const shader = material.userData.shader as { uniforms: { uTime: { value: number } } } | undefined;
    if (shader) shader.uniforms.uTime.value = clock.elapsedTime;
  });

  return <instancedMesh ref={ref} args={[geom, material, count]} frustumCulled={false} />;
}

function Clouds({ night }: { night: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const tex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const grd = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
    grd.addColorStop(0, "rgba(255,255,255,0.95)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.x = Math.sin(clock.elapsedTime * 0.05) * 1.5;
  });
  if (!tex) return null;
  const puffs = [
    [-6, 9, -8],
    [4, 10, -10],
    [10, 8.5, -4],
  ];
  return (
    <group ref={ref}>
      {puffs.map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          {[0, 1, 2].map((k) => (
            <sprite key={k} position={[(k - 1) * 1.4, k === 1 ? 0.4 : 0, 0]} scale={[3.2, 2.2, 1]}>
              <spriteMaterial map={tex} transparent depthWrite={false} color={night ? "#9aa4c8" : i === 1 ? "#ffd0e0" : "#fff7f2"} opacity={night ? 0.35 : 0.9} />
            </sprite>
          ))}
        </group>
      ))}
    </group>
  );
}

function Birds() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!ref.current) return;
    ref.current.position.set(Math.sin(t * 0.25) * 8, 7.5 + Math.sin(t * 0.8) * 0.4, Math.cos(t * 0.2) * 6 - 2);
    ref.current.rotation.y = t * 0.25;
  });
  return (
    <group ref={ref}>
      {[0, 1.2, -1.1].map((x, i) => (
        <mesh key={i} position={[x, i * 0.2, i * 0.4]} rotation={[0, 0, Math.sin(i) * 0.4]}>
          <boxGeometry args={[0.45, 0.03, 0.08]} />
          <meshStandardMaterial color="#2a241c" />
        </mesh>
      ))}
    </group>
  );
}

function PlacedModel({
  entry,
  farm,
  night,
  hot,
  onHover,
  onSelect,
}: {
  entry: Placed;
  farm: FarmData;
  night: boolean;
  hot: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const Model = MODELS[entry.item.sprite];
  const [x, , z] = plotPosition(entry.plot, farm.grid);
  const plate = plateFor(entry, farm);
  const golden = Boolean(plate?.golden);
  const interactive = Boolean(entry.item.interactive);
  const size: Record<string, number> = {
    chicken: 2.4,
    hen: 2.4,
    cat: 2.1,
    dog: 1.7,
    cow: 1.35,
    sheep: 1.55,
  };
  const s = size[entry.item.sprite] ?? 1;
  const labelY = entry.item.sprite === "barn" ? 6.2 : entry.item.sprite === "windmill" || entry.item.sprite === "silo" ? 5.2 : 2.4;
  const props: ModelProps = {
    night,
    golden,
    cols: entry.plot.cols,
    rows: entry.plot.rows,
  };
  return (
    <group
      position={[x, 0, z]}
      scale={[entry.plot.flip ? -s : s, s, s]}
      onClick={(event) => {
        if (!interactive) return;
        event.stopPropagation();
        onSelect(entry.plot.id);
      }}
      onPointerOver={(event) => {
        if (!interactive) return;
        event.stopPropagation();
        onHover(entry.plot.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (!interactive) return;
        onHover(null);
        document.body.style.cursor = "";
      }}
    >
      {Model ? <Model {...props} /> : null}
      {hot && interactive && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <ringGeometry args={[1.15, 1.32, 40]} />
            <meshBasicMaterial color="#ffd27a" transparent opacity={0.9} />
          </mesh>
          <Html position={[0, labelY, 0]} center distanceFactor={14} zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
            <div className="float-label">{entry.item.label}</div>
          </Html>
        </>
      )}
      {plate?.name && (
        <Html position={[0, labelY - 0.4, 0]} center distanceFactor={12} zIndexRange={[28, 0]}>
          <a
            className="float-name"
            href={plate.href || undefined}
            target={plate.href ? "_blank" : undefined}
            rel={plate.href ? "sponsored nofollow noopener noreferrer" : undefined}
          >
            {plate.name}
          </a>
        </Html>
      )}
      {plate?.message && (
        <Html position={[0.8, 1.4, 0]} center distanceFactor={12} zIndexRange={[28, 0]} style={{ pointerEvents: "none" }}>
          <div className="float-note">{plate.message}</div>
        </Html>
      )}
    </group>
  );
}

function GridHelper({ grid }: { grid: FarmData["grid"] }) {
  const lines = useMemo(() => {
    const pts: number[] = [];
    for (let c = 0; c <= grid.cols; c++) {
      const x = (c - grid.cols / 2) * CELL;
      const z0 = (0 - grid.rows / 2) * CELL;
      const z1 = (grid.rows - grid.rows / 2) * CELL;
      pts.push(x, 0.08, z0, x, 0.08, z1);
    }
    for (let r = 0; r <= grid.rows; r++) {
      const z = (r - grid.rows / 2) * CELL;
      const x0 = (0 - grid.cols / 2) * CELL;
      const x1 = (grid.cols - grid.cols / 2) * CELL;
      pts.push(x0, 0.08, z, x1, 0.08, z);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geom;
  }, [grid]);
  return (
    <lineSegments geometry={lines}>
      <lineBasicMaterial color="#6b442c" transparent opacity={0.45} />
    </lineSegments>
  );
}

function Effects({
  night,
  phase,
  reduced,
  quality,
  onSketchDone,
  focused,
}: {
  night: boolean;
  phase: FarmCanvasProps["phase"];
  reduced: boolean;
  quality: Quality;
  onSketchDone: () => void;
  focused: boolean;
}) {
  const mix = useRef(phase === "color" || reduced ? 1 : 0);
  const held = useRef(0);
  const done = useRef(phase !== "intro");

  useFrame((_, dt) => {
    if (reduced || phase === "color") mix.current = Math.min(1, mix.current + dt * 1.6);
    else if (phase === "sketch") mix.current = 0;
    else {
      held.current += dt;
      if (held.current > 1.35) mix.current = Math.min(1, mix.current + dt * 0.48);
    }
    sketchState.mix = mix.current;
    if (!done.current && mix.current >= 0.98 && phase === "intro") {
      done.current = true;
      onSketchDone();
    }
  });

  return (
    <EffectComposer multisampling={0} enableNormalPass={quality === "high"}>
      <SketchPass />
      <N8AO halfRes aoRadius={0.5} intensity={quality === "high" ? 0.9 : 0} distanceFalloff={1} />
      <Bloom
        intensity={night ? 0.9 : 0.12}
        luminanceThreshold={night ? 0.45 : 0.95}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      <DepthOfField
        focusDistance={0.02}
        focalLength={0.04}
        bokehScale={quality === "high" && focused ? 1.2 : 0}
      />
      <Vignette eskil={false} offset={0.16} darkness={night ? 0.65 : 0.4} />
      <SMAA />
    </EffectComposer>
  );
}

