import { getVectorStore } from "@/lib/astradb";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { LangChainStream, StreamingTextResponse } from "ai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    // Extract the content of the latest message
    const currentMessageContent = messages[messages.length - 1].content;

    // Create a stream and handlers for managing streaming responses
    const { stream, handlers } = LangChainStream();

    const chatModel = new ChatOpenAI({
      modelName: "gpt-4o",
      streaming: true,
      callbacks: [handlers],
      verbose: true,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a chatbot for a personal portfolio website. You impersonate the website's owner. " +
          "Answer the user's questions based on the below context. " +
          "Whenever it makes sense, provide links to pages that contain more information about the topic from the given context. " +
          "Always Write short answers in English" +
          "Format your messages in markdown format.\n\n" +
          "Context:\n{context}",
      ],
      ["user", "{input}"], // Placeholder for the user's input
    ]);

    // Create a chain that combines document responses using the chat model and prompt
    const combineDocsChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
      documentPrompt: PromptTemplate.fromTemplate(
        "Page URL: {url}\n\nPage content:\n{page_content}",
      ),
      documentSeparator: "\n--------\n",
    });

    // Retrieve the vector store and create a retriever
    const retriever = (await getVectorStore()).asRetriever();

    // Create a retrieval chain that uses the combiner and retriever
    const retrievalChain = await createRetrievalChain({
      combineDocsChain,
      retriever,
    });

    // Invoke the retrieval chain with the user's input
    retrievalChain.invoke({
      input: currentMessageContent,
    });

    // Return a streaming text response
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
