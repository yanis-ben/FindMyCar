import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseNhtsaResponse, generateSyntheticHistory } from '@/lib/vehicle-utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vin = searchParams.get('vin')?.toUpperCase();

  if (!vin) {
    return NextResponse.json(
      { error: 'VIN parameter required' },
      { status: 400 }
    );
  }

  try {
    let report = await prisma.vehicleReport.findUnique({
      where: { vin },
      include: {
        damageHistory: true,
        mileageHistory: true,
        ownershipHistory: true,
      },
    });

    if (!report) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const nhtsaResponse = await fetch(
        `${baseUrl}/api/vin/decode?vin=${vin}`
      );

      if (!nhtsaResponse.ok) {
        const errorData = await nhtsaResponse.json();
        throw new Error(errorData.error || 'Failed to decode VIN');
      }

      const nhtsaData = await nhtsaResponse.json();
      const parsedData = parseNhtsaResponse(nhtsaData);

      const synthetic = generateSyntheticHistory(parsedData);

      report = await prisma.vehicleReport.create({
        data: {
          vin: parsedData.vin,
          make: parsedData.make,
          model: parsedData.model,
          modelYear: parsedData.modelYear,
          bodyClass: parsedData.bodyClass,
          engineCylinders: parsedData.engineCylinders,
          engineHP: parsedData.engineHP,
          fuelTypePrimary: parsedData.fuelTypePrimary,
          manufacturer: parsedData.manufacturer,
          plantCity: parsedData.plantCity,
          plantCountry: parsedData.plantCountry,
          vehicleType: parsedData.vehicleType,
          firstRegistration: synthetic.firstRegistration,
          mileage: synthetic.currentMileage,
          rawNhtsaData: JSON.stringify(nhtsaData),
          lastFetchedAt: new Date(),
          damageHistory: {
            create: synthetic.damageHistory,
          },
          mileageHistory: {
            create: synthetic.mileageHistory,
          },
          ownershipHistory: {
            create: synthetic.ownershipHistory,
          },
        },
        include: {
          damageHistory: true,
          mileageHistory: true,
          ownershipHistory: true,
        },
      });
    }

    const reportData = {
      reportData: {
        vin: report.vin,
        brand: report.make || 'Unknown',
        model: report.model || 'Unknown',
        year: report.modelYear ? parseInt(report.modelYear) : null,
        mileage: report.mileage || 0,
        firstRegistration: report.firstRegistration || 'Unknown',
        status: report.status as "verified" | "warning" | "stolen",
        score: report.score,
        bodyClass: report.bodyClass || undefined,
        engineInfo: report.engineCylinders && report.engineHP
          ? `${report.engineCylinders} cyl, ${report.engineHP} HP`
          : undefined,
        fuelType: report.fuelTypePrimary || undefined,
        manufacturer: report.manufacturer || undefined,
        plantLocation: report.plantCity && report.plantCountry
          ? `${report.plantCity}, ${report.plantCountry}`
          : undefined,
      },
      damageHistory: report.damageHistory.map(d => ({
        date: d.date,
        type: d.type,
        severity: d.severity as "low" | "medium" | "high",
        description: d.description,
        source: d.source,
      })),
      mileageHistory: report.mileageHistory.map(m => ({
        date: m.date,
        mileage: m.mileage,
        source: m.source,
      })),
      ownershipHistory: report.ownershipHistory.map(o => ({
        from: o.fromDate,
        to: o.toDate,
        country: o.country,
        owners: o.ownerCount,
      })),
      metadata: {
        reportId: report.id,
        createdAt: report.createdAt.toISOString(),
        lastUpdated: report.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(reportData);

  } catch (error) {
    console.error('[Reports API Error]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate report. Please try again.' },
      { status: 500 }
    );
  }
}
