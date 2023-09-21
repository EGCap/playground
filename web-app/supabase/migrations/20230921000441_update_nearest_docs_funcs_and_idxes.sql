drop function if exists nearest_documents;

create or replace function nearest_documents_768 (
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
  order by (embeddings.embedding_1536 <=> query_embedding) asc
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
  order by (embeddings.embedding_1536 <=> query_embedding) asc
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

drop index if exists idx_embedding_768_ivfflat_v1;
drop index if exists idx_embedding_1024_ivfflat_v1;
drop index if exists idx_embedding_1536_ivfflat_v1;

create index if not exists idx_embedding_wikipedia_open_ai on "public"."embeddings" 
using ivfflat (embedding_1536 vector_cosine_ops) with (lists = 200)
where dataset = 'WIKIPEDIA' and embedding_model = 'OPEN_AI';

SET ivfflat.probes = 10;
