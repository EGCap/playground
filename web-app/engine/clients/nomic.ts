import { NOMIC_API_KEY } from "../config";
import axios from 'axios';
import { EMBEDDING_INPUT_TYPE } from "../types";


export const getNomicEmbeddings = async (inputs: string[], inputType: EMBEDDING_INPUT_TYPE) => {
    const api_url = 'https://api-atlas.nomic.ai/v1/embedding/text';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NOMIC_API_KEY}`,
    };
    const body = {
        texts: inputs,
        model: 'nomic-embed-text-v1',
        task_type: inputType == EMBEDDING_INPUT_TYPE.QUERY ? 'search_query' : 'search_document',
    }

    const content = await axios.post(
        api_url,
        JSON.stringify(body),
        {headers: headers}
    );
    return content.data.embeddings;
}
