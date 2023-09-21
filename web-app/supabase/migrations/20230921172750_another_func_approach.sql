drop function if exists nearest_documents_1536_opt;
drop function if exists nearest_documents_1536;

create function nearest_documents_1536 (
  query_embedding vector(1536),
  query_dataset text,
  query_embedding_model text,
  max_matches int
)
returns table (
  document text
)
language sql stable
as $$
  select embeddings.document
  from embeddings
  where
    embeddings.dataset = query_dataset
    and embeddings.embedding_model = query_embedding_model
  order by (embeddings.embedding_1536 <=> query_embedding) asc
  limit max_matches;
$$;
