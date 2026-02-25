import { NextResponse } from 'next/server';

import { getCurrentSession } from '@/lib/auth';

export async function GET() {
  const session = getCurrentSession();

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.sub,
      fullName: session.fullName,
      email: session.email,
    },
  });
}
