create index if not exists idx_embedding_nomic on "public"."embeddings" 
using ivfflat (embedding_768 vector_cosine_ops) with (lists = 250)
where embedding_model = 'NOMIC';
