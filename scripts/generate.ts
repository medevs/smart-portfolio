import dotenv from "dotenv";
import path from "path";
import { Document } from "@langchain/core/documents";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { VectorStore } from "langchain/vectorstores/base";
import { Redis } from "@upstash/redis";

// Configure dotenv before other imports
dotenv.config({ path: ".env.local" });

// These imports might need to be adjusted based on your project structure
import { getEmbeddingsCollection, getVectorStore } from "../src/lib/astradb";

async function generateEmbeddings(): Promise<void> {
  const redis = Redis.fromEnv();
  await redis.flushdb();

  const vectorStore: VectorStore = await getVectorStore();

  const embeddingsCollection = await getEmbeddingsCollection();
  await embeddingsCollection.deleteMany({});

  const appLoader = new DirectoryLoader(
    "src/app",
    {
      ".tsx": (path) => new TextLoader(path),
    },
    true,
  );

  const assetsLoader = new DirectoryLoader(
    "src/assets",
    {
      ".ts": (path) => new TextLoader(path),
    },
    true,
  );

  const componentsLoader = new DirectoryLoader(
    "src/components",
    {
      ".tsx": (path) => new TextLoader(path),
    },
    true,
  );

  const docs = [
    ...(await appLoader.load()),
    ...(await componentsLoader.load()),
    ...(await assetsLoader.load()),
  ].map((doc): Document => {
    const relativePath = path.relative(process.cwd(), doc.metadata.source);
    const url =
      "/" +
      relativePath
        .split(path.sep)
        .slice(1)
        .join("/")
        .replace(/\.tsx$/, "");

    return new Document({
      pageContent: doc.pageContent,
      metadata: { url },
    });
  });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  console.log(splitDocs);

  await vectorStore.addDocuments(splitDocs);
}

generateEmbeddings().catch(console.error);
