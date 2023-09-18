drop function if exists nearest_documents;

create or replace function nearest_documents (
    query_embedding vector,
    query_dataset text,
    query_embedding_model text,
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
    with filtered_rows as (
        select
            embeddings.id,
            embeddings.document,
            case
                when vector_dims(query_embedding) = 1536 then embeddings.embedding_1536
                when vector_dims(query_embedding) = 1024 then embeddings.embedding_1024
                when vector_dims(query_embedding) = 768 then embeddings.embedding_768
                else null
            end as embedding_vec
        from "public"."embeddings" as embeddings
        where
            embeddings.dataset = query_dataset
            and embeddings.embedding_model = query_embedding_model
    )
    select
        filtered_rows.id,
        filtered_rows.document,
        1 - coalesce((filtered_rows.embedding_vec <=> query_embedding), 1) as similarity
    from filtered_rows
    where
        1 - coalesce((filtered_rows.embedding_vec <=> query_embedding), 1) >= similarity_threshold
    order by similarity desc
    limit max_matches;
$$;
