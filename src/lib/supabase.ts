import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

let reader: SupabaseClient | null = null;
let administrator: SupabaseClient | null = null;

function clientFor(admin: boolean): SupabaseClient {
  const cached = admin ? administrator : reader;
  if (cached) return cached;
  const url = process.env.SUPABASE_URL;
  const key = admin
    ? process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new Error(
      admin
        ? "Indexing requires SUPABASE_URL and a server-only SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY)."
        : "Knowledge retrieval requires SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY (or legacy SUPABASE_ANON_KEY).",
    );
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  if (admin) administrator = client;
  else reader = client;
  return client;
}

function vectorStore(client: SupabaseClient) {
  return new SupabaseVectorStore(new OpenAIEmbeddings({ modelName: "text-embedding-3-small" }), {
    client,
    tableName: "documents",
    queryName: "match_documents",
    filter: {},
  });
}

/** Read-only knowledge retrieval uses the publishable/anonymous key and RLS. */
export async function getVectorStore() {
  return vectorStore(clientFor(false));
}

/** The indexer alone requires an explicitly supplied server-only administrator key. */
export async function getIndexingStore() {
  return vectorStore(clientFor(true));
}
export async function getEmbeddingsCollection() {
  return clientFor(true).from("documents");
}
