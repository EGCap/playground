import { COHERE_API_KEY } from "../config";
import axios from 'axios';
import { EMBEDDING_INPUT_TYPE } from "../types";

export const getCohereEmbeddings = async (inputs: string[], inputType: EMBEDDING_INPUT_TYPE) => {
    const api_url = 'https://api.cohere.ai/v1/embed';
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COHERE_API_KEY}`,
    };
    const body = {
        texts: inputs,
        model: 'embed-english-v3.0',
        truncate: 'END',
        input_type: inputType == EMBEDDING_INPUT_TYPE.QUERY ? 'search_query' : 'search_document'
    }

    const content = await axios.post(
        api_url,
        JSON.stringify(body),
        {headers: headers}
    );
    return content.data.embeddings;
}
