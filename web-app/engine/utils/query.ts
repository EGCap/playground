import { DATABASE, DATASET, EMBEDDING_MODEL, LANGUAGE_MODEL, QueryData, QueryResponse } from "../types";
import { fetchNearestDocuments } from "./database";
import { getEmbedding } from "./embedding";
import { getChatModelResponse } from "./inference";

const DEFAULT_THRESHOLD: number = 0.7
const DEFAULT_MAX_MATCHES: number = 5

export const handleQuery = async (queryText: string, embeddingModel: EMBEDDING_MODEL, generateAnswer: boolean = true) => {
    let data: QueryData[] = [];
    let documents: string[] = [];
    let modelResponse: string = "";

    const queryEmbedding = await getEmbedding(queryText, embeddingModel);

    if (queryEmbedding) {
        try{
            documents = await fetchNearestDocuments(
                queryEmbedding,
                DATASET.WIKIPEDIA,
                embeddingModel,
                DEFAULT_THRESHOLD,
                DEFAULT_MAX_MATCHES,
                DATABASE.SUPABASE
            );
        }
        catch(err){
            console.log(err);
        }
    }
    
    if (generateAnswer) {
        const languageModel: LANGUAGE_MODEL = LANGUAGE_MODEL.GPT_3_5
        modelResponse = await getChatModelResponse(queryText, documents, languageModel);
    }

    data.push({
        answer: {
            model: LANGUAGE_MODEL.GPT_3_5,
            response: modelResponse,
        },
        embeddingModel: embeddingModel,
        documents: documents.map((doc) => {
            return {
                value: doc,
            }
        })
    });
    
    const response = {
        query: queryText,
        data: data,
    } as QueryResponse;

    return response;
}
