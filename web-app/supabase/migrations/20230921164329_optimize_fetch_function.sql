create function nearest_documents_768_opt (
  query_embedding vector(768),
  query_dataset text,
  query_embedding_model text,
  max_matches int
)
returns setof text
language sql stable
as $$
  select document from nearest_documents_768(query_embedding, query_dataset, query_embedding_model, max_matches)
  order by similarity
$$;

create function nearest_documents_1024_opt (
  query_embedding vector(1024),
  query_dataset text,
  query_embedding_model text,
  max_matches int
)
returns setof text
language sql stable
as $$
  select document from nearest_documents_1024(query_embedding, query_dataset, query_embedding_model, max_matches)
  order by similarity
$$;

create function nearest_documents_1536_opt (
  query_embedding vector(1536),
  query_dataset text,
  query_embedding_model text,
  max_matches int
)
returns setof text
language sql stable
as $$
  select document from nearest_documents_1536(query_embedding, query_dataset, query_embedding_model, max_matches)
  order by similarity
$$;
