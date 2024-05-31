import { JINA_API_KEY } from "../config";
import axios from 'axios';
import { RetrievedDocument } from "../types";

type JinaEmbeddingResponse = {
    object: string,
    embedding: number[][],
    index: number,
}

type JinaRerankingResponse = {
    relevance_score: number,
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
    const apiResponse: JinaEmbeddingResponse[] = content.data.data;
    return apiResponse.map(result => result.embedding);
}

export const rerankDocumentsJina = async (
    query: string, documents: RetrievedDocument[], maxDocuments: number
) => {
    const api_url = 'https://api.jina.ai/v1/rerank';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JINA_API_KEY}`,
    };
    const body = {
      query: query,
      documents: documents.map(doc => doc.document),
      model: 'jina-reranker-v1-base-en',
      top_n: maxDocuments,
      return_documents: false,
    }

    const content = await axios.post(
        api_url,
        JSON.stringify(body),
        {headers: headers}
    );
    const apiResponse: JinaRerankingResponse[] = content.data.results;
    let rerankedDocuments: RetrievedDocument[] = [];
    for (let i = 0; i < apiResponse.length; i++) {
        rerankedDocuments.push(documents[apiResponse[i].index]);
    }
    
    return rerankedDocuments;
};
