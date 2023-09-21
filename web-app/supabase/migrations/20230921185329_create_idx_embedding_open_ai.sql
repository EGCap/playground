create index if not exists idx_embedding_open_ai on "public"."embeddings" 
using ivfflat (embedding_1536 vector_cosine_ops) with (lists = 250)
where embedding_model = 'OPEN_AI';