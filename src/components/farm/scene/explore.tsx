"use client";

import { useEffect, useRef, useState } from "react";
import { CapsuleCollider, CuboidCollider, Physics, RigidBody, useRapier, useBeforePhysicsStep, useAfterPhysicsStep } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import { ORCHARD_TREES } from "@/farm/game/world";
import { Visitor } from "./Visitor";
import { GROUND_HALF, YARD_WALLS, YARD_BUILDINGS, safeSpawn } from "./yard-boundaries";
import { resetWalkInput, TRACTOR, walk, walkingMovement } from "./walk-state";



const keys = walk.keys;
const FIXED_STEP = 1 / 60;
const VISITOR_HEIGHT = .70;

function isEditing(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='dialog']"));
}

export function PhysicsYard({ paused = false }: { paused?: boolean }) {
  useEffect(() => { if (paused) resetWalkInput(); }, [paused]);
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
      if (document.hidden) resetWalkInput();
    };
    window.addEventListener("blur", resetWalkInput);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("blur", resetWalkInput);
      document.removeEventListener("visibilitychange", onVisibility);
      resetWalkInput();
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      walk.driving = false;
    };
  }, []);

  return (
    <Physics paused={paused} gravity={[0, -9.81, 0]} timeStep={FIXED_STEP} updatePriority={-2}>
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
    </Physics>
  );
}

function input() {
  if (walk.paused) {
    resetWalkInput();
    return { forward: 0, strafe: 0 };
  }
  const forward = (keys.w || walk.stickY < -0.25 ? 1 : 0) - (keys.s || walk.stickY > 0.25 ? 1 : 0);
  const strafe = (keys.d || walk.stickX > 0.25 ? 1 : 0) - (keys.a || walk.stickX < -0.25 ? 1 : 0);
  return { forward, strafe };
}

function Player() {
  const [spawn] = useState<[number, number, number]>(() => [walk.px, VISITOR_HEIGHT, walk.pz]);
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

  useBeforePhysicsStep(() => {
    const dt = FIXED_STEP;
    const rigid = body.current;
    const character = controller.current;
    if (!rigid || !character) return;
    if (walk.paused) { resetWalkInput(); velocityY.current = 0; return; }
    let here = rigid.translation();
    if (walk.travel && !walk.paused) {
      const target = walk.travel;
      walk.travel = null;
      if (safeSpawn(target)) {
        walk.driving = false;
        walk.cameraCut = true;
        rigid.setEnabled(true);
        here = { x: target.x, y: VISITOR_HEIGHT, z: target.z };
        rigid.setTranslation(here, true);
        rigid.setNextKinematicTranslation(here);
        walk.px = here.x; walk.pz = here.z;
        velocityY.current = 0;
        resetWalkInput();
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
          here = { ...exit, y: VISITOR_HEIGHT };
          rigid.setTranslation(here, true);
          velocityY.current = 0;
        }
      }
    }
    rigid.setEnabled(!walk.driving);
    if (walk.driving) return;

    const { forward, strafe } = input();
    const { x: dx, z: dz } = walkingMovement(forward, strafe, dt, walk.sprinting);

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
    walk.moving = Math.hypot(move.x, move.z) / dt;
    if (Math.hypot(dx, dz) > 0.001) walk.yaw = Math.atan2(dx, dz);
  });

  useAfterPhysicsStep(() => {
    if (body.current && !walk.driving) { const point = body.current.translation(); walk.px = point.x; walk.pz = point.z; }
  });
  return (
    <RigidBody name="farm-visitor-body" ref={body} type="kinematicPosition" colliders={false} position={spawn} lockRotations>
      <CapsuleCollider args={[0.38, 0.28]} />
      <Visitor />
    </RigidBody>
  );
}

function Tractor() {
  const [spawn] = useState<[number, number, number]>(() => [TRACTOR.x + walk.tx, .45, TRACTOR.z + walk.tz]);
  const [rotation] = useState<[number, number, number]>(() => [0, walk.vehicleYaw, 0]);
  const body = useRef<RapierRigidBody>(null);
  useBeforePhysicsStep(() => {
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
  });
  useAfterPhysicsStep(() => {
    const rigid = body.current;
    if (!rigid) return;
    const position = rigid.translation(), rotation = rigid.rotation();
    walk.tx = position.x - TRACTOR.x; walk.tz = position.z - TRACTOR.z;
    walk.vehicleYaw = Math.atan2(2 * (rotation.w * rotation.y + rotation.x * rotation.z), 1 - 2 * (rotation.y * rotation.y + rotation.z * rotation.z));
  });

  return (
    <RigidBody
      name="farm-tractor-body"
      ref={body}
      colliders={false}
      position={spawn}
      rotation={rotation}
      enabledRotations={[false, true, false]}
      linearDamping={0.6}
      angularDamping={1.2}
    >
      <CuboidCollider args={[0.5, 0.4, 0.85]} />
    </RigidBody>
  );
}
