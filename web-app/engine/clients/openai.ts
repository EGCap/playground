import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config';
import { encodingForModel } from "js-tiktoken";

const openaiClient = new OpenAI({apiKey: OPENAI_API_KEY});
const encoder = encodingForModel("gpt-3.5-turbo");

export const getOpenAIEmbeddings = async (inputs: string[], outputDimension?: number) => {
    let response;
    if (outputDimension) {
        response = await openaiClient.embeddings.create({
            input: inputs,
            model: 'text-embedding-3-large',
            dimensions: outputDimension,
        });
    } else {
        response = await openaiClient.embeddings.create({
            input: inputs,
            model: 'text-embedding-3-large',
        });
    }
    return response.data.map(result => result.embedding);
}

const MAX_TOKENS = 4096;
const RESPONSE_TOKEN_BUDGET = 500;
const PROMPT_HEADER = 'You are a helpful AI assistant. Use the documents below to answer the subsequent question."'

export const getOpenAIChatCompletion = async (query: string, documents: string[]) => {
    let prompt: string = ''
    if (documents.length > 0) {
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
    const text =  completion.choices[0].message.content ?? "";
    
    return text;
}
