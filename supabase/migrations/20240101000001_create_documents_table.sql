-- Migration: Create documents table
-- Description: Stores document chunks with their embeddings for RAG retrieval
-- Embedding dimension: 1536 (OpenAI text-embedding-3-small)

-- Create the documents table for vector storage
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding VECTOR(1536)
);

-- Create index for faster similarity search using IVFFlat
-- The 'lists' parameter should be tuned based on your data size:
-- - For < 1M rows: lists = rows / 1000
-- - For > 1M rows: lists = sqrt(rows)
-- Starting with 100 lists as a reasonable default
CREATE INDEX IF NOT EXISTS documents_embedding_idx
  ON documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Add a comment to the table for documentation
COMMENT ON TABLE documents IS 'Stores document chunks with vector embeddings for RAG-based retrieval';
COMMENT ON COLUMN documents.content IS 'The text content of the document chunk';
COMMENT ON COLUMN documents.metadata IS 'JSON metadata (e.g., source, title, category)';
COMMENT ON COLUMN documents.embedding IS 'OpenAI text-embedding-3-small vector (1536 dimensions)';
