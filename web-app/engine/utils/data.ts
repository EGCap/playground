import fs from 'fs/promises';
import { encodingForModel } from "js-tiktoken";

import { TextChunk } from '../types';

const encoder = encodingForModel("gpt-3.5-turbo");

export const parseData = async (
    filename: string, startLine: number, endLine: number, maxTokensPerChunk?: number
) => {
    // read JSONL file
    let rawdata = await fs.readFile(filename, 'utf-8');
    let lines = rawdata.split('\n');

    let chunks = [] as TextChunk[];
    for (let i = startLine; i <= endLine; i++) {
        let line = lines[i];
        if (line && line.length > 0) {
            try {
                const parsedLine = JSON.parse(line);

                // Shorten the text to the max token count.
                let tokensToEmbed = encoder.encode(parsedLine.toEmbed);
                if (maxTokensPerChunk && tokensToEmbed.length > maxTokensPerChunk) {
                    tokensToEmbed = tokensToEmbed.slice(0, maxTokensPerChunk);
                }
                const textToEmbed = encoder.decode(tokensToEmbed);

                const chunk = {
                    textToEmbed: textToEmbed,
                    numTokens: tokensToEmbed.length,
                    chunkIndex: i,
                    document: {
                        rawText: parsedLine.value?.text ?? textToEmbed,
                        title: parsedLine.value?.title ?? "",
                        url: parsedLine.value?.url ?? "",
                    }
                } as TextChunk;
                chunks.push(chunk);
            } catch (e) {
                console.log(e);
            }
        }
    }
    return chunks;
}

export const getChunkCount = async (filename: string) => {
    let rawdata = await fs.readFile(filename, 'utf-8');
    let lines = rawdata.split('\n');
    
    return lines.length;
}
