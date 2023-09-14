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
    WIKIPEDIA = "WIKIPEDIA"
}

export enum DATABASE {
    SUPABASE = "SUPABASE"
}

export enum EMBEDDING_MODEL {
    OPEN_AI = "OPEN_AI"
}

export enum LANGUAGE_MODEL {
    GPT_3_5 = "GPT_3_5"
}

export type QueryResponse = {
    query: string,
    modelResponse: string,
    retrievedDocuments: string[]
}
