alter table "public"."embeddings" add embedding_1024 vector(1024);
alter table "public"."embeddings" add embedding_768 vector(768);

alter table "public"."embeddings" add constraint one_nonnull_embedding_v1 check (
    (case when embedding_1536 is not null then 1 else 0 end) +
    (case when embedding_1024 is not null then 1 else 0 end) +
    (case when embedding_768 is not null then 1 else 0 end) = 1
);

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
    1 - (coalesce(embeddings.embedding_1536, embeddings.embedding_1024, embeddings.embedding_768) <=> query_embedding) as similarity
  from "public"."embeddings" as embeddings
  where
    embeddings.dataset = dataset
    and embeddings.embedding_model = embedding_model
    and 1 - (coalesce(embeddings.embedding_1536, embeddings.embedding_1024, embeddings.embedding_768) <=> query_embedding) >= similarity_threshold
  order by similarity desc
  limit max_matches;
$$;

alter index if exists embeddings_embedding_1536_idx rename to idx_embedding_1536_ivfflat_v1;
create index if not exists idx_embedding_1024_ivfflat_v1 on "public"."embeddings" using ivfflat (embedding_1024 vector_cosine_ops) with (lists = 500);
create index if not exists idx_embedding_768_ivfflat_v1 on "public"."embeddings" using ivfflat (embedding_768 vector_cosine_ops) with (lists = 500);
