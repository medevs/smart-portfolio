import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { DocumentInterface } from "@langchain/core/documents";
import { Redis } from "@upstash/redis";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddingsCollection, getVectorStore } from "../src/lib/astradb";

async function generateEmbeddings() {
  await Redis.fromEnv().flushdb();
  const vectorStore = await getVectorStore();
  (await getEmbeddingsCollection()).deleteMany({});

  // Load files from src/app/ and components/
  const loader = new DirectoryLoader(
    "src/",
    {
      ".tsx": (path) => new TextLoader(path),
      ".json": (path) => new JSONLoader(path),
    },
    true,
  );

  const docs = await loader.load();

  const processedDocs = docs.map((doc): DocumentInterface => {
    let url;
    if (doc.metadata.source.endsWith("page.tsx")) {
      url = doc.metadata.source
        .replace(/\\/g, "/")
        .split("/src/app")[1]
        .split("/page.")[0] || "/";
    } else if (doc.metadata.source.includes("/components/")) {
      url = `/components${doc.metadata.source.split("/components")[1].replace(/\.tsx$/, "")}`;
    } else if (doc.metadata.source.includes("/data/")) {
      url = `/data${doc.metadata.source.split("/data")[1]}`;
    }

    let pageContent = doc.pageContent;

    if (doc.metadata.source.endsWith(".tsx")) {
      pageContent = pageContent
        .replace(/^import.*$/gm, "")
        .replace(/ className=(["']).*?\1| className={.*?}/g, "")
        .replace(/^\s*[\r]/gm, "")
        .trim();
    }

    return {
      pageContent,
      metadata: { url, source: doc.metadata.source },
    };
  });

  // Add custom document for website structure
  // const websiteStructure = {
  //   pageContent: "Website structure: Home page at /, Blog at /blog, Projects at /projects, Resume at /resume",
  //   metadata: { url: "/structure", source: "custom" },
  // };

  const allDocs = [...processedDocs];

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(allDocs);
  await vectorStore.addDocuments(splitDocs);

  console.log("Embeddings generated successfully!");
}

generateEmbeddings();