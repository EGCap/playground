import OpenAI from 'openai';
import { OPEN_AI_KEY } from '../config';
import { encodingForModel } from "js-tiktoken";

const openaiClient = new OpenAI({apiKey: OPEN_AI_KEY});

export const getOpenAIEmbedding = async (input: string) => {
    const response = await openaiClient.embeddings.create({
        input: input,
        model: 'text-embedding-ada-002'
    });
    return response.data[0].embedding;
}

const MAX_TOKENS = 4096;
const RESPONSE_TOKEN_BUDGET = 500;
const PROMPT_HEADER = 'You are a helpful AI assistant. Use the documents below to answer the subsequent question. \
If the answer cannot be found in the documents, write "I could not find an answer."'

export const getOpenAIChatCompletion = async (query: string, documents: string[]) => {
    let prompt: string = ''
    if (documents.length > 0) {

        const encoder = encodingForModel("gpt-3.5-turbo");

        prompt = PROMPT_HEADER
        const questionText: string = `\n\nQuestion: ${query}`
        let tokenBudget = MAX_TOKENS - encoder.encode(prompt).length - encoder.encode(questionText).length - RESPONSE_TOKEN_BUDGET

        for (let i = 0; i < documents.length; i++) {
            const documentText = `\n\nDocument ${i+1}: ${documents[i]}`
            const documentTokenCount = encoder.encode(documentText).length
            if (documentTokenCount > tokenBudget) {
                break;
            }
            prompt += documentText
            tokenBudget -= documentTokenCount
        }
        prompt += questionText
    } else {
        prompt = query
    }

    const completion = await openaiClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });
    return completion.choices[0].message.content;
}
