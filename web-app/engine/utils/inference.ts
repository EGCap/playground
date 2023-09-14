import { getOpenAIChatCompletion } from "../clients/openai";
import { LANGUAGE_MODEL } from "../types";

export const getChatModelResponse = async (query: string, documents: string[], modelType: LANGUAGE_MODEL) => {
    for (let i = 0; i < 4; i++) {
        try {
            switch (modelType as LANGUAGE_MODEL) {
                case LANGUAGE_MODEL.GPT_3_5:
                    return getOpenAIChatCompletion(query, documents);
            }
        }
        catch (e) {
            console.log(e);
            await new Promise(resolve => setTimeout(resolve, 4000**i));   
        }
    }
}
