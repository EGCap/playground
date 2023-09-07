import OpenAI from 'openai';
import { OPEN_AI_KEY } from '../config';

const openaiClient = new OpenAI({apiKey: OPEN_AI_KEY});

export const getOpenAIEmbedding = async (input: string) => {
    const response = await openaiClient.embeddings.create({
        input: input,
        model: "text-embedding-ada-002"
    });

    return response.data[0].embedding;
}
