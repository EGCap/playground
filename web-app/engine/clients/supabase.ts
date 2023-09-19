import { createClient } from '@supabase/supabase-js';
import {SUPABASE_URL, SUPABASE_SERVICE_KEY} from '../config'
import { DATASET, EMBEDDING_MODEL, EmbeddedTextChunk } from '../types';
import { getEmbeddingDimensionForModel } from '../utils/embedding';

type SupabaseDocument = {
    id: number,
    document: string,
    similarity: number,
}

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const SUPABASE_EMBEDDINGS_TABLE_NAME: string = 'embeddings'

export const uploadEmbeddingsToSupabase = async (
    embeddedTextChunks: EmbeddedTextChunk[],
    dataset: DATASET,
    embeddingModel: EMBEDDING_MODEL,
) => {
    // The column to insert the embedding into depends on the output dimension of the model used to generate the embedding.
    const embeddingDim = getEmbeddingDimensionForModel(embeddingModel)
    const embeddingKey: string = `embedding_${embeddingDim}`

    const uploadRows = embeddedTextChunks.map((embeddedTextChunk) => {
        return {
            'dataset': DATASET[dataset],
            'chunk_index': embeddedTextChunk.textChunk.chunkIndex,
            'document': embeddedTextChunk.textChunk.document.rawText,
            'embedding_model': EMBEDDING_MODEL[embeddingModel],
            [embeddingKey]: embeddedTextChunk.embedding,
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
        query_dataset: DATASET[dataset],
        query_embedding_model: EMBEDDING_MODEL[embeddingModel],
        similarity_threshold: threshold,
        max_matches: maxMatches,
    })

    return results.map((result: SupabaseDocument) => result.document)
}
