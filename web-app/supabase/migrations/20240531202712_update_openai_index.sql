drop index if exists idx_embedding_openai;
create index if not exists idx_embedding_openai_1536 on "public"."embeddings" 
using ivfflat (embedding_1536 vector_cosine_ops) with (lists = 250)
where embedding_model = 'OPEN_AI_1536';
