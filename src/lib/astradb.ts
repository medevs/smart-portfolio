import { AstraDB } from "@datastax/astra-db-ts";
import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { OpenAIEmbeddings } from "@langchain/openai";

const endpoint = process.env.ASTRA_DB_ENDPOINT || "";
const token = process.env.ASTRA_DB_APPLICATION_TOKEN || "";
const collection = process.env.ASTRA_DB_COLLECTION || "";

if (!token || !endpoint || !collection) {
  throw new Error(
    "Please set ASTRA_DB_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN, and ASTRA_DB_COLLECTION environment variables.",
  );
}

// Function to get a vector store instance from an existing index
export async function getVectorStore() {
    // Creating an instance of AstraDBVectorStore using an existing index with OpenAI embeddings
  return AstraDBVectorStore.fromExistingIndex(
    new OpenAIEmbeddings({ modelName: "text-embedding-3-small" }),
    {
      token,
      endpoint,
      collection,
      collectionOptions: {
        vector: {
          dimension: 1536, // Dimensionality of the vector embeddings
          metric: "cosine", // Metric used for similarity comparison
        },
      },
    },
  );
}

// Function to get a reference to the embeddings collection from AstraDB
export async function getEmbeddingsCollection() {
  return new AstraDB(token, endpoint).collection(collection);
}
