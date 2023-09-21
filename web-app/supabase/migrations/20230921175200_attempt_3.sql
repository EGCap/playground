drop function if exists nearest_documents_1536;

create function nearest_documents_1536 (
  query_embedding vector(1536),
  query_dataset text,
  query_embedding_model text,
  max_matches int
)
returns text[]
language sql stable
as $$
  select array_agg(document) from (
    select
        embeddings.id,
        embeddings.document,
        1 - (embeddings.embedding_1536 <=> query_embedding) as similarity
    from embeddings
    where
        embeddings.dataset = query_dataset
        and embeddings.embedding_model = query_embedding_model
    order by (embeddings.embedding_1536 <=> query_embedding) asc
    limit max_matches
  ) as sub;
$$;
