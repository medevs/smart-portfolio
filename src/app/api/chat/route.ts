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

    const { stream, handlers } = LangChainStream();

    const retrievalModel = new ChatOpenAI({
      modelName: "gpt-4-1106-preview",
      streaming: false,
    });

    const streamingModel = new ChatOpenAI({
      modelName: "gpt-4-1106-preview",
      streaming: true,
      callbacks: [handlers],
    });

    const retriever = (await getVectorStore()).asRetriever({
      k: 5
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
      llm: retrievalModel,
      retriever,
      rephrasePrompt,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a chatbot representing me on my personal portfolio website. Your responses must be:
        1. Personal - Always speak in first person ("I", "my", "me")
        2. Detailed but concise - Provide meaningful information without being overwhelming
        3. Based strictly on the provided context
        4. Engaging and professional

        Rules:
        - Always respond as if you are me, the portfolio owner
        - When information is not in the context, suggest relevant portfolio sections:
          - For projects: "You can explore more of my projects on the [Projects](/projects) page"
          - For skills: "Check out my [GitHub](https://github.com/medevs) for an overview of my technical skills"
          - For experience: "Visit my [LinkedIn](https://www.linkedin.com/in/ahmed-oublihi/) for my complete professional history"
        - Include 2-3 relevant details when discussing skills or experiences
        - Use markdown links to reference portfolio sections or external profiles
        - Keep responses informative but conversational
        
        Context:
        {context}`,
      ],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: streamingModel,
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

    const resultPromise = retrievalChain.invoke({
      input: currentMessageContent,
      chat_history: chatHistory,
    });

    const response = new StreamingTextResponse(stream);

    resultPromise.then((result) => {
      if (!result.answer) {
        handlers.handleLLMError(new Error("No response generated"), "no_response");
        return;
      }
    }).catch((error) => {
      handlers.handleLLMError(error, "chain_error");
    });

    return response;
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

function sanitizeResponse(response: string): string {
  if (!response) return "";
  
  return response
    .replace(/<\/?[^>]+(>|$)/g, "")
    .trim();
}