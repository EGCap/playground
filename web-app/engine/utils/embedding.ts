import { getInstructorLargeEmbeddings, getMPNETBaseEmbeddings } from '../clients/baseten';
import { getCohereEmbeddings } from '../clients/cohere';
import { getBGELargeEmbeddings } from '../clients/huggingface';
import { getJinaEmbeddings } from '../clients/jina';
import { getNomicEmbeddings } from '../clients/nomic';
import { getOpenAIEmbeddings } from '../clients/openai';
import { getImageBindEmbeddings } from '../clients/replicate';
import { getVoyageEmbeddings } from '../clients/voyage';
import { EMBEDDING_MODEL, EmbeddedTextChunk, EMBEDDING_INPUT_TYPE, TextChunk } from '../types';

export const getEmbeddingDimensionForModel = (embeddingModel: EMBEDDING_MODEL) => {
    switch (embeddingModel as EMBEDDING_MODEL) {
        case EMBEDDING_MODEL.OPEN_AI:
            return 3072;
        case EMBEDDING_MODEL.OPEN_AI_1536:
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
        case EMBEDDING_MODEL.VOYAGE:
            return 1024;
        case EMBEDDING_MODEL.JINA:
            return 768;
        case EMBEDDING_MODEL.NOMIC:
            return 768;
        
    }
}

export const getEmbeddingsBatch = async (
    inputs: string[],
    embeddingModel: EMBEDDING_MODEL,
    inputType: EMBEDDING_INPUT_TYPE,
) => {
    for (let i = 0; i < 4; i++) {
        try {
            switch (embeddingModel as EMBEDDING_MODEL) {
                case EMBEDDING_MODEL.OPEN_AI:
                    return getOpenAIEmbeddings(inputs);
                case EMBEDDING_MODEL.OPEN_AI_1536:
                    return getOpenAIEmbeddings(inputs, 1536);
                case EMBEDDING_MODEL.IMAGEBIND:
                    return getImageBindEmbeddings(inputs);
                case EMBEDDING_MODEL.MPNET_BASE_V2:
                    return getMPNETBaseEmbeddings(inputs);
                case EMBEDDING_MODEL.BGE_LARGE_1_5:
                    return getBGELargeEmbeddings(inputs);
                case EMBEDDING_MODEL.INSTRUCTOR_LARGE:
                    return getInstructorLargeEmbeddings(inputs);
                case EMBEDDING_MODEL.COHERE:
                    return getCohereEmbeddings(inputs, inputType);
                case EMBEDDING_MODEL.VOYAGE:
                    return getVoyageEmbeddings(inputs, inputType);
                case EMBEDDING_MODEL.JINA:
                    return getJinaEmbeddings(inputs);
                case EMBEDDING_MODEL.NOMIC:
                    return getNomicEmbeddings(inputs, inputType);
            }
        }
        catch (e) {
            console.log(e);
            await new Promise(resolve => setTimeout(resolve, 4000**i));   
        }
    }
}

export const getEmbedding = async (
    input: string,
    embeddingModel: EMBEDDING_MODEL,
    inputType: EMBEDDING_INPUT_TYPE,
) => {
    const embeddings: number[][] = await getEmbeddingsBatch([input], embeddingModel, inputType);
    if (embeddings && embeddings.length > 0) {
        return embeddings[0];
    } else {
        return null;
    }
}

export const getEmbeddingWithTimeLimit = async (
    input: string,
    embeddingModel: EMBEDDING_MODEL,
    inputType: EMBEDDING_INPUT_TYPE,
    timeLimitInMilliseconds: number,
) => {
    const embeddingPromise = getEmbedding(input, embeddingModel, inputType);
    const timeLimitPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            resolve(null);
        }, timeLimitInMilliseconds);
    });
    const embedding = await Promise.race([embeddingPromise, timeLimitPromise]);
    return embedding as number[];
}

export const embedTextChunks = async (
    textChunks: TextChunk[],
    embeddingModel: EMBEDDING_MODEL,
    inputType: EMBEDDING_INPUT_TYPE,
    batchSize: number,
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
            embeddingModel,
            inputType,
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
