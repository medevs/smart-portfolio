/** Stop the GPU loop offscreen; resuming resets Fiber's frame clock via setFrameloop. */
export function bindRenderVisibility(document: Pick<Document, "hidden" | "addEventListener" | "removeEventListener">, setFrameloop: (mode: "never" | "always") => void, clearInput: () => void) {
  const update = () => {
    clearInput();
    setFrameloop(document.hidden ? "never" : "always");
  };
  document.addEventListener("visibilitychange", update);
  update();
  return () => document.removeEventListener("visibilitychange", update);
}
