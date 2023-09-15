import { HUGGING_FACE_API_KEY } from "../config";
import axios from 'axios';

export const getHuggingFaceEmbedding = async(inputString: string, modelId: string) => {
    const api_url = `https://api-inference.huggingface.co/pipeline/feature-extraction/${modelId}`
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
    }
    const body = JSON.stringify({
        'inputs': [inputString],
        'options': {
            'wait_for_model': true
        }
    })

    const content: number[][] = await axios.post(
        api_url,
        body,
        {headers: headers}
    )
    return content[0];
}

export const getBGELargeEmbedding = async (input: string) => {
    return await getHuggingFaceEmbedding(input, 'BAAI/bge-large-en-v1.5')
}
