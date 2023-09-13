import { getOpenAIEmbedding } from '../clients/openai';
import { EMBEDDING_MODEL } from '../types';

export const getEmbedding = async (input: string, modelType: EMBEDDING_MODEL) => {
    for (let i = 0; i < 4; i++) {
        try {
            switch (modelType as EMBEDDING_MODEL) {
                case EMBEDDING_MODEL.OPEN_AI:
                    return getOpenAIEmbedding(input);
            }
        }
        catch (e) {
            console.log(e);
            await new Promise(resolve => setTimeout(resolve, 4000**i));   
        }
    }
}
