import { NextRequest, NextResponse } from 'next/server'
import {handleQuery} from '../../../../engine/utils/query'


export async function POST(request: NextRequest) {
    const body = await request.json()

    const nearestDocs = await handleQuery(body)
    
    // todo: actually query the DB
    return NextResponse.json({ result: nearestDocs[0] })
  }
