"use client";

import { SendHorizontal, Trash2 } from "lucide-react";
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AgentInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  isLoading: boolean;
  autoFocus?: boolean;
}

export default function AgentInput({
  value,
  onChange,
  onSubmit,
  onClear,
  isLoading,
  autoFocus = false,
}: AgentInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <form onSubmit={onSubmit} className="p-3 border-t border-white/5 bg-slate-900/50">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus-within:border-terminal-green/30 transition-colors">
        {/* Prompt indicator */}
        <span className="text-terminal-green text-sm font-mono">$</span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none text-sm
                     text-terminal-text placeholder:text-terminal-muted/50
                     disabled:opacity-50"
        />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              "text-terminal-muted hover:text-red-400 hover:bg-red-400/10",
              "disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-terminal-muted"
            )}
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>

          <button
            type="submit"
            disabled={!value.trim() || isLoading}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              "text-terminal-muted",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              value.trim() && !isLoading && "text-terminal-green hover:bg-terminal-green/10"
            )}
            title="Send message"
          >
            <SendHorizontal size={16} />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 mt-2 px-3 text-xs text-terminal-muted">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
          <span>Processing...</span>
        </div>
      )}
    </form>
  );
}
