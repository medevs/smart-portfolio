/** Unsupported graphics is an expected recovery path, not a renderer exception. */
export function farmContext(canvas: HTMLCanvasElement, low: boolean) {
  try { return canvas.getContext("webgl2", { antialias: !low, powerPreference: "default", preserveDrawingBuffer: false }); }
  catch { return null; }
}
