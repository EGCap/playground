import {
  DATABASE,
  DATASET,
  EMBEDDING_INPUT_TYPE,
  EMBEDDING_MODEL,
  LANGUAGE_MODEL,
  QueryData,
  QueryResponse,
  RERANKING_MODEL,
  RetrievedDocument,
} from "../types";
import { secondsFrom } from "./clock";
import { fetchNearestDocuments } from "./database";
import { getEmbeddingWithTimeLimit } from "./embedding";
import { getChatModelResponse } from "./inference";
import { rerankDocuments } from "./reranking";

// We wait 5 seconds for an embedding model response before timing out, due to cold start.
const EMBEDDING_MODEL_TIME_LIMIT: number = 5000;

export const handleQuery = async (
  queryText: string,
  embeddingModels: (EMBEDDING_MODEL | null)[],
  filterDatasets: DATASET[] | null,
  rerankingModel: RERANKING_MODEL,
  maxDocuments: number,
  generateAnswer: boolean = true,
) => {
  let data: QueryData[] = [];

  // If we will rerank, fetch 3N the number of documents before reranking down to top N.
  const numDocsToFetch = rerankingModel == RERANKING_MODEL.NONE ? maxDocuments : 3 * maxDocuments;
  
  await Promise.all(embeddingModels.map(async (embeddingModel) => {
    let documents: RetrievedDocument[] = [];
    let modelResponse: string = "";
    
    // Step 1: Fetch nearest documents using query embedding.
    if (embeddingModel) {
      const embeddingStartTime = Date.now();
      const queryEmbedding = await getEmbeddingWithTimeLimit(
        queryText, embeddingModel, EMBEDDING_INPUT_TYPE.QUERY, EMBEDDING_MODEL_TIME_LIMIT
      );
      console.log(`Retrieved query embedding from ${embeddingModel} in ${secondsFrom(embeddingStartTime)} seconds`);
      
      if (queryEmbedding) {
        try {
          const fetchDocsStartTime = Date.now();
          documents = await fetchNearestDocuments(
            queryEmbedding,
            embeddingModel,
            filterDatasets,
            numDocsToFetch,
            DATABASE.SUPABASE
          );
          console.log(`Retrieved nearest docs using ${embeddingModel} in ${secondsFrom(fetchDocsStartTime)} seconds`);
        } catch (err) {
          console.log("Failed to getNearestDocuments:", err);
        }
      }
    }

    // Step 2: Rerank the retrieved documents.
    if (rerankingModel != RERANKING_MODEL.NONE) {
      documents = await rerankDocuments(queryText, documents, rerankingModel, maxDocuments) || documents;
    }

    // Step 3: Generate an LLM response, if specified.
    if (generateAnswer) {
      const responseStartTime = Date.now();
      const languageModel: LANGUAGE_MODEL = LANGUAGE_MODEL.GPT_3_5;
      modelResponse = await getChatModelResponse(
        queryText,
        documents.map(doc => doc.document),
        languageModel
      );
      console.log(`Generated model response using ${embeddingModel} in ${secondsFrom(responseStartTime)} seconds`);
    }

    data.push({
      answer: {
        model: LANGUAGE_MODEL.GPT_3_5,
        response: modelResponse,
      },
      embeddingModel: embeddingModel,
      documents: documents,
    });
  }));


  const response = {
    query: queryText,
    data: data,
  } as QueryResponse;

  return response;
};
