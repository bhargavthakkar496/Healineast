import { NextRequest, NextResponse } from 'next/server';
import { sanitizeEmail, sanitizeText } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const payload = await req.json();

  const patientName = sanitizeText(payload?.patientName, 120);
  const email = sanitizeEmail(payload?.email);
  const nationality = sanitizeText(payload?.nationality, 80);
  const procedureId = sanitizeText(payload?.procedureId, 80);
  const preferredDate = sanitizeText(payload?.preferredDate, 20);
  const notes = sanitizeText(payload?.notes, 2000);

  if (!patientName || !email || !nationality || !procedureId) {
    return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 });
  }

  console.log('New quote request:', {
    patientName,
    email,
    nationality,
    procedureId,
    preferredDate,
    notes,
  });

  // TODO: persist to DB, notify ops via email/WhatsApp Business API
  return NextResponse.json({ ok: true });
}
