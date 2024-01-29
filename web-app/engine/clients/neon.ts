import { neon } from '@neondatabase/serverless';
import { NEON_URL } from "../config";
import { DATASET, EMBEDDING_MODEL, EmbeddedTextChunk } from '../types';
import { getEmbeddingDimensionForModel } from '../utils/embedding';

const neonClient = neon(NEON_URL);
const NEON_EMBEDDINGS_TABLE_NAME: string = "public.embeddings";

export const uploadEmbeddingsToNeon = async (
  embeddedTextChunks: EmbeddedTextChunk[],
  dataset: DATASET,
  embeddingModel: EMBEDDING_MODEL
) => {
  // The column to insert the embedding into depends on the output dimension of the model used to generate the embedding.
  const embeddingDim = getEmbeddingDimensionForModel(embeddingModel);
  const embeddingKey: string = `embedding_${embeddingDim}`;

  const valuesToInsert: string = embeddedTextChunks.map(
    chunk => `(${DATASET[dataset]}, ${chunk.textChunk.chunkIndex}, '${chunk.textChunk.document.rawText}', ${EMBEDDING_MODEL[embeddingModel]}, '[${chunk.embedding}]')`
  ).join(",\n");

  console.log(valuesToInsert);

  const response = await neonClient`
  INSERT INTO ${NEON_EMBEDDINGS_TABLE_NAME} (dataset, chunk_index, document, embedding_model, ${embeddingKey}) VALUES
  ${valuesToInsert}
  ON CONFLICT (dataset, chunk_index, embedding_model)
  DO UPDATE SET (dataset, chunk_index, document, embedding_model, ${embeddingKey}) = 
  (EXCLUDED.dataset, EXCLUDED.chunk_index, EXCLUDED.document. EXCLUDED.embedding_model, EXCLUDED.${embeddingKey});
  `;
  console.log(response);
}

export const getNearestDocumentsFromNeon = async (
  queryEmbedding: number[],
  embeddingModel: EMBEDDING_MODEL,
  filterDatasets: DATASET[] | null,
  maxMatches: number
) => {
  console.log("to be implemented");
}
