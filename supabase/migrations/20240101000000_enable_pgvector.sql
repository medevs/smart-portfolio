-- Migration: Enable pgvector extension
-- Description: Enables the vector extension for similarity search capabilities
-- Required for: Storing and querying OpenAI embeddings (1536 dimensions)

-- Enable the pgvector extension
-- This must be done before creating any vector columns
CREATE EXTENSION IF NOT EXISTS vector;
