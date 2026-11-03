"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Quality } from "./scene-types";

export function Lights({
  night,
  sunset,
  quality,
  overcast,
}: {
  night: boolean;
  sunset: boolean;
  quality: Quality;
  overcast: number;
}) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const blend = useRef(night ? 1 : 0);
  const setBlend = useRef(sunset ? 1 : 0);
  const dayColor = useMemo(() => new THREE.Color("#fff4e4"), []);
  const setColor = useMemo(() => new THREE.Color("#ff7a3c"), []);
  const cool = useMemo(() => new THREE.Color("#9eb6ff"), []);
  const ambDay = useMemo(() => new THREE.Color("#e7eef8"), []);
  const ambNight = useMemo(() => new THREE.Color("#1c2348"), []);

  useFrame((_, dt) => {
    blend.current = THREE.MathUtils.damp(blend.current, night ? 1 : 0, 2.2, dt);
    setBlend.current = THREE.MathUtils.damp(setBlend.current, sunset ? 1 : 0, 2.2, dt);
    const k = blend.current;
    const s = setBlend.current * (1 - k);
    if (sun.current) {
      sun.current.intensity =
        THREE.MathUtils.lerp(2.7, 0.34, k) * (1 - s * 0.15) * (1 - overcast * 0.75);
      sun.current.color.copy(dayColor).lerp(setColor, s).lerp(cool, k);
      sun.current.position.set(
        THREE.MathUtils.lerp(14, 24, s) * (1 - k) + -10 * k,
        THREE.MathUtils.lerp(THREE.MathUtils.lerp(18, 5.2, s), 16, k),
        THREE.MathUtils.lerp(6, -2, k),
      );
    }
    if (amb.current) {
      amb.current.intensity = THREE.MathUtils.lerp(0.28, 0.12, k);
      amb.current.color.copy(ambDay).lerp(ambNight, k);
    }
    if (hemi.current) {
      hemi.current.intensity = THREE.MathUtils.lerp(0.42, 0.14, k);
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

export function Sky({
  night,
  sunset,
  overcast,
}: {
  night: boolean;
  sunset: boolean;
  overcast: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const blend = useRef(night ? 1 : 0);
  const setBlend = useRef(sunset ? 1 : 0);
  useFrame((_, dt) => {
    blend.current = THREE.MathUtils.damp(blend.current, night ? 1 : 0, 2.2, dt);
    setBlend.current = THREE.MathUtils.damp(setBlend.current, sunset ? 1 : 0, 2.2, dt);
    if (mat.current) {
      mat.current.uniforms.uOvercast.value = overcast;
      mat.current.uniforms.uNight.value = blend.current;
      mat.current.uniforms.uSunset.value = setBlend.current * (1 - blend.current);
    }
  });
  return (
    <mesh scale={90}>
      <sphereGeometry args={[1, 32, 20]} />
      <shaderMaterial
        ref={mat}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={{
          uOvercast: { value: overcast },
          uNight: { value: night ? 1 : 0 },
          uSunset: { value: sunset ? 1 : 0 },
        }}
        vertexShader={`
          varying vec3 vDir;
          void main() {
            vDir = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vDir;
          uniform float uOvercast;
          uniform float uNight;
          uniform float uSunset;
          void main() {
            vec3 dir = normalize(vDir);
            float h = dir.y;
            vec3 dayTop = vec3(0.27, 0.46, 0.65);
            vec3 dayHor = vec3(0.69, 0.78, 0.82);
            vec3 setTop = vec3(0.28, 0.18, 0.48);
            vec3 setHor = vec3(1.0, 0.46, 0.22);
            vec3 nightTop = vec3(0.02, 0.03, 0.1);
            vec3 nightHor = vec3(0.16, 0.12, 0.28);
            vec3 top = mix(mix(dayTop, setTop, uSunset), nightTop, uNight);
            vec3 hor = mix(mix(dayHor, setHor, uSunset), nightHor, uNight);
            vec3 col = mix(hor, top, smoothstep(0.0, 0.55, h));
            vec3 sunDir = normalize(mix(vec3(0.45, 0.72, 0.2), vec3(0.85, 0.12, 0.15), uSunset));
            float sun = pow(max(dot(dir, sunDir), 0.0), mix(420.0, 80.0, uSunset));
            col += sun * mix(vec3(1.0, 0.95, 0.85), vec3(1.0, 0.55, 0.2), uSunset) * (1.0 - uNight);
            float haze = pow(1.0 - max(h, 0.0), 3.0) * uSunset;
            col += haze * vec3(1.0, 0.55, 0.25) * 0.35;
            float stars = fract(sin(dot(floor(dir.xy * 180.0), vec2(12.9, 78.2))) * 43758.5);
            float star = step(0.992, stars) * step(0.15, h) * uNight;
            col += star * (1.0 - uOvercast);
            col = mix(col, mix(vec3(0.42, 0.49, 0.54), vec3(0.045, 0.055, 0.08), uNight), uOvercast);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export function SunShafts() {
  return (
    <group position={[16, 7, -4]} rotation={[0.55, 0.4, -0.2]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[(i - 1.5) * 1.1, -3, 0]}>
          <planeGeometry args={[0.7, 16]} />
          <meshBasicMaterial
            color="#ffc48a"
            transparent
            opacity={0.045}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
