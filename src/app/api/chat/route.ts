// File: src/lib/chatbot.ts

import { getVectorStore } from "@/lib/supabase";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import {
  LangChainStream,
  StreamingTextResponse,
  Message as VercelChatMessage,
} from "ai";
import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";
import { Redis } from "@upstash/redis";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";

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

    const cache = new UpstashRedisCache({
      client: Redis.fromEnv(),
    });

    const { stream, handlers } = LangChainStream();

    const chatModel = new ChatOpenAI({
      modelName: "gpt-4-1106-preview",
      streaming: true,
      callbacks: [handlers],
      verbose: true,
      cache,
    });

    const rephrasingModel = new ChatOpenAI({
      modelName: "gpt-4-1106-preview",
      verbose: true,
      cache,
    });

    const retriever = (await getVectorStore()).asRetriever({
      k: 5 // Increased number of documents to retrieve
    });

    const rephrasePrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
      [
        "user",
        "Given the above conversation, generate a search query to look up information relevant to the current question. " +
        "Focus on keywords related to skills, experiences, projects, or specific details about the portfolio owner. " +
        "Only return the query and no other text.",
      ],
    ]);

    const historyAwareRetrieverChain = await createHistoryAwareRetriever({
      llm: rephrasingModel,
      retriever,
      rephrasePrompt,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a chatbot for a personal portfolio website. You should answer as if you are the owner of the portfolio.
        Use the following context to answer questions about the portfolio owner's skills, experiences, projects, and other relevant information.
        Always strive to provide accurate, specific, and comprehensive information based on the context provided.
        When discussing experiences or skills, ensure you cover all relevant details from the context.
        If asked about skills or experiences, refer to the most up-to-date information in the context.
        Whenever it makes sense, provide links to pages that contain more information about the topic from the given context.
        When providing links, use the standard Markdown format: [link text](URL)
        Do not generate or suggest any HTML or React components.
        Format your messages in markdown format.
        
        Context:
        {context}`,
      ],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
      documentPrompt: PromptTemplate.fromTemplate(
        "{page_content}",
      ),
      documentSeparator: "\n--------\n",
    });

    const retrievalChain = await createRetrievalChain({
      combineDocsChain,
      retriever: historyAwareRetrieverChain,
    });

    const result = await retrievalChain.invoke({
      input: currentMessageContent,
      chat_history: chatHistory,
    });

    const sanitizedResponse = sanitizeResponse(result.answer);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function sanitizeResponse(response: string): string {
  // Remove any HTML-like tags
  return response.replace(/<\/?[^>]+(>|$)/g, "");
}