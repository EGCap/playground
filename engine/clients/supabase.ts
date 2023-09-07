import { createClient } from '@supabase/supabase-js';
import {SUPABASE_URL, SUPABASE_SERVICE_KEY} from '../config'
import { EmbeddedWikiTextChunk } from '../types';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const SUPABASE_EMBEDDINGS_TABLE_NAME: string = 'ada_002_embeddings'

export const uploadEmbeddingsToSupabase = async (embeddedChunks: EmbeddedWikiTextChunk[], dataset: string) => {
    const uploadRows = embeddedChunks.map((embeddedChunk) => {
        return {
            dataset: dataset,
            text: embeddedChunk.textChunk.value.text,
            embedding: embeddedChunk.embedding,
        }
    });

    const { error } = await supabaseClient
        .from(SUPABASE_EMBEDDINGS_TABLE_NAME)
        .insert(uploadRows)
    
    return error;
}
