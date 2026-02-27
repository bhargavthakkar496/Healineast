import { randomUUID, scryptSync, timingSafeEqual, createHmac } from 'crypto';
import { Pool } from 'pg';

import { cookies } from 'next/headers';
import { sanitizeEmail, sanitizeText } from '@/lib/utils';

const SESSION_COOKIE = 'healineast_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  country: string;
  passwordHash: string;
  createdAt: string;
}

interface SessionPayload {
  sub: string;
  email: string;
  fullName: string;
  exp: number;
}

interface DbUserRow {
  id: string;
  full_name: string;
  email: string;
  country: string;
  password_hash: string;
  created_at: Date;
}

let pool: Pool | null = null;
let usersTableReady: Promise<void> | null = null;

function getDatabaseUrl() {
  const databaseUrl = process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('AUTH_DATABASE_URL (or DATABASE_URL) is required for auth.');
  }

  return databaseUrl;
}

function getPool() {
  const databaseUrl = getDatabaseUrl();

  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl });
  }

  return pool;
}

async function ensureUsersTable() {
  if (!usersTableReady) {
    usersTableReady = (async () => {
      const db = getPool();
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          country TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
    })();
  }

  try {
    await usersTableReady;
  } catch (error) {
    usersTableReady = null;
    throw error;
  }
}

function mapRowToStoredUser(row: DbUserRow): StoredUser {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    country: row.country,
    passwordHash: row.password_hash,
    createdAt: row.created_at.toISOString(),
  };
}

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET || 'dev-only-secret-change-me';

  if (process.env.NODE_ENV === 'production' && secret === 'dev-only-secret-change-me') {
    throw new Error('AUTH_SESSION_SECRET must be configured in production.');
  }

  return secret;
}

function hashPassword(password: string, salt?: string) {
  const passwordSalt = salt ?? randomUUID();
  const hash = scryptSync(password, passwordSalt, 64).toString('hex');
  return `${passwordSalt}:${hash}`;
}

function verifyPassword(password: string, hashWithSalt: string) {
  const [salt, expectedHash] = hashWithSalt.split(':');
  if (!salt || !expectedHash) return false;

  const derivedHash = scryptSync(password, salt, 64).toString('hex');
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const actualBuffer = Buffer.from(derivedHash, 'hex');

  if (expectedBuffer.length !== actualBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

function signSession(payload: SessionPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function parseSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64url');

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    ) as SessionPayload;

    if (!payload.sub || !payload.email || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export function validateSignupPayload(payload: Record<string, unknown>) {
  const fullName = sanitizeText(payload.fullName, 120);
  const email = sanitizeEmail(payload.email);
  const country = sanitizeText(payload.country, 80);
  const password = sanitizeText(payload.password, 120);

  if (!fullName || !email || !country || !password) {
    return { error: 'Please fill in full name, email, password, and country.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' };
  }

  return { value: { fullName, email, country, password } };
}

export function validateSigninPayload(payload: Record<string, unknown>) {
  const email = sanitizeEmail(payload.email);
  const password = sanitizeText(payload.password, 120);

  if (!email || !password) {
    return { error: 'Please provide email and password.' };
  }

  return { value: { email, password } };
}

export async function createUser(data: {
  fullName: string;
  email: string;
  country: string;
  password: string;
}) {
  await ensureUsersTable();
  const db = getPool();

  const newUser: StoredUser = {
    id: randomUUID(),
    fullName: data.fullName,
    email: data.email,
    country: data.country,
    passwordHash: hashPassword(data.password),
    createdAt: new Date().toISOString(),
  };

  const created = await db.query<DbUserRow>(
    `
      INSERT INTO users (id, full_name, email, country, password_hash, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, full_name, email, country, password_hash, created_at;
    `,
    [
      newUser.id,
      newUser.fullName,
      newUser.email,
      newUser.country,
      newUser.passwordHash,
      new Date(newUser.createdAt),
    ]
  );

  if (!created.rows[0]) {
    return { error: 'An account with this email already exists.' };
  }

  return { value: mapRowToStoredUser(created.rows[0]) };
}

export async function authenticateUser(data: { email: string; password: string }) {
  await ensureUsersTable();
  const db = getPool();

  const result = await db.query<DbUserRow>(
    `
      SELECT id, full_name, email, country, password_hash, created_at
      FROM users
      WHERE email = $1
      LIMIT 1;
    `,
    [data.email]
  );

  const row = result.rows[0];
  const user = row ? mapRowToStoredUser(row) : null;
  if (!user) {
    return { error: 'No account found for this email.' };
  }

  const validPassword = verifyPassword(data.password, user.passwordHash);
  if (!validPassword) {
    return { error: 'Incorrect password.' };
  }

  return { value: user };
}

export function createSessionToken(user: StoredUser) {
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    fullName: user.fullName,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  return signSession(payload);
}

export function setSessionCookie(token: string) {
  cookies().set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function getCurrentSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return parseSession(token);
}
