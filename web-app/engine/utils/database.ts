import { getNearestDocumentsFromSupabase, uploadEmbeddingsToSupabase } from "../clients/supabase";
import { EmbeddedWikiTextChunk, DATABASE, EMBEDDING_MODEL, DATASET } from "../types";

export const uploadEmbeddings = async (
    embeddedChunks: EmbeddedWikiTextChunk[],
    dataset: DATASET,
    embeddingModel: EMBEDDING_MODEL,
    database: DATABASE
) => {
    switch (database as DATABASE) {
        case DATABASE.SUPABASE:
            return await uploadEmbeddingsToSupabase(embeddedChunks, dataset, embeddingModel);
    }
}

export const fetchNearestDocuments = async (
    queryEmbedding: number[],
    dataset: DATASET,
    embeddingModel: EMBEDDING_MODEL,
    threshold: number,
    maxMatches: number,
    database: DATABASE
) => {
    switch (database as DATABASE) {
        case DATABASE.SUPABASE:
            return await getNearestDocumentsFromSupabase(queryEmbedding, dataset, embeddingModel, threshold, maxMatches);
    }
}
