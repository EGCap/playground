
import { spawn } from 'child_process';

const getTogetherAIEmbeddings = async (inputs: string[]): Promise<number[][]> => {
    return new Promise((resolve, reject) => {
        const process = spawn('python', ['../models/together_ai_embeddings.py', ...inputs]);

        let data = '';
        process.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        process.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Process exited with code ${code}`));
            }

            try {
                const embeddings = JSON.parse(data);
                resolve(embeddings);
            } catch (error) {
                reject(error);
            }
        });

        process.stderr.on('data', (chunk) => {
            console.error(chunk.toString());
        });
    });
};

export { getTogetherAIEmbeddings };