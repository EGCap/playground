import { DATABASE, DATASET, EMBEDDING_MODEL, LANGUAGE_MODEL, QueryResponse } from "../types";
import { fetchNearestDocuments } from "./database";
import { getEmbedding } from "./embedding";
import { getChatModelResponse } from "./inference";

const DEFAULT_THRESHOLD: number = 0.7
const DEFAULT_MAX_MATCHES: number = 5

export const handleQuery = async (queryText: string, fetchDocuments: boolean = true) => {
    let documents: string[] = []

    if (fetchDocuments) {
        const embeddingModel: EMBEDDING_MODEL = EMBEDDING_MODEL.OPEN_AI;
        const queryEmbedding = await getEmbedding(queryText, embeddingModel);

        if (queryEmbedding) {
            documents = await fetchNearestDocuments(
                queryEmbedding,
                DATASET.WIKIPEDIA,
                embeddingModel,
                DEFAULT_THRESHOLD,
                DEFAULT_MAX_MATCHES,
                DATABASE.SUPABASE
            );
        }
    }

    const languageModel: LANGUAGE_MODEL = LANGUAGE_MODEL.GPT_3_5
    const modelResponse = await getChatModelResponse(queryText, documents, languageModel);

    return {
        query: queryText,
        modelResponse: modelResponse,
        retrievedDocuments: documents,
    } as QueryResponse;
}
