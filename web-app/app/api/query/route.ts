import { NextRequest, NextResponse } from 'next/server'
import {handleQuery} from '@/engine/utils/query'
import { EMBEDDING_MODEL } from '@/engine/types';


export async function POST(request: NextRequest) {
    const body = await request.json()

    let embeddingModel: EMBEDDING_MODEL | null = body.modelToRetrieveDocs ? EMBEDDING_MODEL[body.modelToRetrieveDocs as keyof typeof EMBEDDING_MODEL] : null;
    if (!embeddingModel) embeddingModel = EMBEDDING_MODEL.OPEN_AI;
    
    const queryResult = await handleQuery(body.query, embeddingModel, body.generateAnswer)

    return NextResponse.json(queryResult);
}
