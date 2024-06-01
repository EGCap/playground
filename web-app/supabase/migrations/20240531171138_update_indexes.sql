drop index if exists idx_embedding_cohere;
create index if not exists idx_embedding_cohere on "public"."embeddings" 
using ivfflat (embedding_1024 vector_cosine_ops) with (lists = 250)
where embedding_model = 'COHERE' and dataset = 'WIKIPEDIA_CLIPPED';
