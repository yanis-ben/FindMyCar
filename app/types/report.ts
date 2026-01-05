export interface VehicleReportData {
  vin: string;
  brand: string;
  model: string;
  year: number | null;
  mileage: number;
  firstRegistration: string;
  status: "verified" | "warning" | "stolen";
  score: number;

  bodyClass?: string;
  engineInfo?: string;
  fuelType?: string;
  manufacturer?: string;
  plantLocation?: string;
}

export interface DamageHistoryItem {
  date: string;
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  source?: string;
}

export interface MileageHistoryItem {
  date: string;
  mileage: number;
  source: string;
}

export interface OwnershipHistoryItem {
  from: string;
  to: string;
  country: string;
  owners: number;
}

export interface CompleteVehicleReport {
  reportData: VehicleReportData;
  damageHistory: DamageHistoryItem[];
  mileageHistory: MileageHistoryItem[];
  ownershipHistory: OwnershipHistoryItem[];
  metadata: {
    reportId: string;
    createdAt: string;
    lastUpdated: string;
  };
}
