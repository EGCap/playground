alter table "public"."embeddings" add embedding_3072 vector(3072);

alter table "public"."embeddings" drop constraint one_nonnull_embedding_v1;

alter table "public"."embeddings" add constraint one_nonnull_embedding_v2 check (
    (case when embedding_1536 is not null then 1 else 0 end) +
    (case when embedding_1024 is not null then 1 else 0 end) +
    (case when embedding_768 is not null then 1 else 0 end) = 1
);
