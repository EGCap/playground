drop function if exists nearest_documents_768;
drop function if exists nearest_documents_1024;
drop function if exists nearest_documents_1536;

create function nearest_documents_768 (
  query_embedding vector(768),
  query_embedding_model text,
  max_matches int
)
returns setof text
language plpgsql
as $$
begin
  return query
  select sub.document as document from (
    select
        embeddings.id,
        embeddings.document,
        1 - (embeddings.embedding_768 <=> query_embedding) as similarity
    from embeddings
    where embeddings.embedding_model = query_embedding_model
    order by (embeddings.embedding_768 <=> query_embedding) asc
    limit max_matches
  ) as sub;
end;
$$;

create function nearest_documents_1024 (
  query_embedding vector(1024),
  query_embedding_model text,
  max_matches int
)
returns setof text
language plpgsql
as $$
begin
  return query
  select sub.document as document from (
    select
        embeddings.id,
        embeddings.document,
        1 - (embeddings.embedding_1024 <=> query_embedding) as similarity
    from embeddings
    where embeddings.embedding_model = query_embedding_model
    order by (embeddings.embedding_1024 <=> query_embedding) asc
    limit max_matches
  ) as sub;
end;
$$;

create function nearest_documents_1536 (
  query_embedding vector(1536),
  query_embedding_model text,
  max_matches int
)
returns setof text
language plpgsql
as $$
begin
  return query
  select sub.document as document from (
    select
        embeddings.id,
        embeddings.document,
        1 - (embeddings.embedding_1536 <=> query_embedding) as similarity
    from embeddings
    where embeddings.embedding_model = query_embedding_model
    order by (embeddings.embedding_1536 <=> query_embedding) asc
    limit max_matches
  ) as sub;
end;
$$;

drop index if exists idx_embedding_wikipedia_open_ai;
drop index if exists idx_embedding_wikipedia_mpnet_base_v2;
drop index if exists idx_embedding_wikipedia_instructor_large;
