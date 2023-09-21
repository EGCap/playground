import { DATABASE, DATASET, EmbeddedTextChunk, TextChunk, enabledEmbeddingModels } from "../types";
import { uploadEmbeddings } from "./database";
import { getEmbedding } from "./embedding";

export const handleUpload = async (text: string) => {
  let success: boolean = true;

  // Embed and upload text using every enabled embedding model.
  await Promise.all(enabledEmbeddingModels.map(async (embeddingModel) => {
    // Step 1: try to embed the text.
    const textEmbedding = await getEmbedding(text, embeddingModel);
    if (!textEmbedding) {
      console.log(`Embedding via ${embeddingModel} failed`);
      success = false;
      return;
    }

    // Step 2: try to upload the text and its embedding.
    const embeddedTextChunk = {
      textChunk: {
        textToEmbed: text,
        chunkIndex: null,
        document: {
          rawText: text,
          url: null,
          title: null,
        }
      } as TextChunk,
      embedding: textEmbedding,
    } as EmbeddedTextChunk;
    const error = await uploadEmbeddings([embeddedTextChunk], DATASET.CUSTOM, embeddingModel, DATABASE.SUPABASE);
    if (error) {
      console.error(`Upload for ${embeddingModel} failed`);
      success = false;
    }
  }));
  
  return success;
};
