import { uploadEmbeddingsToSupabase } from "../clients/supabase";
import { EmbeddedWikiTextChunk, DATABASE } from "../types";

export const uploadEmbeddings = async (embeddedChunks: EmbeddedWikiTextChunk[], dataset: string, database: DATABASE) => {
    switch (database as DATABASE) {
        case DATABASE.SUPABASE:
            return uploadEmbeddingsToSupabase(embeddedChunks, dataset);
    }
}

export const fetchNearestDocuments = async (queryEmbedding: number[], dataset: string, database: DATABASE) => {
    return;
}
