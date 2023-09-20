create or replace function nearest_documents_1024 (
  query_embedding vector(1024),
  query_dataset text,
  query_embedding_model text,
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
    1 - (embeddings.embedding_1024 <=> query_embedding) as similarity
  from embeddings
  where 1 - (embeddings.embedding_1024 <=> query_embedding) > similarity_threshold
    and embeddings.embedding_model = query_embedding_model
  order by similarity desc
  limit max_matches;
$$;


create or replace function nearest_documents_768 (
  query_embedding vector(768),
  query_dataset text,
  query_embedding_model text,
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
    1 - (embeddings.embedding_768 <=> query_embedding) as similarity
  from embeddings
  where 1 - (embeddings.embedding_768 <=> query_embedding) > similarity_threshold
    and embeddings.embedding_model = query_embedding_model
  order by similarity desc
  limit max_matches;
$$;
