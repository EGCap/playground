import { EMBEDDING_MODEL } from "./types";

// Add additional embedding models to enable here
export const embeddingModelsInProd: EMBEDDING_MODEL[] = [
  EMBEDDING_MODEL.INSTRUCTOR_LARGE,
  EMBEDDING_MODEL.MPNET_BASE_V2,
  EMBEDDING_MODEL.OPEN_AI,
];

export const userFriendlyNameByModel = new Map(Object.entries({
  [EMBEDDING_MODEL.INSTRUCTOR_LARGE]: "instructor-large",
  [EMBEDDING_MODEL.MPNET_BASE_V2]: "mpnet-base-v2",
  [EMBEDDING_MODEL.OPEN_AI]: "text-ada-002",
}));
