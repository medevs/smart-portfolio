"use client";

import { cn } from "@/lib/utils";
import { Message, useChat } from "ai/react";
import { Bot, X, Terminal } from "lucide-react";
import { useEffect, useRef } from "react";
import AgentMessage from "./AgentMessage";
import AgentInput from "./AgentInput";
import QuickActions from "./QuickActions";

interface AgentChatProps {
  open: boolean;
  onClose: () => void;
}

export default function AgentChat({ open, onClose }: AgentChatProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    setMessages,
    setInput,
    isLoading,
    error,
  } = useChat({
    api: "/api/chat",
    streamProtocol: "text",
    onResponse: (response) => {
      if (!response.ok) {
        console.error("Response error:", response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `\`\`\`\nError: ${error?.message || "Something went wrong"}\n\`\`\`\n\nPlease try again or refresh the page.`,
      };
      setMessages([...messages, errorMessage]);
    },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      await originalHandleSubmit(e);
    } catch (err: any) {
      console.error("Failed to send message:", err);
    }
  };

  const handleCommand = (command: string) => {
    if (isLoading) return;
    setInput(command);
    // Trigger submit
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
    setMessages([...messages, { id: Date.now().toString(), role: "user", content: command }]);
    originalHandleSubmit(fakeEvent);
  };

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "fixed bottom-20 right-4 z-50 w-full max-w-md transition-all duration-300",
        open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <div className="flex flex-col h-[550px] rounded-lg overflow-hidden border border-terminal-border bg-terminal-bg shadow-2xl shadow-black/20">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-terminal-bg-alt border-b border-terminal-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2 text-sm font-mono">
              <Terminal size={14} className="text-terminal-green" />
              <span className="text-terminal-muted">ahmed</span>
              <span className="text-terminal-green">@</span>
              <span className="text-terminal-muted">portfolio</span>
              <span className="text-terminal-green">:</span>
              <span className="text-terminal-cyan">~/chat</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-terminal-border/50 text-terminal-muted hover:text-terminal-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Actions */}
        <QuickActions onCommand={handleCommand} disabled={isLoading} />

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 terminal-scrollbar"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 rounded-xl bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center animate-pulse-glow">
                <Bot size={32} className="text-terminal-green" />
              </div>
              <div className="space-y-2">
                <p className="text-terminal-text font-mono text-sm">
                  Welcome! I&apos;m Ahmed&apos;s AI Agent.
                </p>
                <p className="text-terminal-muted font-mono text-xs">
                  Try the quick actions above or ask me anything!
                </p>
              </div>
              <div className="font-mono text-xs text-terminal-muted/70 space-y-1">
                <p>
                  <span className="text-terminal-cyan">tip:</span> Try{" "}
                  <span className="text-terminal-green">sudo hire ahmed</span>
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <AgentMessage
                  key={message.id}
                  role={message.role as "user" | "assistant"}
                  content={message.content}
                />
              ))}

              {isLoading && lastMessageIsUser && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center">
                    <Bot size={16} className="text-terminal-green animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 text-sm font-mono text-terminal-muted">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                    <span>Processing...</span>
                  </div>
                </div>
              )}

              {error && !isLoading && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs">
                  Error: {error.message || "Something went wrong"}
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        <AgentInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onClear={() => setMessages([])}
          isLoading={isLoading}
          autoFocus={open}
        />
      </div>
    </div>
  );
}
