export type ChatMessage = { role: "user" | "assistant"; content: string };
type Result = { messages: ChatMessage[]; error?: never } | { error: string; status: 400 | 413 };
const MAX_BYTES = 64 * 1024;

/** This endpoint accepts bounded plain text, not arbitrary SDK file/tool payloads. */
export async function readChatMessages(request: Request): Promise<Result> {
  if (!request.body) return { error: "A messages array is required.", status: 400 };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        return { error: "Chat request is too large.", status: 413 };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const body: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!body || typeof body !== "object" || !("messages" in body) || !Array.isArray(body.messages) || !body.messages.length || body.messages.length > 30) return { error: "A messages array of 1–30 entries is required.", status: 400 };
    const messages: ChatMessage[] = [];
    for (const message of body.messages) {
      if (!message || typeof message !== "object" || !["user", "assistant"].includes(message.role) || typeof message.content !== "string" || !message.content.trim() || message.content.length > 8000) return { error: "Messages must contain a user or assistant role and 1–8000 characters of text.", status: 400 };
      messages.push({ role: message.role, content: message.content.trim() });
    }
    if (messages.at(-1)?.role !== "user") return { error: "The last message must be from the user.", status: 400 };
    return { messages };
  } catch { return { error: "Invalid chat request.", status: 400 }; }
  finally { reader.releaseLock(); }
}
