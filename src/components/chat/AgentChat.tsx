"use client";

import { cn } from "@/lib/utils";
import { Message, useChat } from "ai/react";
import { Bot, X, Sparkles } from "lucide-react";
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
    append,
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

  const handleCommand = async (command: string) => {
    if (isLoading) return;
    await append({
      role: "user",
      content: command,
    });
  };

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "fixed bottom-28 right-4 z-50 w-full max-w-md",
        // Animation
        "transition-all duration-500 ease-out",
        open
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "flex flex-col h-[500px] rounded-2xl overflow-hidden",
          // Glassmorphism
          "bg-surface-elevated/90 backdrop-blur-2xl",
          "border border-card-theme-border",
          "shadow-chat-panel",
          // Glow effect
          "ring-1 ring-terminal-green/20"
        )}
      >
        {/* Header with animated gradient */}
        <div className="relative px-4 py-3 bg-gradient-to-r from-surface-secondary/50 to-surface-elevated/50 flex-shrink-0">
          {/* Animated gradient border */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-terminal-green/50 to-transparent" />

          <div className="flex items-center justify-between">
            {/* AI Avatar + Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-terminal-green/20 to-terminal-cyan/20 flex items-center justify-center border border-terminal-green/30">
                  <Bot size={18} className="text-terminal-green" />
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-terminal-green animate-pulse ring-2 ring-surface-primary/50" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Ahmed&apos;s AI</h3>
                <p className="text-xs text-terminal-muted">Always online</p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-terminal-muted hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions onCommand={handleCommand} disabled={isLoading} />

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-slide-up-fade">
              {/* Animated AI Icon */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-terminal-green/20 to-terminal-cyan/20 flex items-center justify-center border border-terminal-green/30 animate-float">
                  <Bot size={32} className="text-terminal-green" />
                </div>
                {/* Decorative sparkles */}
                <Sparkles
                  size={14}
                  className="absolute -top-1 -right-1 text-terminal-cyan animate-pulse"
                />
              </div>

              <div className="space-y-2">
                <p className="text-foreground font-medium text-sm">
                  Hey! I&apos;m Ahmed&apos;s AI Agent
                </p>
                <p className="text-terminal-muted text-xs max-w-[280px]">
                  Ask me about skills, projects, experience, or anything else!
                </p>
              </div>

              {/* Easter egg hint */}
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-card-theme-border">
                <p className="text-xs text-terminal-muted">
                  <span className="text-terminal-cyan">Pro tip:</span>{" "}
                  Try typing{" "}
                  <code className="px-1.5 py-0.5 rounded bg-terminal-green/10 text-terminal-green text-[10px]">
                    sudo hire ahmed
                  </code>
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
                <div className="flex items-center gap-3 animate-slide-up-fade">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-terminal-green/20 to-terminal-cyan/20 flex items-center justify-center border border-terminal-green/30">
                    <Bot size={16} className="text-terminal-green animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-card-theme-border">
                    <span className="inline-flex gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                    <span className="text-xs text-terminal-muted">Thinking...</span>
                  </div>
                </div>
              )}

              {error && !isLoading && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
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
