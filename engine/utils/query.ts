import { DATABASE, DATASET, EMBEDDING_MODEL } from "../types";
import { fetchNearestDocuments } from "./database";
import { getEmbedding } from "./embedding";

const DEFAULT_THRESHOLD: number = 0.8
const DEFAULT_MAX_MATCHES: number = 5

export const handleQuery = async (queryText: string) => {
    const model: EMBEDDING_MODEL = EMBEDDING_MODEL.OPEN_AI;

    const queryEmbedding = await getEmbedding(queryText, model);
    if (!queryEmbedding) {
        return [];
    }

    return await fetchNearestDocuments(
        queryEmbedding,
        DATASET.WIKIPEDIA,
        model,
        DEFAULT_THRESHOLD,
        DEFAULT_MAX_MATCHES,
        DATABASE.SUPABASE
    );
}
