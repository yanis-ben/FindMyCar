export interface NhtsaVariable {
  Variable: string;
  Value: string | null;
  ValueId: string | null;
  VariableId: number;
}

export interface NhtsaDecodeResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: NhtsaVariable[];
}

export interface ParsedVehicleData {
  vin: string;
  make: string | null;
  model: string | null;
  modelYear: string | null;
  bodyClass: string | null;
  engineCylinders: string | null;
  engineHP: string | null;
  fuelTypePrimary: string | null;
  manufacturer: string | null;
  plantCity: string | null;
  plantCountry: string | null;
  vehicleType: string | null;
}
