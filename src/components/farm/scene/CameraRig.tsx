"use client";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import { TRACTOR, walk } from "./walk-state";

/** Disabled orbit input still runs CameraControls.update. Mount exactly one camera owner. */
export function CameraRig({ walking, paused, reducedMotion, focus }: {
  walking: boolean; paused: boolean; reducedMotion: boolean; focus: [number, number] | null;
}) {
  return walking ? <FollowCamera paused={paused} /> : <OrbitCamera paused={paused} reducedMotion={reducedMotion} focus={focus} />;
}
function OrbitCamera({ paused, reducedMotion, focus }: { paused: boolean; reducedMotion: boolean; focus: [number, number] | null }) {
  const controls = useRef<CameraControls>(null);
  const x = focus?.[0], z = focus?.[1];
  useEffect(() => { controls.current?.setLookAt(34, 25, 39, 0, 1.2, 0, false); }, []);
  useEffect(() => {
    if (x !== undefined && z !== undefined) controls.current?.setLookAt(x + 6.2, 4.8, z + 7.4, x, 1.7, z, !reducedMotion);
  }, [x, z, reducedMotion]);
  return <CameraControls ref={controls} makeDefault minDistance={5} maxDistance={85}
    maxPolarAngle={Math.PI / 2.05} minPolarAngle={.35} smoothTime={reducedMotion ? 0 : .45} enabled={!paused} />;
}
export function FollowCamera({ paused }: { paused: boolean }) {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3());
  const entered = useRef(false);
  useFrame((_, delta) => {
    if (paused) return;
    const x = walk.driving ? TRACTOR.x + walk.tx : walk.px;
    const z = walk.driving ? TRACTOR.z + walk.tz : walk.pz;
    const yaw = walk.driving ? walk.vehicleYaw : Math.PI;
    desired.current.set(x - Math.sin(yaw) * 6.2, walk.driving ? 3.8 : 3.2, z - Math.cos(yaw) * 6.2);
    if (!entered.current || walk.cameraCut) {
      camera.position.copy(desired.current);
      entered.current = true;
      walk.cameraCut = false;
    } else camera.position.lerp(desired.current, 1 - Math.exp(-6.5 * Math.min(delta, .05)));
    camera.lookAt(x, 1.1, z);
  });
  return null;
}
