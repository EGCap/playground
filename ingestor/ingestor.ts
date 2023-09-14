import dotenv from 'dotenv';
import { getChunkCount, parseData } from '../web-app/engine/utils/data';
import { getEmbedding } from '../web-app/engine/utils/embedding';
import { DATABASE, DATASET, EMBEDDING_MODEL, EmbeddedWikiTextChunk } from '../web-app/engine/types';
import { uploadEmbeddings } from '../web-app/engine/utils/database';

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

    if (!Object.values(DATASET).includes(datasetName as DATASET)) {
        console.log("Please provide a valid dataset name");
        return;
    }
    const dataset: DATASET = DATASET[datasetName as keyof typeof DATASET];

    // Reads a filename of a JSONL with textchunks
    const chunkCount = await getChunkCount(filename);
    const batchSize = 100;

    for(let i = 0; i < chunkCount; i += batchSize) {
        // Load chunk of textchunks
        const textChunks = await parseData(filename, i, i + batchSize)
        console.log("Loaded text chunks", textChunks.length);
        
        // Embeds the textchunks
        let completed = 0;
        const embeddedChunks = await Promise.all(textChunks.map(async (textChunk, idx) => {
            const embedding = await getEmbedding(textChunk.toEmbed, EMBEDDING_MODEL.OPEN_AI);
            completed++;
            console.log(`Completed ${completed}`);

            return {
                textChunk: textChunk,
                chunkIndex: i + idx,
                embedding: embedding,
            } as EmbeddedWikiTextChunk
        }));

        // Ensure all promises succeeded
        if (embeddedChunks.some((embeddedChunk) => !embeddedChunk.embedding)) {
            console.error("Some text chunks failed to embed", i, "to", i + batchSize);
            return;
        }

        // Upload to database
        const error = await uploadEmbeddings(embeddedChunks, dataset, EMBEDDING_MODEL.OPEN_AI, DATABASE.SUPABASE)
        if (error) {
            console.error("Upload error:", i, "to", i + batchSize);
            console.error(error);
        } else {
            console.log("Upload chunk complete:", i, "to", i + batchSize);
        }
    }
}

main();
