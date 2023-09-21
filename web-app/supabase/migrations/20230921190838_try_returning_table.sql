drop function if exists nearest_documents_1536;

create function nearest_documents_1536 (
  query_embedding vector(1536),
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
    1 - (embeddings.embedding_1536 <=> query_embedding) as similarity
  from embeddings
  where embeddings.embedding_model = query_embedding_model
  order by (embeddings.embedding_1536 <=> query_embedding) asc
  limit max_matches;
end;
$$;
