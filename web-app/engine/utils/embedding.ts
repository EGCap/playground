import { getInstructorLargeEmbeddings, getMPNETBaseEmbeddings } from '../clients/baseten';
import { getCohereEmbeddings } from '../clients/cohere';
import { getBGELargeEmbeddings } from '../clients/huggingface';
import { getOpenAIEmbeddings } from '../clients/openai';
import { getImageBindEmbeddings } from '../clients/replicate';
import { getTogetherAIEmbeddings } from '../clients/togetherai'; // Added import for Together AI embeddings
import { EMBEDDING_MODEL, EmbeddedTextChunk, TextChunk } from '../types';

export const getEmbeddingDimensionForModel = (embeddingModel: EMBEDDING_MODEL) => {
    switch (embeddingModel as EMBEDDING_MODEL) {
        case EMBEDDING_MODEL.OPEN_AI:
            return 1536;
        case EMBEDDING_MODEL.IMAGEBIND:
            return 1024;
        case EMBEDDING_MODEL.MPNET_BASE_V2:
            return 768;
        case EMBEDDING_MODEL.BGE_LARGE_1_5:
            return 1024;
        case EMBEDDING_MODEL.INSTRUCTOR_LARGE:
            return 768;
        case EMBEDDING_MODEL.COHERE:
            return 1024;
        case EMBEDDING_MODEL.TOGETHER_AI: // Added case for Together AI
            return 2048; // Assuming the dimension based on the model name
    }
}

export const getEmbeddingsBatch = async (inputs: string[], embeddingModel: EMBEDDING_MODEL) => {
    for (let i = 0; i < 4; i++) {
        try {
            switch (embeddingModel as EMBEDDING_MODEL) {
                case EMBEDDING_MODEL.OPEN_AI:
                    return getOpenAIEmbeddings(inputs);
                case EMBEDDING_MODEL.IMAGEBIND:
                    return getImageBindEmbeddings(inputs);
                case EMBEDDING_MODEL.MPNET_BASE_V2:
                    return getMPNETBaseEmbeddings(inputs);
                case EMBEDDING_MODEL.BGE_LARGE_1_5:
                    return getBGELargeEmbeddings(inputs);
                case EMBEDDING_MODEL.INSTRUCTOR_LARGE:
                    return getInstructorLargeEmbeddings(inputs);
                case EMBEDDING_MODEL.COHERE:
                    return getCohereEmbeddings(inputs);
                case EMBEDDING_MODEL.TOGETHER_AI: // Added case for Together AI
                    return getTogetherAIEmbeddings(inputs).then(embeddings => {
                        console.log(`Successfully retrieved ${embeddings.length} embeddings from Together AI model`);
                        return embeddings;
                    });
            }
        }
        catch (e) {
            console.log(e);
            await new Promise(resolve => setTimeout(resolve, 4000**i));   
        }
    }
}

export const getEmbedding = async (input: string, embeddingModel: EMBEDDING_MODEL) => {
    const embeddings: number[][] = await getEmbeddingsBatch([input], embeddingModel);
    if (embeddings && embeddings.length > 0) {
        return embeddings[0];
    } else {
        return null;
    }
}

export const getEmbeddingWithTimeLimit = async (input: string, embeddingModel: EMBEDDING_MODEL, timeLimitInMilliseconds: number) => {
    const embeddingPromise = getEmbedding(input, embeddingModel);
    const timeLimitPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            resolve(null);
        }, timeLimitInMilliseconds);
    });
    const embedding = await Promise.race([embeddingPromise, timeLimitPromise]);
    return embedding as number[];
}

export const embedTextChunks = async (
    textChunks: TextChunk[], embeddingModel: EMBEDDING_MODEL, batchSize: number
) => {
    // Create the batches
    let i = 0;
    const startIdxes = [];
    while (i < textChunks.length) {
        startIdxes.push(i);
        i += batchSize;
    }

    // Create an array to store results
    const embeddedTextChunks: EmbeddedTextChunk[] = Array(textChunks.length).fill(null);

    // Process batches in parallel
    await Promise.all(startIdxes.map(async startIdx => {
        // Generate embeddings for the batch
        const endIdx = Math.min(startIdx + batchSize, textChunks.length);
        const embeddings = await getEmbeddingsBatch(
            textChunks.slice(startIdx, endIdx).map(textChunk => textChunk.textToEmbed),
            embeddingModel
        );

        // Update result array only if all embeddings succeeded
        if (embeddings && embeddings.length == (endIdx - startIdx)) {
            for (let idx = 0; idx < embeddings.length; idx++) {
                embeddedTextChunks[startIdx + idx] = {
                    textChunk: textChunks[startIdx + idx],
                    embedding: embeddings[idx]
                } as EmbeddedTextChunk;
            }
        }
    }));

    return embeddedTextChunks;
}