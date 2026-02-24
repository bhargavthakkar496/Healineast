
export type Accreditation = 'JCI' | 'NABH';

export interface Provider {
  id: string;
  org_name: string;
  accreditations: Accreditation[]; // HealinginEast partners: NABH/JCI only
  country: string;
  city: string;
  address: string;
  geo: { lat: number; lng: number };
  verified: boolean;
  languages: string[];
  specialties: ('Cardiac'|'Oncology'|'Fertility'|'Cosmetics')[];
  rating: number;
  reviewCount: number;
  distanceToAirportKm?: number;
}

export interface Doctor {
  id: string;
  provider_id: string;
  name: string;
  specialties: ('Cardiac'|'Oncology'|'Fertility'|'Cosmetics')[];
  experience_years: number;
  languages: string[];
  rating: number;
}

export interface Procedure {
  id: string;
  provider_id: string;
  name: string;
  specialty: 'Cardiac'|'Oncology'|'Fertility'|'Cosmetics';
  base_price: number; // indicative in provider currency
  currency: string;
  inclusions: string[];
  exclusions: string[];
  avg_LOS_days: number;
}

export interface QuoteRequest {
  patientName: string;
  email: string;
  nationality: string;
  procedureId: string;
  preferredDate?: string;
  notes?: string;
}
