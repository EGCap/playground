import { NextRequest, NextResponse } from 'next/server'
import {handleQuery} from '@/engine/utils/query'
import { EMBEDDING_MODEL } from '@/engine/types';


export async function POST(request: NextRequest) {
    const body = await request.json()
    const {query, modelsToRetrieveDocs, generateAnswer} = body;


    // Get embedding models list from dictionary of toggles
    let embeddingModels = [];
    if (modelsToRetrieveDocs) {
        for (let model in modelsToRetrieveDocs) {
            if (body.modelsToRetrieveDocs[model]) {
                embeddingModels.push(model as EMBEDDING_MODEL);
            }
        }
    }

    // If we are generating an answer, include "no model" as well.
    if (generateAnswer) {
        embeddingModels.push(null);
    }

    const queryResult = await handleQuery(query, embeddingModels, generateAnswer)

    return NextResponse.json(queryResult);
}
