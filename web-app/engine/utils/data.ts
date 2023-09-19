import fs from 'fs/promises';

import { TextChunk } from '../types';

export const parseData = async (
    filename: string, startLine: number, endLine: number
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
                const chunk = {
                    text: parsedLine.value.text || parsedLine.toEmbed,
                    chunkIndex: i,
                    title: parsedLine.value.title,
                    url: parsedLine.value.url,
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
