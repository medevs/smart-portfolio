-- Migration: Create match_documents function
-- Description: PostgreSQL function for similarity search with metadata filtering
-- Used by: LangChain SupabaseVectorStore for RAG retrieval

-- Create or replace the match_documents function
-- This function performs cosine similarity search on document embeddings
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  filter JSONB DEFAULT '{}'::jsonb,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.content,
    d.metadata,
    -- Convert cosine distance to similarity score (1 = identical, 0 = orthogonal)
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM documents d
  WHERE
    -- Filter by metadata using JSONB containment operator
    -- Example: filter = '{"category": "experience"}' matches all docs with that category
    d.metadata @> filter
  ORDER BY
    -- Order by cosine distance (ascending = most similar first)
    d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Add a comment to the function for documentation
COMMENT ON FUNCTION match_documents IS 'Performs cosine similarity search on document embeddings with optional metadata filtering';
