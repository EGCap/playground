import { NextRequest, NextResponse } from 'next/server'
import {handleQuery} from '@/engine/utils/query'
import { EMBEDDING_MODEL } from '@/engine/types';


export async function POST(request: NextRequest) {
    const body = await request.json()

    const embeddingModel: EMBEDDING_MODEL | null = body.modelToRetrieveDocs ? EMBEDDING_MODEL[body.modelToRetrieveDocs as keyof typeof EMBEDDING_MODEL] : null;
    const queryResult = await handleQuery(body.query, embeddingModel)

    const userResult: string = `Model Response:\n${queryResult.modelResponse}\n\nRetrieved Documents:\n${queryResult.retrievedDocuments.join('\n')}`;
    return NextResponse.json({ result: userResult })
}
