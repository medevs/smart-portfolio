"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, CuboidCollider, Physics, RigidBody, useRapier } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { resetWalkInput, TRACTOR, walk, walkingMovement } from "./walk-state";

const BLOCKS: { position: [number, number, number]; args: [number, number, number] }[] = [
  { position: [1.1, 1.6, -2.2], args: [3.1, 1.6, 2.1] },
  { position: [-11, 1.4, -2.2], args: [2.5, 1.4, 1.9] },
  { position: [8.8, 2.1, -3.2], args: [1.2, 2.1, 1.2] },
  { position: [14.3, 1.1, -2.2], args: [1.6, 1.1, 1.3] },
  { position: [19.5, 2.2, -5.5], args: [1.3, 2.2, 1.3] },
  { position: [0, 1.8, -18], args: [5.2, 1.8, 2.4] },
  { position: [17, 1.24, -16.52], args: [2.16, 1.24, 1.04] },
  { position: [24, 1.24, -16.52], args: [2.16, 1.24, 1.04] },
  { position: [-3, .5, 19], args: [3, .5, .65] },
];

const keys = { w: false, a: false, s: false, d: false };
function resetInput() {
  keys.w = keys.a = keys.s = keys.d = false;
  resetWalkInput();
}

function isEditing(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='dialog']"));
}

export function PhysicsYard() {
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (walk.paused || isEditing(event.target) || event.ctrlKey || event.metaKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === "w" || key === "a" || key === "s" || key === "d") keys[key] = true;
      if (key === "f" && !event.repeat) walk.toggleDrive = true;
    };
    const up = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "w" || key === "a" || key === "s" || key === "d") keys[key] = false;
    };
    const onVisibility = () => {
      if (document.hidden) resetInput();
    };
    window.addEventListener("blur", resetInput);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("blur", resetInput);
      document.removeEventListener("visibilitychange", onVisibility);
      resetInput();
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      walk.driving = false;
    };
  }, []);

  return (
    <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60}>
      <RigidBody type="fixed" colliders={false} position={[0, -0.3, 0]}>
        <CuboidCollider args={[70, 0.3, 70]} />
      </RigidBody>
      {BLOCKS.map((block) => (
        <RigidBody key={block.position.join(",")} type="fixed" colliders={false} position={block.position}>
          <CuboidCollider args={block.args} />
        </RigidBody>
      ))}
      <Player />
      <Tractor />
      <FollowCam />
    </Physics>
  );
}

function input() {
  if (walk.paused) {
    resetInput();
    return { forward: 0, strafe: 0 };
  }
  const forward = (keys.w || walk.stickY < -0.25 ? 1 : 0) - (keys.s || walk.stickY > 0.25 ? 1 : 0);
  const strafe = (keys.d || walk.stickX > 0.25 ? 1 : 0) - (keys.a || walk.stickX < -0.25 ? 1 : 0);
  return { forward, strafe };
}

function Player() {
  const body = useRef<RapierRigidBody>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const { world } = useRapier();
  const controller = useRef<ReturnType<typeof world.createCharacterController> | null>(null);
  const velocityY = useRef(0);

  useEffect(() => {
    const next = world.createCharacterController(0.04);
    next.enableAutostep(0.35, 0.15, true);
    next.enableSnapToGround(0.35);
    next.setSlideEnabled(true);
    controller.current = next;
    return () => {
      world.removeCharacterController(next);
      controller.current = null;
    };
  }, [world]);

  useFrame((_, dt) => {
    const rigid = body.current;
    const character = controller.current;
    if (!rigid || !character) return;
    let here = rigid.translation();
    const tractorX = TRACTOR.x + walk.tx;
    const tractorZ = TRACTOR.z + walk.tz;
    if (walk.toggleDrive && !walk.paused) {
      walk.toggleDrive = false;
      const near = Math.hypot(here.x - tractorX, here.z - tractorZ) < 2.4;
      if (walk.driving || near) {
        walk.driving = !walk.driving;
        if (!walk.driving) {
          here = { x: tractorX + 1.4, y: 1.2, z: tractorZ };
          rigid.setTranslation(here, true);
          velocityY.current = 0;
        }
      }
    }
    rigid.setEnabled(!walk.driving);
    if (mesh.current) mesh.current.visible = !walk.driving;
    if (walk.driving) return;

    const { forward, strafe } = input();
    dt = Math.min(dt, 0.05);
    const { x: dx, z: dz } = walkingMovement(forward, strafe, dt);
    velocityY.current = Math.max(velocityY.current - 9.81 * dt, -20);
    const collider = rigid.collider(0);
    character.computeColliderMovement(collider, { x: dx, y: velocityY.current * dt, z: dz });
    const move = character.computedMovement();
    if (character.computedGrounded() && velocityY.current < 0) velocityY.current = 0;
    const next = {
      x: here.x + move.x,
      y: here.y + move.y,
      z: here.z + move.z,
    };
    rigid.setNextKinematicTranslation(next);
    walk.px = next.x;
    walk.pz = next.z;
    if (Math.hypot(dx, dz) > 0.001) walk.yaw = Math.atan2(dx, dz);
  });

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[walk.px, 1.2, walk.pz]} lockRotations>
      <CapsuleCollider args={[0.38, 0.28]} />
      <mesh ref={mesh} castShadow>
        <capsuleGeometry args={[0.28, 0.76, 4, 8]} />
        <meshStandardMaterial color="#3c4a5c" roughness={0.7} />
      </mesh>
    </RigidBody>
  );
}

function Tractor() {
  const body = useRef<RapierRigidBody>(null);
  useFrame((_, dt) => {
    const rigid = body.current;
    if (!rigid) return;
    const rotation = rigid.rotation();
    const yaw = Math.atan2(2 * (rotation.w * rotation.y + rotation.x * rotation.z), 1 - 2 * (rotation.y * rotation.y + rotation.z * rotation.z));
    if (walk.driving) {
      const { forward, strafe } = input();
      const speed = forward * 7;
      rigid.setLinvel({ x: Math.sin(yaw) * speed, y: rigid.linvel().y, z: Math.cos(yaw) * speed }, true);
      rigid.setAngvel({ x: 0, y: strafe * -1.3, z: 0 }, true);
    } else {
      const velocity = rigid.linvel();
      rigid.setLinvel({ x: velocity.x * 0.9, y: velocity.y, z: velocity.z * 0.9 }, true);
      rigid.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
    const position = rigid.translation();
    walk.tx = position.x - TRACTOR.x;
    walk.tz = position.z - TRACTOR.z;
    walk.yaw = walk.driving ? yaw : walk.yaw;
    void dt;
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={[TRACTOR.x + walk.tx, 0.45, TRACTOR.z + walk.tz]}
      enabledRotations={[false, true, false]}
      linearDamping={0.6}
      angularDamping={1.2}
    >
      <CuboidCollider args={[0.85, 0.4, 0.5]} />
    </RigidBody>
  );
}

function FollowCam() {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    const x = walk.driving ? TRACTOR.x + walk.tx : walk.px;
    const z = walk.driving ? TRACTOR.z + walk.tz : walk.pz;
    // Keep the walking camera stable while strafing or backing up.
    const yaw = walk.driving ? walk.yaw : Math.PI;
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    look.current.set(x - sin * 6.2, walk.driving ? 3.8 : 3.2, z - cos * 6.2);
    const blend = 1 - Math.pow(0.0015, dt);
    camera.position.lerp(look.current, blend);
    camera.lookAt(x, 1.1, z);
  });
  return null;
}
