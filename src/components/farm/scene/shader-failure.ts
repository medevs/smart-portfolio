/** Three's generated shader prefix carries the material name. Only the known
 * postprocessing EffectMaterial is safe to recover by dropping the composer.
 * Unknown/core failures need full scene recovery, never a false ready frame.
 */
export function routeShaderFailure(source: string | null, handlers: { effects: () => void; scene: () => void }) {
  if (source && /^\s*#define\s+SHADER_NAME\s+EffectMaterial\s*$/m.test(source)) handlers.effects();
  else handlers.scene();
}
