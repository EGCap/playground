export type TextChunk = {
    textToEmbed: string,
    chunkIndex: number,
    document: {
        rawText: string,
        title: string | null,
        url: string | null,
    }
}

export type EmbeddedTextChunk = {
    textChunk: TextChunk,
    embedding: number[],
}

export enum DATASET {
    WIKIPEDIA = 'WIKIPEDIA'
}

export enum DATABASE {
    SUPABASE = 'SUPABASE'
}

export enum EMBEDDING_MODEL {
    // OpenAI's hosted text-embedding-ada-002 model.
    OPEN_AI = 'OPEN_AI', // dim: 1536

    // Models hosted on HuggingFace, taken from the MTEB leaderboard.
    BGE_LARGE_1_5 = 'BGE_LARGE_1_5', // dim: 1024

    // Models hosted on Replicate.
    IMAGEBIND = 'IMAGEBIND', // dim: 1024
    MPNET_BASE_V2 = 'MPNET_BASE_V2', // dim: 768

    // Models hosted on Baseten.
    INSTRUCTOR_LARGE = 'INSTRUCTOR_LARGE', // dim: 768
}

export const modelsWithUserFriendlyNames = {
    [EMBEDDING_MODEL.OPEN_AI]: "text-ada-002",
    [EMBEDDING_MODEL.IMAGEBIND]: "ImageBind",
    [EMBEDDING_MODEL.MPNET_BASE_V2]: "mpnet-base-v2",
    [EMBEDDING_MODEL.BGE_LARGE_1_5]: "BGE-large-1.5",
    [EMBEDDING_MODEL.INSTRUCTOR_LARGE]: "Instructor-large",
  };

export const datasetsWithUserFriendlyNames = {
[DATASET.WIKIPEDIA]: "Wikipedia",
};


export enum LANGUAGE_MODEL {
    // OpenAI's GPT-3.5-Turbo model.
    GPT_3_5 = 'GPT_3_5'
}

export type Document = {
    value: string,
}

export type QueryData = {
    answer: {
        model: LANGUAGE_MODEL,
        response: string,
    },
    embeddingModel: EMBEDDING_MODEL,
    documents: Document[] | [],
}

export type QueryResponse = {
    query: string,
    data: QueryData[] | [],
}
