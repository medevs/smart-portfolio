import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

let client: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables."
    );
  }

  client = createClient(supabaseUrl, supabaseKey);
  return client;
}

// Function to get a vector store instance from an existing index
export async function getVectorStore() {
  return new SupabaseVectorStore(
    new OpenAIEmbeddings({ modelName: "text-embedding-3-small" }),
    {
      client: getSupabaseClient(),
      tableName: "documents",
      queryName: "match_documents",
      filter: {},
    }
  );
}

// Function to get a reference to the embeddings collection
export async function getEmbeddingsCollection() {
  return getSupabaseClient().from("documents");
}
