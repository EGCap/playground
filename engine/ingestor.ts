import dotenv from 'dotenv';
import { getChunkCount, parseData } from './utils/data';
import { getEmbedding, uploadEmbeddings } from './utils/embedding';
import { DATABASE, EMBEDDING_MODEL_TYPE, EmbeddedWikiTextChunk } from './types';

dotenv.config();

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
    const chunkCount = await getChunkCount(filename);
    const batchSize = 100;

    for(let i = 0; i < chunkCount; i += batchSize) {
        // Load chunk of textchunks
        const textChunks = await parseData(filename, i, i + batchSize)
        console.log("Loaded text chunks", textChunks.length);
        
        // Embeds the textchunks
        let completed = 0;
        const embeddedChunks = await Promise.all(textChunks.map(async (textChunk) => {
            const embedding = await getEmbedding(textChunk.toEmbed, EMBEDDING_MODEL_TYPE.OPEN_AI);

            completed++;
            console.log(`Completed ${completed}`);
            return {
                textChunk: textChunk,
                embedding: embedding,
            } as EmbeddedWikiTextChunk
        }));

        // Ensure all promises succeeded
        if (embeddedChunks.some((embeddedChunk) => !embeddedChunk.embedding)) {
            console.error("Some text chunks failed to embed", i, "to", i + batchSize);
            return;
        }

        // Upload to database
        const error = uploadEmbeddings(embeddedChunks, datasetName, DATABASE.SUPABASE)
        if (error) {
            console.error("Upload error:", i, "to", i + batchSize);
            console.error(error);
        } else {
            console.log("Upload chunk complete:", i, "to", i + batchSize);
        }
    }
}

main();
