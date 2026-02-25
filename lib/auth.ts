import { randomUUID, scryptSync, timingSafeEqual, createHmac } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

import { cookies } from 'next/headers';

import { sanitizeEmail, sanitizeText } from '@/lib/utils';

const USERS_FILE = process.env.AUTH_USERS_FILE
  ? path.resolve(process.env.AUTH_USERS_FILE)
  : process.env.NODE_ENV === 'production'
    ? '/tmp/healineast-users.json'
    : path.join(process.cwd(), 'data', 'users.json');
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

function getSessionSecret() {
  return process.env.AUTH_SESSION_SECRET || 'dev-only-secret-change-me';
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
  const signature = createHmac('sha256', getSessionSecret()).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function parseSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload.sub || !payload.email || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function readUsers(): Promise<StoredUser[]> {
  try {
    const content = await readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(content) as StoredUser[];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await mkdir(path.dirname(USERS_FILE), { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
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

export async function createUser(data: { fullName: string; email: string; country: string; password: string }) {
  const users = await readUsers();
  const existing = users.find((u) => u.email === data.email);
  if (existing) {
    return { error: 'An account with this email already exists.' };
  }

  const newUser: StoredUser = {
    id: randomUUID(),
    fullName: data.fullName,
    email: data.email,
    country: data.country,
    passwordHash: hashPassword(data.password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);

  return { value: newUser };
}

export async function authenticateUser(data: { email: string; password: string }) {
  const users = await readUsers();
  const user = users.find((candidate) => candidate.email === data.email);
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
