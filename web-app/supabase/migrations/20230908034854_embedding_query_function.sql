create or replace function nearest_documents (
  query_embedding vector,
  dataset text,
  embedding_model text,
  similarity_threshold float,
  max_matches int
)
returns table (
  id bigint,
  document text,
  similarity float
)
language sql stable
as $$
  select
    embeddings.id,
    embeddings.document,
    -- eventually we'll need a coalesce here on the various dimensional embedding vectors
    1 - (embeddings.embedding_1536 <=> query_embedding) as similarity
  from "public"."embeddings" as embeddings
  where embeddings.dataset = dataset
  and embeddings.embedding_model = embedding_model
  and 1 - (embeddings.embedding_1536 <=> query_embedding) >= similarity_threshold
  order by similarity desc
  limit max_matches;
$$;

create index on public.embeddings using ivfflat (embedding_1536 vector_cosine_ops)
with (lists = 500);
