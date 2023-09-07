import { createClient } from '@supabase/supabase-js';

import dotenv from 'dotenv';
import { getEmbedding, parseData } from './utils';

dotenv.config();

// Uploads to Supabase
async function main() {
    const args = process.argv.slice(2);
    const filename = args[0];
    const datasetName = args[1];

    if (!filename) {
        console.error("Please provide a JSONL filename");
        return;
    }

    if (!datasetName) {
        console.error("Please provide a dataset name");
        return;
    }

    // Reads a filename of a JSONL with textchunks
    const textChunks = (await parseData(filename)) // TODO: Remove slice
    const chunkSize = 100;
    console.log("Loaded text chunks", textChunks.length);
    
    // Initialize Supabase
    const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_KEY as string)

    for(let i = 0; i < textChunks.length; i += chunkSize) {
        // Embeds the textchunks
        let completed = 0;
        const embeddedChunks = await Promise.all(textChunks.map(async (textChunk) => {
            const embedding = await getEmbedding(textChunk.toEmbed);
            completed++;
            console.log(`Completed ${completed}`);
            return {
                ...textChunk,
                embedding
            }
        }));

        // Ensure all promises succeeded
        if (embeddedChunks.some((embeddedChunk) => !embeddedChunk.embedding)) {
            console.error("Some text chunks failed to embed", i, "to", i + chunkSize);
            return;
        }

        // Upload to Supabase
        const uploadRows = embeddedChunks.map((embeddedChunk) => {
            return {
            dataset: datasetName,
            text: embeddedChunk.value.text,
            embedding: embeddedChunk.embedding,
            }
        });
        const { error } = await supabase
            .from('ada_002_embeddings')
            .insert(uploadRows)

        if (error) {
            console.error("Upload error:", i, "to", i + chunkSize);
            console.error(error);
        }else{
            console.log("Upload chunk complete:", i, "to", i + chunkSize);
        }
    }
}

main();