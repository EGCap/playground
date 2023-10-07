import { BASETEN_API_KEY } from "../config";
import axios from 'axios';

const getBasetenEmbeddings = async (inputs: string[], modelVersionID: string) => {
    const api_url = `https://app.baseten.co/models/${modelVersionID}/predict`;
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Authorization: Api-Key ${BASETEN_API_KEY}`,
    };
    const body = JSON.stringify(inputs);

    const content = await axios.post(
        api_url,
        body,
        {headers: headers}
    );
    return content.data.model_output;
}

export const getInstructorLargeEmbeddings = async (inputs: string[]) => {
    return await getBasetenEmbeddings(inputs, 'XP9RNWq');
}


export const getMPNETBaseEmbeddings = async (inputs: string[]) => {
    return await getBasetenEmbeddings(inputs, 'ZBAg31P')
}
