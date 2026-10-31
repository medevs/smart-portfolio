"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, CuboidCollider, Physics, RigidBody, useRapier } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { ORCHARD_TREES } from "@/farm/game/world";
import { Visitor } from "./Visitor";
import { GROUND_HALF, YARD_WALLS, YARD_BUILDINGS, safeSpawn } from "./yard-boundaries";
import { resetWalkInput, TRACTOR, walk, walkingMovement } from "./walk-state";



const keys = { w: false, a: false, s: false, d: false };
function resetInput() {
  keys.w = keys.a = keys.s = keys.d = false;
  resetWalkInput();
}

function isEditing(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='dialog']"));
}

export function PhysicsYard({ paused = false }: { paused?: boolean }) {
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (walk.paused || isEditing(event.target) || event.ctrlKey || event.metaKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === "w" || key === "a" || key === "s" || key === "d") keys[key] = true;
      if (key === "shift") walk.sprinting = true;
      if (key === "f" && !event.repeat) walk.toggleDrive = true;
    };
    const up = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "shift") walk.sprinting = false;
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
    <Physics paused={paused} gravity={[0, -9.81, 0]} timeStep={1 / 60}>
      <RigidBody type="fixed" colliders={false} position={[0, -0.3, 0]}>
        <CuboidCollider args={[GROUND_HALF, 0.3, GROUND_HALF]} />
      </RigidBody>
      {[...YARD_BUILDINGS, ...YARD_WALLS].map((block) => (
        <RigidBody key={block.position.join(",")} type="fixed" colliders={false} position={block.position}>
          <CuboidCollider args={block.args} />
        </RigidBody>
      ))}
      {ORCHARD_TREES.map(tree => <RigidBody key={`tree-${tree.x}-${tree.z}`} type="fixed" colliders={false} position={[tree.x, .9, tree.z]}><CapsuleCollider args={[.7, .12]} /></RigidBody>)}
      <RigidBody type="fixed" colliders={false} position={[-12.5, .35, 3.4]}><CuboidCollider args={[.78, .35, .78]} /></RigidBody>
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
    if (walk.paused) { resetInput(); velocityY.current = 0; return; }
    let here = rigid.translation();
    if (walk.travel && !walk.paused) {
      const target = walk.travel;
      walk.travel = null;
      if (safeSpawn(target)) {
        walk.driving = false;
        rigid.setEnabled(true);
        here = { x: target.x, y: 1.2, z: target.z };
        rigid.setTranslation(here, true);
        rigid.setNextKinematicTranslation(here);
        walk.px = here.x; walk.pz = here.z;
        velocityY.current = 0;
        resetInput();
      }
    }
    const tractorX = TRACTOR.x + walk.tx;
    const tractorZ = TRACTOR.z + walk.tz;
    if (walk.toggleDrive && !walk.paused) {
      walk.toggleDrive = false;
      const near = Math.hypot(here.x - tractorX, here.z - tractorZ) < 2.4;
      if (walk.driving || near) {
        walk.driving = !walk.driving;
        if (!walk.driving) {
          const sides = [1, -1].map(side => ({ x: tractorX + Math.cos(walk.vehicleYaw) * 1.7 * side, z: tractorZ - Math.sin(walk.vehicleYaw) * 1.7 * side }));
          const exit = sides.find(safeSpawn);
          if (!exit) { walk.driving = true; return; }
          here = { ...exit, y: 1.2 };
          rigid.setTranslation(here, true);
          velocityY.current = 0;
        }
      }
    }
    rigid.setEnabled(!walk.driving);
    if (walk.driving) return;

    const { forward, strafe } = input();
    dt = Math.min(dt, 0.05);
    const { x: dx, z: dz } = walkingMovement(forward, strafe, dt, walk.sprinting);
    walk.moving = dt > 0 ? Math.hypot(dx, dz) / dt : 0;
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
      <Visitor />
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
    walk.vehicleYaw = yaw;
    void dt;
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={[TRACTOR.x + walk.tx, 0.45, TRACTOR.z + walk.tz]}
      rotation={[0, walk.vehicleYaw, 0]}
      enabledRotations={[false, true, false]}
      linearDamping={0.6}
      angularDamping={1.2}
    >
      <CuboidCollider args={[0.5, 0.4, 0.85]} />
    </RigidBody>
  );
}

function FollowCam() {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    if (walk.paused) return;
    const x = walk.driving ? TRACTOR.x + walk.tx : walk.px;
    const z = walk.driving ? TRACTOR.z + walk.tz : walk.pz;
    // Keep the walking camera stable while strafing or backing up.
    const yaw = walk.driving ? walk.vehicleYaw : Math.PI;
    const sin = Math.sin(yaw);
    const cos = Math.cos(yaw);
    look.current.set(x - sin * 6.2, walk.driving ? 3.8 : 3.2, z - cos * 6.2);
    const blend = 1 - Math.pow(0.0015, dt);
    camera.position.lerp(look.current, blend);
    camera.lookAt(x, 1.1, z);
  });
  return null;
}
