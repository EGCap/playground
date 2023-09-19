import { getBGELargeEmbeddings } from '../clients/huggingface';
import { getOpenAIEmbeddings } from '../clients/openai';
import { getImageBindEmbeddings, getMPNETBaseEmbeddings } from '../clients/replicate';
import { EMBEDDING_MODEL, EmbeddedTextChunk, TextChunk } from '../types';

export const getEmbeddingDimensionForModel = (embeddingModel: EMBEDDING_MODEL) => {
    switch (embeddingModel as EMBEDDING_MODEL) {
        case EMBEDDING_MODEL.OPEN_AI:
            return 1536;
        case EMBEDDING_MODEL.IMAGEBIND:
            return 1024;
        case EMBEDDING_MODEL.MPNET_BASE_V2:
            return 768;
        case EMBEDDING_MODEL.BGE_LARGE_1_5:
            return 1024;
    }
}

export const getEmbeddingsBatch = async (inputs: string[], embeddingModel: EMBEDDING_MODEL) => {
    for (let i = 0; i < 4; i++) {
        try {
            switch (embeddingModel as EMBEDDING_MODEL) {
                case EMBEDDING_MODEL.OPEN_AI:
                    return getOpenAIEmbeddings(inputs);
                case EMBEDDING_MODEL.IMAGEBIND:
                    return getImageBindEmbeddings(inputs);
                case EMBEDDING_MODEL.MPNET_BASE_V2:
                    return getMPNETBaseEmbeddings(inputs);
                case EMBEDDING_MODEL.BGE_LARGE_1_5:
                    return getBGELargeEmbeddings(inputs);
            }
        }
        catch (e) {
            console.log(e);
            await new Promise(resolve => setTimeout(resolve, 4000**i));   
        }
    }
}

export const getEmbedding = async (input: string, embeddingModel: EMBEDDING_MODEL) => {
    const embeddings: number[][] = await getEmbeddingsBatch([input], embeddingModel);
    if (embeddings && embeddings.length > 0) {
        return embeddings[0];
    } else {
        return null;
    }
}

export const embedTextChunks = async (
    textChunks: TextChunk[], embeddingModel: EMBEDDING_MODEL, batched: boolean = false
) => {
    if (batched) {
        const embeddings: number[][] = await getEmbeddingsBatch(
            textChunks.map(textChunk => textChunk.text),
            embeddingModel
        );
        
        // If 1 or more embeddings couldn't be calculated, fail the entire task.
        if (!embeddings || embeddings.length != textChunks.length) {
            return textChunks.map(textChunk => {
                return {
                    'textChunk': textChunk,
                    'embedding': [],
                } as EmbeddedTextChunk;
            })
        } else {
            return textChunks.map((textChunk, idx) => {
                return {
                    'textChunk': textChunk,
                    'embedding': embeddings[idx],
                } as EmbeddedTextChunk;
            })
        }
    } else {
        const embeddedChunks: EmbeddedTextChunk[] = await Promise.all(textChunks.map(async textChunk => {
            const embedding = await getEmbedding(textChunk.text, embeddingModel);
            return {
                textChunk: textChunk,
                embedding: embedding,
            } as EmbeddedTextChunk
        }));
        return embeddedChunks;
    }
}
