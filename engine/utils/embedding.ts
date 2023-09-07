import { getOpenAIEmbedding } from '../clients/openai';
import { EMBEDDING_MODEL_TYPE } from '../types';

export const getEmbedding = async (input: string, modelType: EMBEDDING_MODEL_TYPE) => {
    for (let i = 0; i < 4; i++) {
        try {
            switch (modelType as EMBEDDING_MODEL_TYPE) {
                case EMBEDDING_MODEL_TYPE.OPEN_AI:
                    return getOpenAIEmbedding(input);
            }
        }
        catch (e) {
            console.log(e);
            await new Promise(resolve => setTimeout(resolve, 4000**i));   
        }
    }
}
