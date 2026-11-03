"use client";

import { useEffect, useRef, useState } from "react";
import {
  CapsuleCollider,
  CuboidCollider,
  CoefficientCombineRule,
  useSphericalJoint,
  Physics,
  RigidBody,
  useRapier,
  useBeforePhysicsStep,
  useAfterPhysicsStep,
} from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import { ORCHARD_TREES } from "@/farm/game/world";
import { Visitor } from "./Visitor";
import { GROUND_HALF, YARD_WALLS, YARD_BUILDINGS, safeSpawn } from "@/farm/game/collision";
import {
  resetWalkInput,
  TRACTOR,
  walk,
  walkingMovement,
  movementInput,
  isMovementKey,
  cancelWalkRoute,
  routeMovement,
} from "./walk-state";
import { cameraView } from "./camera-view";
import { findWalkingRoute } from "./walking-route";
import { tractorDrive } from "./tractor-drive";

const keys = walk.keys;
const FIXED_STEP = 1 / 60;
const VISITOR_HEIGHT = 0.7;

function isEditing(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(
      target.closest(
        "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='dialog']",
      ),
    )
  );
}

export function PhysicsYard({ paused = false }: { paused?: boolean }) {
  useEffect(() => {
    if (paused) resetWalkInput();
  }, [paused]);
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (walk.paused || isEditing(event.target) || event.ctrlKey || event.metaKey || event.altKey)
        return;
      const key = event.key.toLowerCase();
      if (isMovementKey(key)) {
        cancelWalkRoute();
        keys[key] = true;
        if (key.startsWith("arrow")) event.preventDefault();
      }
      if (key === "shift") walk.sprinting = true;
      if (key === "f" && !event.repeat) {
        cancelWalkRoute();
        walk.toggleDrive = true;
      }
    };
    const up = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "shift") walk.sprinting = false;
      if (isMovementKey(key)) keys[key] = false;
    };
    const onVisibility = () => {
      if (document.hidden) resetWalkInput();
    };
    const onBlur = () => resetWalkInput();
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelWalkRoute();
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
        <RigidBody
          key={block.position.join(",")}
          type="fixed"
          colliders={false}
          position={block.position}
        >
          <CuboidCollider args={block.args} />
        </RigidBody>
      ))}
      {ORCHARD_TREES.map((tree) => (
        <RigidBody
          key={`tree-${tree.x}-${tree.z}`}
          type="fixed"
          colliders={false}
          position={[tree.x, 0.9, tree.z]}
        >
          <CapsuleCollider args={[0.7, 0.12]} />
        </RigidBody>
      ))}
      <RigidBody type="fixed" colliders={false} position={[-12.5, 0.35, 3.4]}>
        <CuboidCollider args={[0.78, 0.35, 0.78]} />
      </RigidBody>
      <Player />
      <Tractor />
    </Physics>
  );
}

const input = movementInput;

