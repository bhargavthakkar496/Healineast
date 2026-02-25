import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsAppTemplateMessage } from '../../../lib/integrations';
import { sanitizeEmail, sanitizePhoneNumber, sanitizeText } from '../../../lib/utils';

export async function POST(req: NextRequest) {
  const payload = await req.json();

  const patientName = sanitizeText(payload?.patientName, 120);
  const email = sanitizeEmail(payload?.email);
  const whatsappNumber = sanitizePhoneNumber(payload?.whatsappNumber);
  const nationality = sanitizeText(payload?.nationality, 80);
  const procedureId = sanitizeText(payload?.procedureId, 80);
  const preferredDate = sanitizeText(payload?.preferredDate, 20);
  const notes = sanitizeText(payload?.notes, 2000);

  if (!patientName || !email || !whatsappNumber || !nationality || !procedureId) {
    return NextResponse.json(
      { error: 'Missing or invalid required fields' },
      { status: 400 }
    );
  }

  console.log('New quote request:', {
    patientName,
    email,
    whatsappNumber,
    nationality,
    procedureId,
    preferredDate,
    notes,
  });

  const shouldSendWhatsApp =
    process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN &&
    process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID &&
    process.env.WHATSAPP_CLOUD_TEMPLATE_NAME;

  if (shouldSendWhatsApp) {
    try {
      await sendWhatsAppTemplateMessage({
        to: whatsappNumber,
        templateName: process.env.WHATSAPP_CLOUD_TEMPLATE_NAME as string,
        languageCode: process.env.WHATSAPP_CLOUD_TEMPLATE_LANGUAGE || 'en',
        bodyParameters: [patientName, procedureId, preferredDate || 'to be confirmed'],
      });
    } catch (error) {
      console.error('Failed sending WhatsApp template message', error);
    }
  }

  // TODO: persist to DB
  return NextResponse.json({ ok: true, whatsappNotificationAttempted: Boolean(shouldSendWhatsApp) });
}
