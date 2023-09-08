import { createClient } from '@supabase/supabase-js';
import {SUPABASE_URL, SUPABASE_SERVICE_KEY} from '../config'
import { DATASET, EMBEDDING_MODEL, EmbeddedWikiTextChunk } from '../types';

type SupabaseDocument = {
    id: number,
    document: Text,
    similarity: number,
}

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const SUPABASE_EMBEDDINGS_TABLE_NAME: string = 'embeddings'

export const uploadEmbeddingsToSupabase = async (
    embeddedChunks: EmbeddedWikiTextChunk[],
    dataset: DATASET,
    embeddingModel: EMBEDDING_MODEL,
) => {
    const uploadRows = embeddedChunks.map((embeddedChunk) => {
        return {
            dataset: DATASET[dataset],
            chunk_index: embeddedChunk.chunkIndex,
            document: embeddedChunk.textChunk.value.text,
            embedding_model: EMBEDDING_MODEL[embeddingModel],
            embedding_1536: embeddedChunk.embedding,
        }
    });

    const { error } = await supabaseClient
        .from(SUPABASE_EMBEDDINGS_TABLE_NAME)
        .upsert(
            uploadRows,
            {onConflict: 'dataset, chunk_index, embedding_model'}
        )
    
    return error;
}

export const getNearestDocumentsFromSupabase = async (
    queryEmbedding: number[],
    dataset: DATASET,
    embeddingModel: EMBEDDING_MODEL,
    threshold: number,
    maxMatches: number
)  => {
    const { data: results } = await supabaseClient.rpc('nearest_documents', {
        query_embedding: queryEmbedding,
        dataset: DATASET[dataset],
        embedding_model: EMBEDDING_MODEL[embeddingModel],
        similarity_threshold: threshold,
        max_matches: maxMatches,
    })

    return results.map((result: SupabaseDocument) => result.document)
}