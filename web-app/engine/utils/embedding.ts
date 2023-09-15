import { getBGELargeEmbedding } from '../clients/huggingface';
import { getOpenAIEmbedding } from '../clients/openai';
import { getImageBindEmbedding, getMPNETBaseEmbedding } from '../clients/replicate';
import { EMBEDDING_MODEL } from '../types';

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
