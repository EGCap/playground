import { JINA_API_KEY } from "../config";
import axios from 'axios';

type JinaAPIResponse = {
    object: string,
    embedding: number[][],
    index: number,
}

export const getJinaEmbeddings = async (inputs: string[]) => {
    const api_url = 'https://api.jina.ai/v1/embeddings';
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JINA_API_KEY}`,
    };
    const body = {
        input: inputs,
        model: 'jina-embeddings-v2-base-en',
    }

    const content = await axios.post(
        api_url,
        JSON.stringify(body),
        {headers: headers}
    );
    const apiResponse: JinaAPIResponse[] = content.data.data;
    return apiResponse.map(result => result.embedding);
}
