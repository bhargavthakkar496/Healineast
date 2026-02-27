import { NextRequest, NextResponse } from 'next/server';

import { createSessionToken, createUser, setSessionCookie, validateSignupPayload } from '@/lib/auth';

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;

  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  const validated = validateSignupPayload(payload);

  if (validated.error || !validated.value) {
    return NextResponse.json({ error: validated.error || 'Invalid request payload.' }, { status: 400 });
  }

  const created = await createUser(validated.value);
  if (created.error || !created.value) {
    return NextResponse.json({ error: created.error || 'Unable to create account.' }, { status: 409 });
  }

  const user = created.value;
  setSessionCookie(createSessionToken(user));

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      country: user.country,
    },
  });
}
