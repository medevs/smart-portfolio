/** Clipboard permission prompts can remain pending. Keep a manual link usable. */
export async function copyChapterLink(write: () => Promise<void>, timeoutMs = 1800) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      write(),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("Clipboard unavailable")), timeoutMs); }),
    ]);
    return true;
  } catch { return false; }
  finally { if (timer !== undefined) clearTimeout(timer); }
}
