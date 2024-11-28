import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { DocumentInterface } from "@langchain/core/documents";
import { Redis } from "@upstash/redis";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddingsCollection, getVectorStore } from "../src/lib/supabase";

async function generateEmbeddings() {
  // Clear Redis cache
  await Redis.fromEnv().flushdb();
  const vectorStore = await getVectorStore();
  
  // Clear existing documents from Supabase
  const { error } = await (await getEmbeddingsCollection()).delete().neq('id', 0);
  if (error) {
    console.error('Error clearing documents:', error);
    return;
  }

  // Load resume data
  const loader = new JSONLoader(
    "src/data/resumeDtata.json",
    ["/personalInfo", "/experience", "/education", "/skills", "/projects", "/interests"]
  );

  const docs = await loader.load();

  const processedDocs = docs.map((doc): DocumentInterface => {
    return {
      pageContent: doc.pageContent,
      metadata: {
        source: "resume",
        section: doc.metadata.source
      },
    };
  });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const splitDocs = await splitter.splitDocuments(processedDocs);
  await vectorStore.addDocuments(splitDocs);

  console.log("Resume embeddings generated successfully!");
}

generateEmbeddings();