import { HUGGING_FACE_API_KEY } from "../config";
import axios from 'axios';

export const getHuggingFaceEmbeddings = async(inputStrings: string[], modelId: string) => {
    const api_url = `https://api-inference.huggingface.co/pipeline/feature-extraction/${modelId}`
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
    }
    const body = JSON.stringify({
        'inputs': inputStrings,
        'options': {
            'wait_for_model': true
        }
    })

    const content = await axios.post(
        api_url,
        body,
        {headers: headers}
    )
    return content.data;
}

export const getBGELargeEmbeddings = async (inputs: string[]) => {
    return await getHuggingFaceEmbeddings(inputs, 'BAAI/bge-large-en-v1.5')
}
