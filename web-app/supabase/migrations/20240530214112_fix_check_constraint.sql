alter table "public"."embeddings" drop constraint one_nonnull_embedding_v2;

alter table "public"."embeddings" add constraint one_nonnull_embedding_v3 check (
    (case when embedding_3072 is not null then 1 else 0 end) +
    (case when embedding_1536 is not null then 1 else 0 end) +
    (case when embedding_1024 is not null then 1 else 0 end) +
    (case when embedding_768 is not null then 1 else 0 end) = 1
);