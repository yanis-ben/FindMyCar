import { NextRequest, NextResponse } from 'next/server';

const NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

function isValidVin(vin: string): boolean {
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin.toUpperCase());
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vin = searchParams.get('vin');

  if (!vin) {
    return NextResponse.json(
      { error: 'VIN parameter is required' },
      { status: 400 }
    );
  }

  if (!isValidVin(vin)) {
    return NextResponse.json(
      { error: 'Invalid VIN format. VIN must be 17 alphanumeric characters.' },
      { status: 400 }
    );
  }

  try {
    const nhtsaUrl = `${NHTSA_BASE_URL}/DecodeVin/${vin}?format=json`;
    const response = await fetch(nhtsaUrl, {
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`NHTSA API returned ${response.status}`);
    }

    const data = await response.json();

    if (process.env.NODE_ENV === 'development') {
      console.log('[NHTSA] Decoded VIN:', vin, 'Results:', data.Results?.length || 0);
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('[NHTSA API Error]:', error);

    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'NHTSA API request timeout. Please try again.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to decode VIN. Please try again later.' },
      { status: 500 }
    );
  }
}
