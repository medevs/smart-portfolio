import { TextStreamChatTransport, type UIMessage } from "ai";

export function messageText(message: UIMessage) {
  return message.parts.filter(part => part.type === "text").map(part => part.text).join("");
}

/** Keep the existing plain-text /api/chat contract across the SDK migration. */
export function createChatTransport(fetcher?: typeof fetch) {
  return new TextStreamChatTransport({
    api: "/api/chat",
    fetch: fetcher,
    prepareSendMessagesRequest: ({ messages }) => ({
      body: { messages: messages.slice(-6).map(message => ({ role: message.role, content: messageText(message) })) },
    }),
  });
}
