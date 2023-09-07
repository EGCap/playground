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
    embedding: number[],
}

export enum EMBEDDING_MODEL_TYPE {
    OPEN_AI = "OPEN_AI"
}

export enum DATABASE {
    SUPABASE = "SUPABASE"
}
