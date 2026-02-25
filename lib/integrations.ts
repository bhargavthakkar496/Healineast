import { sanitizeCurrencyCode, sanitizePhoneNumber } from './utils';

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1';
const WHATSAPP_API_BASE = 'https://graph.facebook.com';

type RazorpayOrderRequest = {
  amountInMajorUnits: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
};

export type RazorpayOrderResponse = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
};

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured');
  }

  return { keyId, keySecret };
}

export async function createRazorpayOrder({
  amountInMajorUnits,
  currency = 'INR',
  receipt,
  notes,
}: RazorpayOrderRequest): Promise<RazorpayOrderResponse> {
  const { keyId, keySecret } = getRazorpayCredentials();
  const normalizedCurrency = sanitizeCurrencyCode(currency, 'INR');
  const amountInMinorUnits = Math.round(amountInMajorUnits * 100);

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountInMinorUnits,
      currency: normalizedCurrency,
      receipt,
      notes,
      payment_capture: 1,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to create Razorpay order: ${response.status} ${body}`);
  }

  return response.json();
}

type WhatsAppTemplateVariable = string | number;

type SendWhatsAppTemplateMessageInput = {
  to: string;
  templateName: string;
  languageCode?: string;
  bodyParameters?: WhatsAppTemplateVariable[];
};

function getWhatsAppBusinessConfig() {
  const accessToken = process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error('WhatsApp Cloud API credentials are not configured');
  }

  return {
    accessToken,
    phoneNumberId,
    apiVersion: process.env.WHATSAPP_CLOUD_API_VERSION || 'v20.0',
  };
}

function toE164Number(rawPhone: string) {
  return sanitizePhoneNumber(rawPhone);
}

export async function sendWhatsAppTemplateMessage({
  to,
  templateName,
  languageCode = 'en',
  bodyParameters = [],
}: SendWhatsAppTemplateMessageInput) {
  const { accessToken, phoneNumberId, apiVersion } = getWhatsAppBusinessConfig();
  const sanitizedTo = toE164Number(to);

  if (!sanitizedTo) {
    throw new Error('Invalid WhatsApp recipient number');
  }

  const components = bodyParameters.length
    ? [
        {
          type: 'body',
          parameters: bodyParameters.map((value) => ({
            type: 'text',
            text: String(value),
          })),
        },
      ]
    : undefined;

  const payload = {
    messaging_product: 'whatsapp',
    to: sanitizedTo,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  };

  const response = await fetch(
    `${WHATSAPP_API_BASE}/${apiVersion}/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to send WhatsApp message: ${response.status} ${body}`);
  }

  return response.json();
}
