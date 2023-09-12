import OpenAI from 'openai';
import { OPEN_AI_KEY } from '../config';
import { get_encoding, encoding_for_model } from "@dqbd/tiktoken";

const openaiClient = new OpenAI({apiKey: OPEN_AI_KEY});

export const getOpenAIEmbedding = async (input: string) => {
    const response = await openaiClient.embeddings.create({
        input: input,
        model: "text-embedding-ada-002"
    });

    return response.data[0].embedding;
}

export const getOpenAIChatCompletion = async (query: string, documents: string[]) => {
    // TODO: Implement
    return "";
}
