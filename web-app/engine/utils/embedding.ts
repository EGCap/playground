import { getBGELargeEmbedding } from '../clients/huggingface';
import { getOpenAIEmbedding } from '../clients/openai';
import { getImageBindEmbedding, getMPNETBaseEmbedding } from '../clients/replicate';
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

export const getEmbedding = async (input: string, modelType: EMBEDDING_MODEL) => {
    for (let i = 0; i < 4; i++) {
        try {
            switch (modelType as EMBEDDING_MODEL) {
                case EMBEDDING_MODEL.OPEN_AI:
                    return getOpenAIEmbedding(input);
                case EMBEDDING_MODEL.IMAGEBIND:
                    return getImageBindEmbedding(input);
                case EMBEDDING_MODEL.MPNET_BASE_V2:
                    return getMPNETBaseEmbedding(input);
                case EMBEDDING_MODEL.BGE_LARGE_1_5:
                    return getBGELargeEmbedding(input);
            }
        }
        catch (e) {
            console.log(e);
            await new Promise(resolve => setTimeout(resolve, 4000**i));   
        }
    }
}

export const embedTextChunks = async (
    textChunks: TextChunk[], embeddingModel: EMBEDDING_MODEL, batched: boolean = false
) => {
    if (batched) {
        return [];
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
