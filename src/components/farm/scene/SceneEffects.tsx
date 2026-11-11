"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  BrightnessContrast,
  DepthOfField,
  EffectComposer,
  HueSaturation,
  N8AO,
  SMAA,
  Vignette,
  wrapEffect,
} from "@react-three/postprocessing";
import { SketchEffect, sketchState } from "./SketchEffect";
import type { Phase, Quality } from "./scene-types";
const SketchPass = wrapEffect(SketchEffect);

export function Effects({
  night,
  phase,
  reduced,
  quality,
  onSketchDone,
  focused,
}: {
  night: boolean;
  phase: Phase;
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

  const passes = [
    <HueSaturation key="sat" saturation={-0.05} />,
    <BrightnessContrast key="grade" brightness={0.01} contrast={0.025} />,
    <Bloom
      key="bloom"
      intensity={night ? 0.35 : 0.035}
      luminanceThreshold={night ? 0.45 : 0.96}
      luminanceSmoothing={0.3}
      mipmapBlur
    />,
    <Vignette key="vignette" eskil={false} offset={0.16} darkness={night ? 0.65 : 0.35} />,
  ];
  if (phase !== "color" && !reduced) passes.unshift(<SketchPass key="sketch" />);
  if (quality === "high") {
    passes.splice(
      4,
      0,
      <N8AO key="ao" halfRes aoRadius={0.5} intensity={0.85} distanceFalloff={1} />,
    );
    if (focused) {
      passes.push(
        <DepthOfField key="dof" focusDistance={0.02} focalLength={0.04} bokehScale={1.2} />,
      );
    }
    passes.push(<SMAA key="smaa" />);
  }

  return (
    <EffectComposer multisampling={0} enableNormalPass={quality === "high"}>
      {passes}
    </EffectComposer>
  );
}
