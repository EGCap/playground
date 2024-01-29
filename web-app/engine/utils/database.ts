import { getNearestDocumentsFromNeon, uploadEmbeddingsToNeon } from "../clients/neon";
import { getNearestDocumentsFromSupabase, uploadEmbeddingsToSupabase } from "../clients/supabase";
import { EmbeddedTextChunk, DATABASE, EMBEDDING_MODEL, DATASET } from "../types";

export const uploadEmbeddings = async (
    embeddedChunks: EmbeddedTextChunk[],
    dataset: DATASET,
    embeddingModel: EMBEDDING_MODEL,
    database: DATABASE
) => {
    switch (database as DATABASE) {
        case DATABASE.SUPABASE:
            return await uploadEmbeddingsToSupabase(embeddedChunks, dataset, embeddingModel);
        case DATABASE.NEON:
            return await uploadEmbeddingsToNeon(embeddedChunks, dataset, embeddingModel);
    }
}

export const fetchNearestDocuments = async (
    queryEmbedding: number[],
    embeddingModel: EMBEDDING_MODEL,
    filterDatasets: DATASET[] | null,
    maxMatches: number,
    database: DATABASE
) => {
    switch (database as DATABASE) {
        case DATABASE.SUPABASE:
            return await getNearestDocumentsFromSupabase(queryEmbedding, embeddingModel, filterDatasets, maxMatches);
        case DATABASE.NEON:
            return await getNearestDocumentsFromNeon(queryEmbedding, embeddingModel, filterDatasets, maxMatches);
    }
}
