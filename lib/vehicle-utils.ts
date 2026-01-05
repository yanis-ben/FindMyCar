import { NhtsaDecodeResponse, ParsedVehicleData } from '@/app/types/nhtsa';

const WMI_DATABASE: Record<string, { make: string; country: string }> = {
  'VF1': { make: 'Renault', country: 'France' },
  'VF2': { make: 'Renault', country: 'France' },
  'VF3': { make: 'Peugeot', country: 'France' },
  'VF7': { make: 'Citroën', country: 'France' },
  'VF8': { make: 'Matra', country: 'France' },
  'VF6': { make: 'Renault Trucks', country: 'France' },
  'VFA': { make: 'Alpine', country: 'France' },
  'VSS': { make: 'SEAT', country: 'Spain' },
  'VSK': { make: 'Nissan', country: 'Spain' },
  'WAU': { make: 'Audi', country: 'Germany' },
  'WBA': { make: 'BMW', country: 'Germany' },
  'WBS': { make: 'BMW M', country: 'Germany' },
  'WDB': { make: 'Mercedes-Benz', country: 'Germany' },
  'WDC': { make: 'DaimlerChrysler', country: 'Germany' },
  'WDD': { make: 'Mercedes-Benz', country: 'Germany' },
  'WF0': { make: 'Ford', country: 'Germany' },
  'WME': { make: 'Smart', country: 'Germany' },
  'WMW': { make: 'MINI', country: 'Germany' },
  'WP0': { make: 'Porsche', country: 'Germany' },
  'WVW': { make: 'Volkswagen', country: 'Germany' },
  'WVG': { make: 'Volkswagen', country: 'Germany' },
  'WV1': { make: 'Volkswagen', country: 'Germany' },
  'WV2': { make: 'Volkswagen Commercial', country: 'Germany' },
  'W0L': { make: 'Opel', country: 'Germany' },
  'ZAR': { make: 'Alfa Romeo', country: 'Italy' },
  'ZFA': { make: 'Fiat', country: 'Italy' },
  'ZFF': { make: 'Ferrari', country: 'Italy' },
  'ZHW': { make: 'Lamborghini', country: 'Italy' },
  'ZLA': { make: 'Lancia', country: 'Italy' },
  'SAJ': { make: 'Jaguar', country: 'UK' },
  'SAL': { make: 'Land Rover', country: 'UK' },
  'SAR': { make: 'Rover', country: 'UK' },
  'SCC': { make: 'Lotus', country: 'UK' },
  'SCE': { make: 'DeLorean', country: 'UK' },
  'SHH': { make: 'Honda', country: 'UK' },
  'TRU': { make: 'Audi', country: 'Hungary' },
  'TMB': { make: 'Skoda', country: 'Czech Republic' },
};

const YEAR_CODES: Record<string, number> = {
  'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014, 'F': 2015, 'G': 2016,
  'H': 2017, 'J': 2018, 'K': 2019, 'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023,
  'R': 2024, 'S': 2025, 'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029, 'Y': 2030,
  '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005, '6': 2006, '7': 2007,
  '8': 2008, '9': 2009,
};

function decodeEuropeanVIN(vin: string): Partial<ParsedVehicleData> {
  const wmi = vin.substring(0, 3);
  const yearCode = vin.charAt(9);

  const wmiData = WMI_DATABASE[wmi];
  const year = YEAR_CODES[yearCode];

  return {
    make: wmiData?.make || null,
    plantCountry: wmiData?.country || null,
    modelYear: year ? String(year) : null,
  };
}

export function parseNhtsaResponse(response: NhtsaDecodeResponse): ParsedVehicleData {
  const results = response.Results || [];
  const vin = response.SearchCriteria.replace('VIN:', '').trim();

  const getValue = (variableName: string): string | null => {
    const variable = results.find(r => r.Variable === variableName);
    return variable?.Value || null;
  };

  let make = getValue('Make');
  let modelYear = getValue('Model Year');
  let plantCountry = getValue('Plant Country');

  if (!make || !modelYear) {
    const europeanData = decodeEuropeanVIN(vin);
    make = make || europeanData.make || null;
    modelYear = modelYear || europeanData.modelYear || null;
    plantCountry = plantCountry || europeanData.plantCountry || null;
  }

  return {
    vin,
    make,
    model: getValue('Model'),
    modelYear,
    bodyClass: getValue('Body Class'),
    engineCylinders: getValue('Engine Number of Cylinders'),
    engineHP: getValue('Engine Brake (hp) From'),
    fuelTypePrimary: getValue('Fuel Type - Primary'),
    manufacturer: getValue('Manufacturer Name'),
    plantCity: getValue('Plant City'),
    plantCountry,
    vehicleType: getValue('Vehicle Type'),
  };
}

export function generateSyntheticHistory(vehicleData: ParsedVehicleData) {
  const currentYear = new Date().getFullYear();
  const modelYear = parseInt(vehicleData.modelYear || String(currentYear - 5));
  const vehicleAge = currentYear - modelYear;

  const firstRegistration = `${modelYear}-03-15`;

  const currentMileage = Math.floor(vehicleAge * 12000 + Math.random() * 5000);

  const damageHistory = vehicleAge > 3 && Math.random() > 0.5 ? [
    {
      date: `${modelYear + 2}-06-10`,
      type: 'Accident mineur',
      severity: 'low',
      description: 'Dommage à l\'aile avant droite',
      source: 'synthetic',
    },
    ...(Math.random() > 0.7 ? [{
      date: `${modelYear + 4}-11-22`,
      type: 'Réparation',
      severity: 'low',
      description: 'Remplacement du pare-chocs avant',
      source: 'synthetic',
    }] : []),
  ] : [];

  const mileageHistory = [
    { date: firstRegistration, mileage: 10, source: 'Enregistrement initial' },
    { date: `${modelYear + 1}-05-20`, mileage: Math.floor(currentMileage * 0.2), source: 'Contrôle technique' },
    { date: `${modelYear + 2}-11-10`, mileage: Math.floor(currentMileage * 0.4), source: 'Entretien concessionnaire' },
    { date: `${modelYear + 4}-03-15`, mileage: Math.floor(currentMileage * 0.7), source: 'Contrôle technique' },
    { date: `${currentYear}-01-01`, mileage: currentMileage, source: 'Inspection actuelle' },
  ];

  const ownerCount = Math.min(Math.floor(vehicleAge / 3) + 1, 3);
  const ownershipHistory = Array.from({ length: ownerCount }, (_, i) => ({
    fromDate: i === 0 ? firstRegistration : `${modelYear + i * 3}-08-20`,
    toDate: i === ownerCount - 1 ? 'Actuel' : `${modelYear + (i + 1) * 3}-08-20`,
    country: 'France',
    ownerCount: 1,
  }));

  return {
    firstRegistration,
    currentMileage,
    damageHistory,
    mileageHistory,
    ownershipHistory,
  };
}
