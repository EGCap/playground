alter table embeddings alter chunk_index drop not null;
alter table embeddings add constraint check_chunk_index_non_null_for_non_custom_datasets
check (
  (dataset <> 'CUSTOM' and chunk_index is not null) or
  (dataset = 'CUSTOM' and chunk_index is null)
);
