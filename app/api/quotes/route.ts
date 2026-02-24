
import { NextRequest, NextResponse } from 'next/server';
import type { QuoteRequest } from '@/lib/schema';

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as QuoteRequest;
  if (!payload.patientName || !payload.email || !payload.nationality || !payload.procedureId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  console.log('New quote request:', payload);
  // TODO: persist to DB, notify ops via email/WhatsApp Business API
  return NextResponse.json({ ok: true });
}
