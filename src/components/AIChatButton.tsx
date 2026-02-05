"use client";

import { Bot, X } from "lucide-react";
import { useState } from "react";
import AgentChat from "./chat/AgentChat";
import { cn } from "@/lib/utils";

export default function AIChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setChatBoxOpen(!chatBoxOpen)}
        className="fixed bottom-6 right-4 z-50 group"
        aria-label={chatBoxOpen ? "Close chat" : "Open chat"}
      >
        <div className="relative">
          {/* Glow effect */}
          <div
            className={cn(
              "absolute inset-0 rounded-full blur-xl transition-all duration-300",
              chatBoxOpen
                ? "bg-red-500/20"
                : "bg-terminal-green/30 group-hover:bg-terminal-green/40"
            )}
          />

          {/* Button */}
          <div
            className={cn(
              "relative flex items-center justify-center w-14 h-14 rounded-full",
              "transition-all duration-300",
              chatBoxOpen
                ? "bg-surface-elevated border-2 border-red-500/50 hover:border-red-500"
                : "bg-gradient-to-br from-terminal-green to-terminal-cyan shadow-chat-button hover:shadow-chat-button-hover hover:scale-110"
            )}
          >
            {chatBoxOpen ? (
              <X size={24} className="text-red-400" />
            ) : (
              <Bot size={24} className="text-foreground dark:text-background" />
            )}
          </div>

          {/* Ping indicator when closed */}
          {!chatBoxOpen && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-terminal-cyan" />
            </span>
          )}
        </div>
      </button>

      <AgentChat open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
}
