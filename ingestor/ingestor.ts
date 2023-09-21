import dotenv from 'dotenv';
import { getChunkCount, parseData } from '../web-app/engine/utils/data';
import { embedTextChunks } from '../web-app/engine/utils/embedding';
import { DATABASE, DATASET, EMBEDDING_MODEL, EmbeddedTextChunk, TextChunk } from '../web-app/engine/types';
import { uploadEmbeddings } from '../web-app/engine/utils/database';
import { Command } from 'commander';

dotenv.config();

async function main() {
    // Parse command line arguments and options.
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
        .option('-e, --embedbatchsize <embedBatchSize>', 'Number of chunks to embed per API call', '1')
        .option('-u, --uploadbatchsize <uploadBatchSize>', 'Number of chunks to upload to DB per API call', '100');
    
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
    const embedBatchSize: number = Number(options.embedbatchsize);
    const uploadBatchSize: number = Number(options.uploadbatchsize);

    let endChunkIndex: number = 0;
    if (options.chunks) {
        const numChunks: number = Number(options.chunks);
        endChunkIndex = startChunkIndex + numChunks - 1;
    } else {
        endChunkIndex = await getChunkCount(filename);
    }
    console.log(`Uploading data from ${startChunkIndex} to ${endChunkIndex} in batches of ${uploadBatchSize} with embedding batch size ${embedBatchSize}.`)

    const overallStartTime = Date.now();

    // Loop through upload batches
    for(let startBatchIndex = startChunkIndex; startBatchIndex <= endChunkIndex; startBatchIndex += uploadBatchSize) {
        // Load batch of text chunks to embed and upload
        const loadingStartTime = Date.now();
        const endBatchIndex = Math.min(startBatchIndex + uploadBatchSize - 1, endChunkIndex);
        const textChunks: TextChunk[] = await parseData(filename, startBatchIndex, endBatchIndex);
        console.log(`Loaded ${textChunks.length} text chunks in ${secondsFrom(loadingStartTime)} seconds`);
        
        // Embed the textchunks
        const embeddingStartTime = Date.now();
        const embeddedTextChunks: EmbeddedTextChunk[] = await embedTextChunks(textChunks, embeddingModel, embedBatchSize);
        if (embeddedTextChunks.some((x) => !x) || embeddedTextChunks.length != textChunks.length) {
            console.error(`Some text chunks failed to embed: ${startBatchIndex} to ${endBatchIndex}`);
            return;
        } else {
            console.log(`Embedding complete in ${secondsFrom(embeddingStartTime)} seconds`);
        }

        // Upload embeddings to database
        const uploadStartTime = Date.now();
        const error = await uploadEmbeddings(embeddedTextChunks, dataset, embeddingModel, DATABASE.SUPABASE)
        if (error) {
            console.error(`Upload failure: ${startBatchIndex} to ${endBatchIndex}`);
            console.error(error);
            return;
        } else {
            console.log(`Upload: ${startBatchIndex} to ${endBatchIndex} complete in ${secondsFrom(uploadStartTime)} seconds`);
        }
    }

    console.log(`\n\nScript finished running in ${secondsFrom(overallStartTime)} seconds.`);
}

main();
function secondsFrom(loadingStartTime: number) {
    throw new Error('Function not implemented.');
}

