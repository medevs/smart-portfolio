import { getVectorStore } from "@/lib/supabase";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { Message as VercelChatMessage } from "ai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

function sanitizeResponse(response: string): string {
  if (!response) return "";
  
  return response
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    const chatHistory = messages
      .slice(0, -1)
      .map((m: VercelChatMessage) =>
        m.role === "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      );

    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({
      modelName: "gpt-4-1106-preview",
      streaming: true,
    });

    const vectorStore = await getVectorStore();
    const retriever = vectorStore.asRetriever();

    // Step 1: Retrieve context
    const getContext = async (input: { input: string; chat_history: any }) => {
      const docs = await retriever.getRelevantDocuments(input.input);
      return {
        context: docs.map((doc: any) => doc.pageContent).join("\n\n"),
        question: input.input,
        chat_history: input.chat_history,
      };
    };

    // Step 2: Prompt template
    const prompt = ChatPromptTemplate.fromTemplate(
      `Given the following context and conversation, answer the user's question.\n\nContext:\n{context}\n\nConversation:\n{chat_history}\n\nQuestion:\n{question}\n\nAnswer:`
    );

    // Compose the chain using .pipe()
    const chain = getContext
      // @ts-expect-error: .pipe is not typed for functions, but works at runtime
      .pipe(prompt)
      .pipe(model)
      .pipe(new StringOutputParser());

    // Stream the output
    const stream = await chain.stream({
      input: currentMessageContent,
      chat_history: chatHistory,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    
    const errorMessage = error?.message || "Unknown error occurred";
    return Response.json(
      { 
        error: "Chat processing failed", 
        details: errorMessage,
        code: error?.code || "UNKNOWN_ERROR"
      }, 
      { status: 500 }
    );
  }
}