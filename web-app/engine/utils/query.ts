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

  // If we will rerank, fetch 2N the number of documents before reranking.
  const numDocsToFetch = rerankingModel == RERANKING_MODEL.NONE ? maxDocuments : 2 * maxDocuments;
  
  await Promise.all(embeddingModels.map(async (embeddingModel) => {
    let documents: RetrievedDocument[] = [];
    let modelResponse: string = "";
    if (embeddingModel) {
      const embeddingStartTime = Date.now();
      const queryEmbedding = await getEmbeddingWithTimeLimit(
        queryText, embeddingModel, EMBEDDING_INPUT_TYPE.QUERY, EMBEDDING_MODEL_TIME_LIMIT
      );
      console.log(`Retrieved query embedding from ${embeddingModel} in ${secondsFrom(embeddingStartTime)} seconds`);
      
      if (queryEmbedding) {
        try {
          const fetchDocsStartTime = Date.now();
          const fetchedDocuments = await fetchNearestDocuments(
            queryEmbedding,
            embeddingModel,
            filterDatasets,
            numDocsToFetch,
            DATABASE.SUPABASE
          );
          documents = fetchedDocuments;
          console.log(`Retrieved nearest docs using ${embeddingModel} in ${secondsFrom(fetchDocsStartTime)} seconds`);
        } catch (err) {
          console.log("Failed to getNearestDocuments:", err);
        }
      }
    }

    if (rerankingModel != RERANKING_MODEL.NONE) {

    }

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