function Player() {
  const [spawn] = useState<[number, number, number]>(() => [walk.px, VISITOR_HEIGHT, walk.pz]);
  const body = useRef<RapierRigidBody>(null);
  const { world } = useRapier();
  const controller = useRef<ReturnType<typeof world.createCharacterController> | null>(null);
  const velocityY = useRef(0);
  const blockedSeconds = useRef(0);

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
    if (walk.paused) {
      resetWalkInput();
      velocityY.current = 0;
      return;
    }
    let here = rigid.translation();
    if (walk.travel && !walk.paused) {
      cancelWalkRoute();
      const target = walk.travel;
      walk.travel = null;
      if (safeSpawn(target)) {
        walk.driving = false;
        walk.cameraCut = true;
        rigid.setEnabled(true);
        here = { x: target.x, y: VISITOR_HEIGHT, z: target.z };
        rigid.setTranslation(here, true);
        rigid.setNextKinematicTranslation(here);
        walk.px = here.x;
        walk.pz = here.z;
        velocityY.current = 0;
        resetWalkInput();
      }
    }
    const tractorX = TRACTOR.x + walk.tx;
    const tractorZ = TRACTOR.z + walk.tz;
    if (walk.toggleDrive && !walk.paused) {
      cancelWalkRoute();
      walk.toggleDrive = false;
      const near = Math.hypot(here.x - tractorX, here.z - tractorZ) < 2.4;
      if (walk.driving || near) {
        walk.driving = !walk.driving;
        if (!walk.driving) {
          const sides = [1, -1].map((side) => ({
            x: tractorX + Math.cos(walk.vehicleYaw) * 1.7 * side,
            z: tractorZ - Math.sin(walk.vehicleYaw) * 1.7 * side,
          }));
          const exit = sides.find(safeSpawn);
          if (!exit) {
            walk.driving = true;
            return;
          }
          here = { ...exit, y: VISITOR_HEIGHT };
          rigid.setTranslation(here, true);
          velocityY.current = 0;
        }
      }
    }
    rigid.setEnabled(!walk.driving);
    if (walk.driving) return;

    if (walk.routeRequest) {
      const request = walk.routeRequest;
      walk.routeRequest = null;
      walk.routeLabel = request.label;
      walk.route =
        findWalkingRoute(here, request, [
          { x: tractorX, z: tractorZ, radius: 1.35 },
          { x: walk.trailerX, z: walk.trailerZ, radius: 1.35 },
        ]) ?? [];
      walk.routeIndex = 0;
      walk.routeStatus = walk.route.length ? "walking" : "blocked";
      blockedSeconds.current = 0;
    }
    const { forward, strafe } = input();
    if (forward || strafe) cancelWalkRoute();
    const { x: dx, z: dz } =
      walk.routeStatus === "walking"
        ? routeMovement(here, dt)
        : walkingMovement(forward, strafe, dt, walk.sprinting, cameraView.turn);

    velocityY.current = Math.max(velocityY.current - 9.81 * dt, -20);
    const collider = rigid.collider(0);
    character.computeColliderMovement(collider, { x: dx, y: velocityY.current * dt, z: dz });
    const move = character.computedMovement();
    if (walk.routeStatus === "walking") {
      blockedSeconds.current =
        Math.hypot(move.x, move.z) < Math.hypot(dx, dz) * 0.15 ? blockedSeconds.current + dt : 0;
      if (blockedSeconds.current > 1.2) {
        walk.route = [];
        walk.routeIndex = 0;
        walk.routeStatus = "blocked";
      }
    }
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
    if (body.current && !walk.driving) {
      const point = body.current.translation();
      walk.px = point.x;
      walk.pz = point.z;
    }
  });
  return (
    <RigidBody
      name="farm-visitor-body"
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={spawn}
      lockRotations
    >
      <CapsuleCollider args={[0.38, 0.28]} />
      <Visitor />
    </RigidBody>
  );
}

