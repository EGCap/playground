import fs from 'fs/promises';
import OpenAI from 'openai';
type WikiTextChunk = {
    toEmbed: string,
    value: {
        title: string,
        url: string,
        text: string,
    }
}

export const parseData = async (filename: string) => {
    // read JSONL file
    let rawdata = await fs.readFile(filename, 'utf-8');
    let lines = rawdata.split('\n');

    let data = [] as WikiTextChunk[];
    for (let line of lines) {
        if (line.length > 0) {
            try {
                data.push(JSON.parse(line));
            } catch (e) {
                console.log(e);
            }
        }
    }
    return data;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const getEmbedding = async (input: string) => {

    for (let i = 0; i < 3; i++) {
        try {
            const response = await openai.embeddings.create({
                input: input,
                model: "text-embedding-ada-002"
            }
            );

            return response.data[0].embedding;
        }
        catch (e) {
            console.log(e);
            await new Promise(resolve => setTimeout(resolve, 3000));   
        }
    }
}
