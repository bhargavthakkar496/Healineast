import { NextRequest, NextResponse } from 'next/server';

import { authenticateUser, createSessionToken, setSessionCookie, validateSigninPayload } from '@/lib/auth';

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;

  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  const validated = validateSigninPayload(payload);

  if (validated.error || !validated.value) {
    return NextResponse.json({ error: validated.error || 'Invalid request payload.' }, { status: 400 });
  }

  const authenticated = await authenticateUser(validated.value);
  if (authenticated.error || !authenticated.value) {
    return NextResponse.json({ error: authenticated.error || 'Invalid credentials.' }, { status: 401 });
  }

  const user = authenticated.value;
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
