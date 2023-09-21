drop function nearest_documents_768;
drop function nearest_documents_1024;
drop function nearest_documents_1536;

create function nearest_documents_768 (
  query_embedding vector(768),
  query_dataset text,
  query_embedding_model text,
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
  where
    embeddings.dataset = query_dataset
    and embeddings.embedding_model = query_embedding_model
  order by (embeddings.embedding_768 <=> query_embedding) asc
  limit max_matches;
$$;

create or replace function nearest_documents_1024 (
  query_embedding vector(1024),
  query_dataset text,
  query_embedding_model text,
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
  where
    embeddings.dataset = query_dataset
    and embeddings.embedding_model = query_embedding_model
  order by (embeddings.embedding_1024 <=> query_embedding) asc
  limit max_matches;
$$;

create or replace function nearest_documents_1536 (
  query_embedding vector(1536),
  query_dataset text,
  query_embedding_model text,
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
    1 - (embeddings.embedding_1536 <=> query_embedding) as similarity
  from embeddings
  where
    embeddings.dataset = query_dataset
    and embeddings.embedding_model = query_embedding_model
  order by (embeddings.embedding_1536 <=> query_embedding) asc
  limit max_matches;
$$;
