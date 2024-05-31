import { COHERE_API_KEY } from "../config";
import axios from 'axios';
import { EMBEDDING_INPUT_TYPE, RetrievedDocument } from "../types";

type CohereRerankingResponse = {
    relevance_score: number,
    index: number,
}

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

export const rerankDocumentsCohere = async (
    query: string, documents: RetrievedDocument[], maxDocuments: number
) => {
    const api_url = 'https://api.cohere.com/v1/rerank';
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COHERE_API_KEY}`,
    };
    const body = {
      query: query,
      documents: documents.map(doc => doc.document),
      model: 'rerank-english-v3.0',
      top_n: maxDocuments,
      return_documents: false,
    }

    const content = await axios.post(
        api_url,
        JSON.stringify(body),
        {headers: headers}
    );
    const apiResponse: CohereRerankingResponse[] = content.data.results;
    let rerankedDocuments: RetrievedDocument[] = [];
    for (let i = 0; i < apiResponse.length; i++) {
        rerankedDocuments.push(documents[apiResponse[i].index]);
    }
    
    return rerankedDocuments;
};
