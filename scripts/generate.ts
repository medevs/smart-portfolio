import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
// Configure dotenv before other imports
import { DocumentInterface } from "@langchain/core/documents";
import { Redis } from "@upstash/redis";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
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
    },
    true,
  );

  // Load data.js from assets folder
  const dataLoader = new TextLoader("src/assets/data.js");

  const docs = (await loader.load())
    .filter((doc) => doc.metadata.source.endsWith("page.tsx") || doc.metadata.source.includes("/components/"))
    .map((doc): DocumentInterface => {
      let url;
      if (doc.metadata.source.endsWith("page.tsx")) {
        url = doc.metadata.source
          .replace(/\\/g, "/")
          .split("/src/app")[1]
          .split("/page.")[0] || "/";
      } else if (doc.metadata.source.includes("/components/")) {
        url = `/components${doc.metadata.source.split("/components")[1].replace(/\.tsx$/, "")}`;
      }
      const pageContentTrimmed = doc.pageContent
        .replace(/^import.*$/gm, "") // Remove all import statements
        .replace(/ className=(["']).*?\1| className={.*?}/g, "") // Remove all className props
        .replace(/^\s*[\r]/gm, "") // remove empty lines
        .trim();
      return {
        pageContent: pageContentTrimmed,
        metadata: { url },
      };
    });

  // Load and process data.js
  const dataDocs = await dataLoader.load();
  const processedDataDocs = dataDocs.map((doc): DocumentInterface => ({
    pageContent: doc.pageContent,
    metadata: { url: "/assets/data" },
  }));

  // Combine all documents
  const allDocs = [...docs, ...processedDataDocs];

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html");
  const splitDocs = await splitter.splitDocuments(allDocs);
  await vectorStore.addDocuments(splitDocs);
}

generateEmbeddings();