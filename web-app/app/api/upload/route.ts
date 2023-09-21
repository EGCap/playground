import { NextRequest, NextResponse } from 'next/server'
import {handleUpload} from '@/engine/utils/upload'


export async function POST(request: NextRequest) {
  const body = await request.json()
  const {text} = body;
  const success = await handleUpload(text);
  return NextResponse.json({success: success});
};
