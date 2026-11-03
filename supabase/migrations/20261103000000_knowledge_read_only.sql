-- Portfolio knowledge is public to read. Only the server-side indexer may write.
-- Prepared by the application audit; apply explicitly to the intended Supabase project.
BEGIN;

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.documents FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.documents TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.documents TO service_role;

DROP POLICY IF EXISTS portfolio_knowledge_read ON public.documents;
CREATE POLICY portfolio_knowledge_read ON public.documents
  FOR SELECT TO anon, authenticated USING (true);

REVOKE ALL ON SEQUENCE public.documents_id_seq FROM PUBLIC, anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.documents_id_seq TO service_role;

COMMIT;
