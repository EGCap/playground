import { NextRequest, NextResponse } from 'next/server'
import {handleQuery} from '@/engine/utils/query'
import { EMBEDDING_MODEL } from '@/engine/types';


export async function POST(request: NextRequest) {
    const body = await request.json()

    const embeddingModel: EMBEDDING_MODEL | null = body.modelToRetrieveDocs ? EMBEDDING_MODEL[body.modelToRetrieveDocs as keyof typeof EMBEDDING_MODEL] : null;
    const queryResult = await handleQuery(body.query, embeddingModel)

    return NextResponse.json({ modelResponse: queryResult.modelResponse, retrievedDocs: queryResult.retrievedDocuments })
}
