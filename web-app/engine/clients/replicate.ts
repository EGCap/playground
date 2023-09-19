import Replicate from "replicate";
import { REPLICATE_API_KEY } from "../config";

const replicateClient = new Replicate({
    auth: REPLICATE_API_KEY,
});

export const getImageBindEmbeddings = async (inputStrings: string[]) => {
    const response = await replicateClient.run(
        "daanelson/imagebind:0383f62e173dc821ec52663ed22a076d9c970549c209666ac3db181618b7a304",
        {
            input: {
                text_input: inputStrings,
                modality: 'text',
            }
        }
    );
    return response as number[][];
}

type MPNETEmbeddingResponseSchema = {
    embedding: number[]
}

export const getMPNETBaseEmbeddings = async (inputStrings: string[]) => {
    const response = await replicateClient.run(
        "replicate/all-mpnet-base-v2:b6b7585c9640cd7a9572c6e129c9549d79c9c31f0d3fdce7baac7c67ca38f305",
        {
            input: {
                text_batch: JSON.stringify(inputStrings),
            }
        }
    );
    return (response as MPNETEmbeddingResponseSchema[]).map(result => result["embedding"]);
}
