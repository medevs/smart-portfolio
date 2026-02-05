"use client";

import { SendHorizontal, Trash2 } from "lucide-react";
import { useRef, useEffect } from "react";

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
    <form onSubmit={onSubmit} className="p-3 border-t border-terminal-border bg-terminal-bg-alt">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 text-terminal-green font-mono text-sm">
          <span className="hidden sm:inline">guest@portfolio</span>
          <span className="text-terminal-muted">:</span>
          <span className="text-terminal-cyan">~</span>
          <span className="text-terminal-muted">$</span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm
                     text-terminal-text placeholder:text-terminal-muted/50
                     disabled:opacity-50"
        />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="p-2 rounded-md text-terminal-muted hover:text-red-400
                       hover:bg-red-400/10 transition-colors disabled:opacity-50"
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>

          <button
            type="submit"
            disabled={!value.trim() || isLoading}
            className="p-2 rounded-md text-terminal-muted hover:text-terminal-green
                       hover:bg-terminal-green/10 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <SendHorizontal size={16} />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 mt-2 text-xs font-mono text-terminal-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
          <span>Processing query...</span>
        </div>
      )}
    </form>
  );
}
