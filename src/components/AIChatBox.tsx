import { cn } from "@/lib/utils";
import { Message, useChat } from "ai/react";
import { Bot, SendHorizontal, Trash, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  // chat-related states and functions from useChat hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      if (!response.ok) {
        console.error('Response error:', response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
    onFinish: (message) => {
      console.log('Chat finished successfully');
    },
    onError: (error) => {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `An error occurred: ${error?.message || 'Something went wrong. Please try refreshing the page if this persists.'}`,
      };
      setMessages([...messages, errorMessage]);
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    try {
      await originalHandleSubmit(e);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Failed to send message: ${err?.message || 'Please try again.'}`,
      };
      setMessages([...messages, errorMessage]);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-focus input when chat box is opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Determine if the last message is from the user
  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "fixed bottom-16 right-4 z-50 w-full max-w-[500px] p-4 xl:right-22",
        open ? "block" : "hidden",
      )}
    >
      <div className="flex h-[600px] flex-col border bg-background shadow-xl rounded-lg  overflow-hidden">
        <div className="flex items-center justify-between bg-black bg-opacity-30 p-4">
          <h2 className="text-white font-bold">AI Assistant</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}
          {error && (
            <ChatMessage
              message={{
                id: "error",
                role: "assistant",
                content: error?.message || "Something went wrong. Please try again!",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot size={48} className="text-purple-500 mb-4 animate-bounce" />
            <p className="text-lg font-medium mb-2">
              Hello! How can I assist you today?
            </p>
            <p className="text-sm ">
              Feel free to ask me anything about this website.
            </p>
          </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <button
            type="button"
            className="flex w-10 flex-none items-center justify-center hover:text-red-500 transition-colors duration-300"
            title="Clear chat"
            onClick={() => setMessages([])}
          >
            <Trash size={24} />
          </button>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
            className="flex-grow rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ref={inputRef}
          />
          <button
            type="submit"
            className="flex w-10 flex-none items-center justify-center disabled:opacity-50 hover:text-blue-400 transition-colors duration-300"
            disabled={input.length === 0}
            title="Submit message"
          >
            <SendHorizontal size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}

// Component to display individual chat messages
interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message: { role, content } }: ChatMessageProps) {
  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAiMessage && <Bot className="mr-2 flex-none" />}
      <div
        className={cn(
          "rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-foreground text-background",
        )}
      >
        <ReactMarkdown
          components={{
            a: ({ node, ref, ...props }) => (
              <Link
                {...props}
                href={props.href ?? ""}
                className="text-primary hover:underline"
              />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="mt-3 first:mt-0" />
            ),
            ul: ({ node, ...props }) => (
              <ul
                {...props}
                className="mt-3 list-inside list-disc first:mt-0"
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                {...props}
                className="mt-3 list-inside list-decimal first:mt-0"
              />
            ),
            li: ({ node, ...props }) => <li {...props} className="mt-1" />,
            blockquote: ({ node, ...props }) => (
              <blockquote {...props} className="text-primary" />
            ),
            code: ({ node, ...props }) => {
              const { inline } = node as any;
              return (
                <code
                  {...props}
                  className={`rounded p-1 ${inline ? 'inline-block' : 'block'} mt-3 first:mt-0 text-primary`}
                />
              );
            },
            pre: ({ node, ...props }) => (
              <pre {...props} className="bg-gray-100 rounded p-3 overflow-auto mt-3 first:mt-0" />
            ),
            h1: ({ node, ...props }) => (
              <h1 {...props} className="text-3xl font-bold mt-4 first:mt-0" />
            ),
            h2: ({ node, ...props }) => (
              <h2 {...props} className="text-2xl font-bold mt-3 first:mt-0" />
            ),
            h3: ({ node, ...props }) => (
              <h3 {...props} className="text-xl font-bold mt-3 first:mt-0" />
            ),
            h4: ({ node, ...props }) => (
              <h4 {...props} className="text-lg font-bold mt-3 first:mt-0" />
            ),
            h5: ({ node, ...props }) => (
              <h5 {...props} className="text-base font-bold mt-3 first:mt-0" />
            ),
            h6: ({ node, ...props }) => (
              <h6 {...props} className="text-sm font-bold mt-3 first:mt-0" />
            ),
            table: ({ node, ...props }) => (
              <table {...props} className="w-full mt-3 border-collapse border border-gray-200 first:mt-0" />
            ),
            thead: ({ node, ...props }) => (
              <thead {...props} className="bg-gray-100" />
            ),
            tbody: ({ node, ...props }) => (
              <tbody {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr {...props} className="border-t border-gray-200" />
            ),
            th: ({ node, ...props }) => (
              <th {...props} className="px-4 py-2 text-left font-semibold" />
            ),
            td: ({ node, ...props }) => (
              <td {...props} className="px-4 py-2" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>

      </div>
    </div>
  );
}
