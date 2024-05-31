import { VOYAGE_API_KEY } from "../config";
import axios from 'axios';
import { EMBEDDING_INPUT_TYPE, RetrievedDocument } from "../types";

type VoyageEmbeddingResponse = {
    object: string,
    embedding: number[][],
    index: number,
}

type VoyageRerankingResponse = {
    relevance_score: number,
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
    const apiResponse: VoyageEmbeddingResponse[] = content.data.data;
    return apiResponse.map(result => result.embedding);
}

export const rerankDocumentsVoyage = async (
    query: string, documents: RetrievedDocument[], maxDocuments: number
) => {
    const api_url = 'https://api.voyageai.com/v1/rerank';
    const headers = {
        'content-type': 'application/json',
        'Authorization': `Bearer ${VOYAGE_API_KEY}`,
    };
    const body = {
      query: query,
      documents: documents.map(doc => doc.document),
      model: 'rerank-1',
      top_k: maxDocuments,
      return_documents: false,
    }

    const content = await axios.post(
        api_url,
        JSON.stringify(body),
        {headers: headers}
    );
    const apiResponse: VoyageRerankingResponse[] = content.data.data;
    let rerankedDocuments: RetrievedDocument[] = [];
    for (let i = 0; i < apiResponse.length; i++) {
        rerankedDocuments.push(documents[apiResponse[i].index]);
    }
    
    return rerankedDocuments;
};
