
import { NextResponse } from 'next/server';
import { providers } from '@/lib/data';

export async function GET() { return NextResponse.json({ providers }); }
