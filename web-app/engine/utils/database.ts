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
    }
}

export const fetchNearestDocuments = async (
    queryEmbedding: number[],
    embeddingModel: EMBEDDING_MODEL,
    maxMatches: number,
    database: DATABASE
) => {
    switch (database as DATABASE) {
        case DATABASE.SUPABASE:
            return await getNearestDocumentsFromSupabase(queryEmbedding, embeddingModel, maxMatches);
    }
}
