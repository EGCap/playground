import { COHERE_API_KEY } from "../config";
import axios from 'axios';

export const getCohereEmbeddings = async (inputs: string[]) => {
    const api_url = 'https://api.cohere.ai/v1/embed';
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COHERE_API_KEY}`,
    };
    const body = {
      texts: inputs,
      model: 'embed-english-light-v2.0',
      truncate: 'END',
    }

    const content = await axios.post(
        api_url,
        JSON.stringify(body),
        {headers: headers}
    );
    return content.data.embeddings;
}
