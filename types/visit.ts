/**
 * Type definitions for visit-related data structures
 */

export interface Sample {
  name: string;
  quantity: number;
}

export interface CreditCard {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
}

export interface Survey {
  knewAboutProducts?: boolean | null;
  soldProductsBefore?: boolean | null;
  interestedInAlignerFresh?: boolean | null;
  gaveIPRGlideSample?: boolean | null;
  spokeToDoctor?: boolean | null;
  showedSmartIPRVideo?: boolean | null;
  quotedPrices?: boolean | null;
  quotedPricesDetails?: string;
  readyToOrder?: boolean | null;
  readyToOrderDetails?: string;
  officeDescription?: string;
}

export interface Visit {
  _id?: string;
  visitDate: string | Date;
  practiceName: string;
  phone: string;
  email: string;
  address: string;
  samplesProvided: Sample[];
  otherSample?: string;
  topicsDiscussed: string;
  survey?: Survey;
  creditCard?: CreditCard | null;
  status: 'draft' | 'saved';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VisitFormData {
  visitDate?: string | Date;
  practiceName?: string;
  phone?: string;
  email?: string;
  address?: string;
  samplesProvided?: Sample[];
  otherSample?: string;
  topicsDiscussed?: string;
  survey?: Survey;
  cardName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  status?: 'draft' | 'saved';
  _id?: string;
  isRealUpdate?: boolean;
}

export interface VisitListResponse {
  visits: Visit[];
  currentPage: number;
  totalPages: number;
  totalVisits: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  visitId?: string;
}
