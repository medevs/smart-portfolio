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
      modelName: "gpt-4.1-nano",
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
      `You are Ahmed Oublihi, a full-stack developer. Answer as if you're talking directly to a potential client or collaborator.

      Guidelines:
      - Speak in first person ("I", "me", "my"), like a real person.
      - Be friendly, confident, and a bit informal—show personality!
      - ALWAYS answer questions about my portfolio, skills, experience, contact info, or why hire me.
      - Use info from my resume and portfolio for richer answers.
      - Format your answers in clean Markdown (use bullet points, links, bold, etc. where helpful).
      - If the question is not about my portfolio/skills/education/experience/contact info, politely say: "I'm here to talk about my work, skills, or experience—ask me anything about that!"

      Context:
      {context}

      Conversation:
      {chat_history}

      Question:
      {question}

      Answer (Markdown, friendly, personal, and concise):`
    );

    // Compose the chain using RunnableSequence
    const chain = RunnableSequence.from([
      getContext,
      prompt,
      model,
      new StringOutputParser(),
    ]);

    // Stream the output
    const stream = await chain.stream({
      input: currentMessageContent,
      chat_history: chatHistory,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let lastChunkEndsWithSpace = false;
        let insideCodeBlock = false;
        let insideListItem = false;
        
        for await (let chunk of stream) {
          if (typeof chunk !== 'string') {
            chunk = String(chunk ?? '');
          }
          
          // Check if we're entering or exiting a code block
          if (chunk.includes('```')) {
            insideCodeBlock = !insideCodeBlock;
          }
          
          // Check if we're in a list item
          if (chunk.match(/^\s*[-*+]\s/) || chunk.match(/^\s*\d+\.\s/)) {
            insideListItem = true;
          } else if (chunk.includes('\n')) {
            insideListItem = false;
          }
          
          // Only replace line breaks with spaces if not in a code block
          if (!insideCodeBlock) {
            chunk = chunk.replace(/[\r\n]+/g, ' ');
          }
          
          // If the previous chunk didn't end with space and this chunk doesn't start with space or punctuation,
          // add a space to preserve word boundaries (unless we're in a code block)
          if (!insideCodeBlock && 
              !lastChunkEndsWithSpace && 
              chunk.length > 0 && 
              !chunk.startsWith(' ') && 
              !chunk.match(/^[.,!?;:)]/) && 
              chunk.trim() !== '') {
            chunk = ' ' + chunk;
          }
          
          // Remember if this chunk ends with a space for the next iteration
          lastChunkEndsWithSpace = chunk.endsWith(' ');
          
          // Skip empty chunks
          if (!chunk.trim() && !chunk.includes(' ')) continue;
          
          // Send the chunk
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
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