export type WikiTextChunk = {
    toEmbed: string,
    value: {
        title: string,
        url: string,
        text: string,
    }
}

export type EmbeddedWikiTextChunk = {
    textChunk: WikiTextChunk,
    chunkIndex: number,
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
    MPNET_BASE_V2 = 'MPNET_BASE_V2' // dim: 768
}

export enum LANGUAGE_MODEL {
    GPT_3_5 = 'GPT_3_5'
}

export type QueryResponse = {
    query: string,
    modelResponse: string,
    retrievedDocuments: string[]
}
