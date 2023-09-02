import { NextRequest, NextResponse } from 'next/server'


export async function POST(request: NextRequest) {
    const body = await request.json()
    
    // todo: actually query the DB
    return NextResponse.json({ result: body })
  }
