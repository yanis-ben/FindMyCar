import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vin = searchParams.get('vin')?.toUpperCase();

  if (!vin) {
    return NextResponse.json(
      { error: 'VIN parameter required' },
      { status: 400 }
    );
  }

  try {
    await prisma.vehicleReport.delete({
      where: { vin },
    });

    return NextResponse.json({ message: `Report for VIN ${vin} deleted successfully` });
  } catch (error) {
    return NextResponse.json(
      { error: 'Report not found or already deleted' },
      { status: 404 }
    );
  }
}