function Tractor() {
  const [spawn] = useState<[number, number, number]>(() => [
    TRACTOR.x + walk.tx,
    0.45,
    TRACTOR.z + walk.tz,
  ]);
  const [rotation] = useState<[number, number, number]>(() => [0, walk.vehicleYaw, 0]);
  const body = useRef<RapierRigidBody>(null!);
  const trailer = useRef<RapierRigidBody>(null!);
  const [trailerSpawn] = useState<[number, number, number]>(() =>
    walk.trailerInitialized
      ? [walk.trailerX, walk.trailerY, walk.trailerZ]
      : [spawn[0] - Math.sin(rotation[1]) * 2.25, 0.22, spawn[2] - Math.cos(rotation[1]) * 2.25],
  );
  const [trailerRotation] = useState<[number, number, number]>(() => [
    0,
    walk.trailerInitialized ? walk.trailerYaw : rotation[1],
    0,
  ]);
  // Flat-yard vehicles share a fixed wheel height. A ball hitch supplies only
  // the anchor constraint; body rotation locks already constrain pitch/roll.
  const joint = useSphericalJoint(body, trailer, [
    [0, -0.23, -1],
    [0, 0, 1.25],
  ]);
  useEffect(() => {
    joint.current?.setContactsEnabled(true);
  }, [joint]);
  useBeforePhysicsStep(() => {
    const rigid = body.current;
    if (!rigid) return;
    const rotation = rigid.rotation();
    const yaw = Math.atan2(
      2 * (rotation.w * rotation.y + rotation.x * rotation.z),
      1 - 2 * (rotation.y * rotation.y + rotation.z * rotation.z),
    );
    const velocity = rigid.linvel();
    const { forward, strafe } = walk.driving ? input() : { forward: 0, strafe: 0 };
    // Read resolved physics velocity so a collision cannot accumulate hidden speed.
    const actualSpeed = velocity.x * Math.sin(yaw) + velocity.z * Math.cos(yaw);
    const drive = tractorDrive(actualSpeed, forward, strafe, FIXED_STEP);
    rigid.setLinvel(
      { x: Math.sin(yaw) * drive.speed, y: velocity.y, z: Math.cos(yaw) * drive.speed },
      true,
    );
    rigid.setAngvel({ x: 0, y: drive.yawRate, z: 0 }, true);
    if (trailer.current && forward === 0) {
      // Releasing the drive applies the trailer brake too; the hitch must not
      // keep pushing a stopped tractor or let an unoccupied rig drift.
      const velocity = trailer.current.linvel(),
        speed = Math.hypot(velocity.x, velocity.z);
      const brake = speed > 0 ? Math.max(0, speed - 12 * FIXED_STEP) / speed : 0;
      trailer.current.setLinvel(
        { x: velocity.x * brake, y: velocity.y, z: velocity.z * brake },
        true,
      );
      trailer.current.setAngvel({ x: 0, y: trailer.current.angvel().y * 0.7, z: 0 }, true);
    }
  });
  useAfterPhysicsStep(() => {
    const rigid = body.current;
    if (!rigid) return;
    const position = rigid.translation(),
      rotation = rigid.rotation();
    walk.tx = position.x - TRACTOR.x;
    walk.tz = position.z - TRACTOR.z;
    const velocity = rigid.linvel();
    walk.vehicleSpeed = Math.hypot(velocity.x, velocity.z);
    if (trailer.current) {
      const point = trailer.current.translation(),
        q = trailer.current.rotation(),
        v = trailer.current.linvel();
      walk.trailerInitialized = true;
      walk.trailerSpeed = Math.hypot(v.x, v.z);
      walk.trailerX = point.x;
      walk.trailerY = point.y;
      walk.trailerZ = point.z;
      walk.trailerYaw = Math.atan2(2 * (q.w * q.y + q.x * q.z), 1 - 2 * (q.y * q.y + q.z * q.z));
    }
    walk.vehicleYaw = Math.atan2(
      2 * (rotation.w * rotation.y + rotation.x * rotation.z),
      1 - 2 * (rotation.y * rotation.y + rotation.z * rotation.z),
    );
  });

  return (
    <>
      <RigidBody
        name="farm-tractor-body"
        ref={body}
        colliders={false}
        position={spawn}
        rotation={rotation}
        enabledRotations={[false, true, false]}
        enabledTranslations={[true, false, true]}
        gravityScale={0}
        additionalSolverIterations={4}
        linearDamping={0.6}
        angularDamping={1.2}
      >
        {/* Tyre grip/braking is resolved above; the hull must not drag like a crate. */}
        <CuboidCollider
          args={[0.5, 0.4, 0.85]}
          friction={0}
          frictionCombineRule={CoefficientCombineRule.Min}
        />
      </RigidBody>
      <RigidBody
        name="farm-trailer-body"
        ref={trailer}
        colliders={false}
        position={trailerSpawn}
        rotation={trailerRotation}
        enabledRotations={[false, true, false]}
        enabledTranslations={[true, false, true]}
        gravityScale={0}
        additionalSolverIterations={4}
        linearDamping={0.6}
        angularDamping={2}
      >
        <CuboidCollider
          args={[0.56, 0.2, 0.78]}
          position={[0, 0.4, 0]}
          friction={0}
          frictionCombineRule={CoefficientCombineRule.Min}
          density={0.15}
        />
        {[-1, 1].map((side) => (
          <CuboidCollider
            key={side}
            args={[0.075, 0.22, 0.24]}
            position={[side * 0.62, 0, -0.2]}
            friction={0}
            frictionCombineRule={CoefficientCombineRule.Min}
            density={0.15}
          />
        ))}
      </RigidBody>
    </>
  );
}
