import fs from 'fs/promises';

import { WikiTextChunk } from '../types';

export const parseData = async (filename: string, startLine: number, endLine: number) => {
    // read JSONL file
    let rawdata = await fs.readFile(filename, 'utf-8');
    let lines = rawdata.split('\n');

    let data = [] as WikiTextChunk[];
    for (let i = startLine; i <= endLine; i++) {
        let line = lines[i];
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

export const getChunkCount = async (filename: string) => {
    let rawdata = await fs.readFile(filename, 'utf-8');
    let lines = rawdata.split('\n');
    
    return lines.length;
}
