create index if not exists idx_embedding_jina on "public"."embeddings" 
using ivfflat (embedding_768 vector_cosine_ops) with (lists = 250)
where embedding_model = 'JINA';
