/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AirtableRecord, AirtableResponse } from '@/lib/airtable';

export interface EarningFields {
  User: string[];
  Bounty: string[];
  'S/N'?: number;
  [key: string]: any; // Allow additional unknown fields
}

export type Earning = AirtableRecord<EarningFields>;
export type EarningsResponse = AirtableResponse<EarningFields>;
