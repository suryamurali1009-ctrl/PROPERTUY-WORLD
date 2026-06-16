export interface Property {
  id: string;
  title: string;
  tagline: string;
  type: 'resort' | 'farmhouse' | 'site' | 'apartment' | 'villa' | 'commercial' | 'industrial';
  location: string;
  subLocation: string;
  priceText: string;
  basePrice: number; // in INR
  basePricePerUnit: number; // price per cent or sqft
  unitLabel: 'cent' | 'sqft';
  sizeText: string;
  sizesAvailable: number[]; // e.g. [2400, 4000] list of areas
  description: string;
  longDescription: string;
  features: string[];
  image: string; // URL of illustration or stock photo
  images?: string[]; // Additional multiple photos of houses for sale
  contactNumbers: string[];
  isPremium?: boolean;
  installmentsAvailable: boolean;
  minInstallmentMonths?: number;
  maxInstallmentMonths?: number;
  developmentStatus: 'Ready to Construct' | 'Proposed' | 'Approved' | 'Completed';
  approvalBody?: string; // e.g. BIAAPA
}

export interface Inquiry {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  propertyId: string;
  propertyName: string;
  visitDate: string;
  message: string;
  status: 'Received' | 'Scheduled' | 'Followed Up';
  timestamp: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}
