alter table "public"."embeddings" add chunk_index bigint not null;

create unique index if not exists idx_unique_embedding_per_dataset_document_model on "public"."embeddings" (dataset, chunk_index, embedding_model);
