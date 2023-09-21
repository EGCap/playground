create index if not exists idx_embedding_mpnet_base_v2 on "public"."embeddings" 
using ivfflat (embedding_768 vector_cosine_ops) with (lists = 250)
where embedding_model = 'MPNET_BASE_V2';