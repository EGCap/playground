create index if not exists idx_embedding_wikipedia_instructor_large on "public"."embeddings" 
using ivfflat (embedding_768 vector_cosine_ops) with (lists = 200)
where dataset = 'WIKIPEDIA' and embedding_model = 'INSTRUCTOR_LARGE';
