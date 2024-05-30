create function nearest_documents_3072 (
  query_embedding vector(3072),
  query_embedding_model text,
  max_matches int
)
returns table (
    dataset text,
    document text,
    similarity float
)
language plpgsql
as $$
begin
  return query
  select
    embeddings.dataset,
    embeddings.document,
    1 - (embeddings.embedding_3072 <=> query_embedding) as similarity
  from embeddings
  where embeddings.embedding_model = query_embedding_model
  order by (embeddings.embedding_3072 <=> query_embedding) asc
  limit max_matches;
end;
$$;

create function nearest_documents_for_datasets_3072 (
  query_embedding vector(3072),
  query_embedding_model text,
  query_datasets text[],
  max_matches int
)
returns table (
    dataset text,
    document text,
    similarity float
)
language plpgsql
as $$
begin
  return query
  select
    embeddings.dataset,
    embeddings.document,
    1 - (embeddings.embedding_3072 <=> query_embedding) as similarity
  from embeddings
  where embeddings.embedding_model = query_embedding_model
  and (query_datasets is null or embeddings.dataset = ANY(query_datasets))
  order by (embeddings.embedding_3072 <=> query_embedding) asc
  limit max_matches;
end;
$$;
