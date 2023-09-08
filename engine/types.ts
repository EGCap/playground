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
    WIKIPEDIA = "wikipedia"
}

export enum DATABASE {
    SUPABASE = "SUPABASE"
}

export enum EMBEDDING_MODEL {
    OPEN_AI = "OPEN_AI"
}
