import { NextRequest, NextResponse } from 'next/server'
import {handleQuery} from '../../../../engine/utils/query'


export async function POST(request: NextRequest) {
    const body = await request.json()

    const queryResult = await handleQuery(body.query, body.fetchDocs)
    const userResult: string = `Model Response:\n${queryResult.modelResponse}\n\nRetrieved Documents:\n${queryResult.retrievedDocuments.join('\n')}`;
    

    return NextResponse.json({ result: userResult })
  }
