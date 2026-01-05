import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vin = searchParams.get('vin')?.toUpperCase();

  if (!vin) {
    return NextResponse.json(
      { error: 'VIN parameter required' },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: 'PDF generation is disabled. Install puppeteer to enable: npm install puppeteer' },
    { status: 501 }
  );
}
