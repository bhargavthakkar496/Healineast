import { NextRequest, NextResponse } from 'next/server';

import { createSessionToken, createUser, setSessionCookie, validateSignupPayload } from '@/lib/auth';

function getAuthConfigDebug() {
  const keys = [
    'AUTH_DATABASE_URL',
    'AUTH_DB_URL',
    'DATABASE_URL',
    'DB_URL',
    'POSTGRES_URL',
    'AUTH_DATABASE_URI',
    'AUTH_DB_URI',
    'AUTH_DB_HOST',
    'AUTH_DB_USER',
    'AUTH_DB_NAME',
    'PGHOST',
    'PGUSER',
    'PGDATABASE',
  ] as const;

  const configured = keys.filter((key) => Boolean(process.env[key]?.trim()));
  return {
    configuredKeys: configured,
    nodeEnv: process.env.NODE_ENV || 'unknown',
  };
}

function toAuthServiceError(error: unknown) {
  if (error instanceof Error) {
    if (
      error.message.includes('AUTH_DATABASE_URL') ||
      error.message.includes('AUTH_DB_URL') ||
      error.message.includes('DATABASE_URL') ||
      error.message.includes('DB_URL') ||
      error.message.includes('POSTGRES_URL') ||
      error.message.includes('AUTH_DATABASE_URI') ||
      error.message.includes('AUTH_DB_URI') ||
      error.message.includes('PGHOST')
    ) {
      return {
        status: 503,
        message:
          'Authentication service is not configured. Set AUTH_DATABASE_URL / AUTH_DB_URL / AUTH_DATABASE_URI (or DATABASE_URL / DB_URL / POSTGRES_URL). You can also provide AUTH_DB_HOST/AUTH_DB_USER/AUTH_DB_PASSWORD/AUTH_DB_NAME (or PGHOST/PGUSER/PGPASSWORD/PGDATABASE) and try again.',
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
    message: 'Unable to create account right now.',
  };
}

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

  try {
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
  } catch (error) {
    const authError = toAuthServiceError(error);
    console.error('Signup failed', error);
    return NextResponse.json({ error: authError.message, debug: getAuthConfigDebug() }, { status: authError.status });
  }
}
