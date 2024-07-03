import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { VectorStore } from "langchain/vectorstores/base";
import { Redis } from "@upstash/redis";

// Configure dotenv before other imports
dotenv.config({ path: ".env.local" });

// These imports might need to be adjusted based on your project structure
import { getEmbeddingsCollection, getVectorStore } from "../src/lib/astradb";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function isObject(value: JsonValue): value is { [key: string]: JsonValue } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createDocuments(data: { [key: string]: JsonValue }, parentKey = ''): Document[] {
  return Object.entries(data).flatMap(([key, value]) => {
    const currentKey = parentKey ? `${parentKey}/${key}` : key;
    if (isObject(value)) {
      return createDocuments(value, currentKey);
    } else {
      return new Document({
        pageContent: JSON.stringify(value),
        metadata: { url: `/${currentKey}` }
      });
    }
  });
}

async function generateEmbeddings(): Promise<void> {
  const redis = Redis.fromEnv();
  await redis.flushdb();

  const vectorStore: VectorStore = await getVectorStore();

  const embeddingsCollection = await getEmbeddingsCollection();
  await embeddingsCollection.deleteMany({});

  // Read the data.json file
  const dataFilePath = path.join(process.cwd(), "data.json");
  const jsonData = await fs.readFile(dataFilePath, "utf-8");
  const data = JSON.parse(jsonData) as { [key: string]: JsonValue };

  // Convert the JSON data into documents
  const docs = createDocuments(data);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  console.log(splitDocs);

  await vectorStore.addDocuments(splitDocs);
}

generateEmbeddings().catch(console.error);