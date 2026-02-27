import { NextRequest, NextResponse } from 'next/server';

import { authenticateUser, createSessionToken, setSessionCookie, validateSigninPayload } from '@/lib/auth';

function toAuthServiceError(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes('AUTH_DATABASE_URL') || error.message.includes('DATABASE_URL')) {
      return {
        status: 503,
        message: 'Authentication service is not configured. Set AUTH_DATABASE_URL and try again.',
      };
    }

    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      return {
        status: 503,
        message: 'Authentication database is unreachable. Please try again shortly.',
      };
    }
  }

  return {
    status: 500,
    message: 'Unable to sign in right now.',
  };
}

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

  try {
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
  } catch (error) {
    const authError = toAuthServiceError(error);
    console.error('Signin failed', error);
    return NextResponse.json({ error: authError.message }, { status: authError.status });
  }
}
