import dotenv from 'dotenv';
import { getChunkCount, parseData } from '../web-app/engine/utils/data';
import { getEmbedding } from '../web-app/engine/utils/embedding';
import { DATABASE, DATASET, EMBEDDING_MODEL, EmbeddedWikiTextChunk } from '../web-app/engine/types';
import { uploadEmbeddings } from '../web-app/engine/utils/database';
import { Command } from 'commander';

dotenv.config();

async function main() {
    const program = new Command();
    program
        .name('ingestor')
        .description('CLI to embed and upload data');

    program
        .argument('<filename>', 'Path to file containing raw data to embed')
        .argument('<datasetName>', 'Name of dataset to embed')
        .argument('<embeddingModelName>', 'Embedding model to use')
        .option('-s, --start <startChunkIndex>', 'Index of first chunk to embed', '0')
        .option('-n, --chunks <numChunks>', 'Number of chunks to embed')
        .option('-b, --batchsize <batchSize>', 'Number of chunks per upload batch', '100');
    
    program.parse();

    const filename: string = program.args[0];
    const datasetName: string = program.args[1];
    const embeddingModelName: string = program.args[2];

    if (!Object.values(DATASET).includes(datasetName as DATASET)) {
        console.log("Please provide a valid dataset name");
        return;
    }
    const dataset: DATASET = DATASET[datasetName as keyof typeof DATASET];

    if (!Object.values(EMBEDDING_MODEL).includes(embeddingModelName as EMBEDDING_MODEL)) {
        console.log("Please provide a valid dataset name");
        return;
    }
    const embeddingModel: EMBEDDING_MODEL = EMBEDDING_MODEL[embeddingModelName as keyof typeof EMBEDDING_MODEL];
    
    const options = program.opts();
    const startChunkIndex: number = Number(options.start);
    const batchSize: number = Number(options.batchsize);
    let endChunkIndex: number = 0;
    if (options.chunks) {
        const numChunks: number = Number(options.chunks);
        endChunkIndex = startChunkIndex + numChunks - 1;
    } else {
        endChunkIndex = await getChunkCount(filename);
    }
    console.log(`Uploading data from ${startChunkIndex} to ${endChunkIndex} in batches of ${batchSize}`)

    for(let startBatchIndex = startChunkIndex; startBatchIndex <= endChunkIndex; startBatchIndex += batchSize) {
        // Load chunk of textchunks
        const endBatchIndex = Math.min(startBatchIndex + batchSize - 1, endChunkIndex);
        const textChunks = await parseData(filename, startBatchIndex, endBatchIndex);
        console.log("Loaded text chunks", textChunks.length);
        
        // Embeds the textchunks
        let completed = 0;
        const embeddedChunks = await Promise.all(textChunks.map(async (textChunk, idx) => {
            const embedding = await getEmbedding(textChunk.toEmbed, embeddingModel);
            completed++;

            return {
                textChunk: textChunk,
                chunkIndex: startBatchIndex + idx,
                embedding: embedding,
            } as EmbeddedWikiTextChunk
        }));

        // Ensure all promises succeeded
        if (embeddedChunks.some((embeddedChunk) => !embeddedChunk.embedding)) {
            console.error("Some text chunks failed to embed", startBatchIndex, "to", endBatchIndex);
            return;
        }

        // Upload to database
        const error = await uploadEmbeddings(embeddedChunks, dataset, embeddingModel, DATABASE.SUPABASE)
        if (error) {
            console.error("Upload error:", startBatchIndex, "to", endBatchIndex);
            console.error(error);
        } else {
            console.log("Upload chunk complete:", startBatchIndex, "to", endBatchIndex);
        }
    }
}

main();
