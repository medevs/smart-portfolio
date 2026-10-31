import { Effect } from "postprocessing";
import { Uniform } from "three";

/** Written every frame by the farm scene. 0 = pencil, 1 = full color. */
export const sketchState = { mix: 0 };

export const sketchFragment = /* glsl */ `
uniform float uMix;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 paper = vec3(0.953, 0.933, 0.894);
  vec3 ink = vec3(0.15, 0.13, 0.11);
  float l = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
  vec2 texel = 1.0 / resolution;
  float edge = 0.0;
  edge += abs(l - dot(texture2D(inputBuffer, uv + vec2(-texel.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114)));
  edge += abs(l - dot(texture2D(inputBuffer, uv + vec2(texel.x, 0.0)).rgb, vec3(0.299, 0.587, 0.114)));
  edge += abs(l - dot(texture2D(inputBuffer, uv + vec2(0.0, texel.y)).rgb, vec3(0.299, 0.587, 0.114)));
  edge += abs(l - dot(texture2D(inputBuffer, uv + vec2(0.0, -texel.y)).rgb, vec3(0.299, 0.587, 0.114)));
  edge = clamp(edge * 3.4, 0.0, 1.0);
  float shade = 1.0 - smoothstep(0.22, 0.78, l);
  float hatch = step(0.4, shade) * step(0.55, fract((uv.x + uv.y) * 220.0));
  float inkAmt = clamp(edge * 0.95 + shade * 0.28 + hatch * 0.22, 0.0, 1.0);
  vec3 sketch = mix(paper, ink, inkAmt);
  float diag = uv.x * 0.72 + uv.y * 0.28;
  float revealEdge = uMix * 1.2;
  float reveal = 1.0 - smoothstep(revealEdge - 0.14, revealEdge, diag);
  outputColor = vec4(mix(sketch, inputColor.rgb, reveal), inputColor.a);
}
`;

export class SketchEffect extends Effect {
  constructor() {
    super("SketchEffect", sketchFragment, {
      uniforms: new Map([["uMix", new Uniform(0)]]),
    });
  }

  override update() {
    const uniform = this.uniforms.get("uMix");
    if (uniform) uniform.value = sketchState.mix;
  }
}
