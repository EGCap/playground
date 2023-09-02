import fs from 'fs/promises';
import OpenAI from 'openai';

import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getEmbedding = async (input: string) => {
    const response = await openai.embeddings.create({
        input: input,
        model: "text-embedding-ada-002"
    }
    );

    return response.data[0].embedding;
}

async function main() {
    const args = process.argv.slice(2);
    const filename = args[0];

    // read JSONL file
    let rawdata = await fs.readFile(filename, 'utf-8');
    let lines = rawdata.split('\n');

    let data = [];
    for (let line of lines) {
        if (line.length > 0) {
            try {
                data.push(JSON.parse(line));
            } catch (e) {
                console.log(e);
            }
        }
    }


    const embedding = await getEmbedding(data[0].toEmbed);

    console.log(embedding);
}

main();