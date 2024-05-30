import { VOYAGE_API_KEY } from "../config";
import axios from 'axios';
import { EMBEDDING_INPUT_TYPE } from "../types";

type VoyageAPIResponse = {
    object: string,
    embedding: number[][],
    index: number,
}

export const getVoyageEmbeddings = async (
    inputs: string[], inputType: EMBEDDING_INPUT_TYPE
) => {
    const api_url = 'https://api.voyageai.com/v1/embeddings';
    const headers = {
        'content-type': 'application/json',
        'Authorization': `Bearer ${VOYAGE_API_KEY}`,
    };
    const body = {
      input: inputs,
      model: 'voyage-large-2-instruct',
      input_type: inputType == EMBEDDING_INPUT_TYPE.QUERY ? 'query' : 'document'
    }

    const content = await axios.post(
        api_url,
        JSON.stringify(body),
        {headers: headers}
    );
    const apiResponse: VoyageAPIResponse[] = content.data.data;
    return apiResponse.map(result => result.embedding);
}
