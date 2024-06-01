export type TextChunk = {
    textToEmbed: string,
    numTokens: number,
    chunkIndex: number | null,
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
    // Simple Wikipedia dataset from HF
    WIKIPEDIA = 'WIKIPEDIA',

    // Version of Simple Wikipedia where every article is clipped to first 200 tokens
    WIKIPEDIA_CLIPPED = 'WIKIPEDIA_CLIPPED',

    // Elad's High Growth Handbook
    HGH = 'HGH',

    // Data uploaded through web dashboard
    CUSTOM = 'CUSTOM',
}

export enum DATABASE {
    SUPABASE = 'SUPABASE'
}

export enum EMBEDDING_MODEL {
    // OpenAI's hosted text-embedding-3-large model.
    OPEN_AI = 'OPEN_AI', // dim: 3072

    // OpenAI's hosted text-embedding-3-large model, subsampled to 1536 dim for indexing.
    OPEN_AI_1536 = 'OPEN_AI_1536', // dim: 1536

    // Cohere's hosted embed-english-v3.0 model.
    COHERE = 'COHERE', // dim: 1024

    // Voyage's hosted voyage-large-2-instruct model.
    VOYAGE = 'VOYAGE', // dim: 1024

    // Jina's hosted jina-embeddings-v2-base-en model.
    JINA = 'JINA', // dim: 768

    // Nomic's hosted nomic-embed-text-v1 model.
    NOMIC = 'NOMIC', // dim: 768

    // Models hosted on HuggingFace, taken from the MTEB leaderboard.
    BGE_LARGE_1_5 = 'BGE_LARGE_1_5', // dim: 1024

    // Models hosted on Replicate.
    IMAGEBIND = 'IMAGEBIND', // dim: 1024
    MPNET_BASE_V2 = 'MPNET_BASE_V2', // dim: 768

    // Models hosted on Baseten.
    INSTRUCTOR_LARGE = 'INSTRUCTOR_LARGE', // dim: 768
}

export enum RERANKING_MODEL {
    // Don't rerank retrieved documents.
    NONE = 'NONE',
    
    // Cohere's hosted rerank-english-v3.0 model.
    COHERE = 'COHERE',

    // Voyage's hosted rerank-1 model.
    VOYAGE = 'VOYAGE',

    // Jina's hosted jina-reranker-v1-base-en model.
    JINA = 'JINA',
}

// Add additional embedding models to enable here
export const enabledEmbeddingModels: EMBEDDING_MODEL[] = [
    EMBEDDING_MODEL.OPEN_AI,
    EMBEDDING_MODEL.OPEN_AI_1536,
    EMBEDDING_MODEL.COHERE,
    EMBEDDING_MODEL.VOYAGE,
    EMBEDDING_MODEL.JINA,
    EMBEDDING_MODEL.NOMIC,
];
  
export const modelNameByProvider = new Map(Object.entries({
    [EMBEDDING_MODEL.OPEN_AI]: "OpenAI (text-embedding-3-large)",
    [EMBEDDING_MODEL.OPEN_AI_1536]: "OpenAI (text-embedding-3-large-1536)",
    [EMBEDDING_MODEL.COHERE]: "Cohere (embed-english-v3.0)",
    [EMBEDDING_MODEL.VOYAGE]: "Voyage (voyage-large-2-instruct)",
    [EMBEDDING_MODEL.JINA]: "Jina (jina-embeddings-v2-base-en)",
    [EMBEDDING_MODEL.NOMIC]: "Nomic (nomic-embed-text-v1)",
    [EMBEDDING_MODEL.INSTRUCTOR_LARGE]: "instructor-large",
    [EMBEDDING_MODEL.MPNET_BASE_V2]: "mpnet-base-v2",
}));

export const enabledDatasets = [
    DATASET.WIKIPEDIA,
    DATASET.WIKIPEDIA_CLIPPED,
    DATASET.HGH,
];

export const userFriendlyNameByDataset = new Map(Object.entries({
    [DATASET.WIKIPEDIA]: "Wikipedia",
    [DATASET.WIKIPEDIA_CLIPPED]: "Clipped Wikipedia",
    [DATASET.CUSTOM]: "Uploaded Data",
    [DATASET.HGH]: "High Growth Handbook",
}));

export const enabledRerankingModels: RERANKING_MODEL[] = [
    RERANKING_MODEL.NONE,
    RERANKING_MODEL.COHERE,
    RERANKING_MODEL.VOYAGE,
    RERANKING_MODEL.JINA,
];
  
export const rerankingModelNameByProvider = new Map(Object.entries({
    [RERANKING_MODEL.NONE]: "No reranking",
    [RERANKING_MODEL.COHERE]: "Cohere (rerank-english-v3.0)",
    [RERANKING_MODEL.VOYAGE]: "Voyage (rerank-1)",
    [RERANKING_MODEL.JINA]: "Jina (jina-reranker-v1-base-en)",
}));

export enum EMBEDDING_INPUT_TYPE {
    QUERY = "QUERY",
    DOCUMENT = "DOCUMENT",
}

export enum LANGUAGE_MODEL {
    // OpenAI's GPT-3.5-Turbo model.
    GPT_3_5 = 'GPT_3_5'
}

export type RetrievedDocument = {
    dataset: string,
    document: string,
    similarity: number,
}

export type QueryData = {
    answer: {
        model: LANGUAGE_MODEL,
        response: string,
    },
    embeddingModel: EMBEDDING_MODEL | null,
    documents: RetrievedDocument[] | [],
}

export type QueryResponse = {
    query: string,
    data: QueryData[] | [],
}
