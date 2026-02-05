"use client";

import { Bot, MessageSquare } from "lucide-react";
import { useState } from "react";
import AgentChat from "./chat/AgentChat";

export default function AIChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setChatBoxOpen(!chatBoxOpen)}
        className="fixed bottom-4 right-4 z-40 group"
        aria-label={chatBoxOpen ? "Close chat" : "Open chat"}
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-terminal-green/20 blur-xl group-hover:bg-terminal-green/30 transition-colors animate-pulse-glow" />

          {/* Button */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full
                          bg-terminal-bg border-2 border-terminal-green/50
                          shadow-terminal-glow hover:shadow-terminal-glow-lg
                          transition-all duration-300 group-hover:border-terminal-green
                          group-hover:scale-105">
            <Bot
              size={24}
              className="text-terminal-green transition-transform duration-300
                         group-hover:scale-110"
            />
          </div>

          {/* Ping indicator when closed */}
          {!chatBoxOpen && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-terminal-green" />
            </span>
          )}
        </div>
      </button>

      <AgentChat open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
}
