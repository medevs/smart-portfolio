import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    "Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
  );
}

const client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Function to get a vector store instance from an existing index
export async function getVectorStore() {
  return new SupabaseVectorStore(
    new OpenAIEmbeddings({ modelName: "text-embedding-3-small" }), 
    {
      client,
      tableName: 'documents',
      queryName: 'match_documents',
      filter: {},
    }
  );
}

// Function to get a reference to the embeddings collection
export async function getEmbeddingsCollection() {
  return client.from('documents');
}
