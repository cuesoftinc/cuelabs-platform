/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AirtableRecord, AirtableResponse } from '@/lib/airtable';

export interface EarningFields {
  'S/N'?: number;
  User: string[];
  Bounty: string[];
  [key: string]: any; // Allow additional unknown fields
}

export type Earning = AirtableRecord<EarningFields>;
export type EarningsResponse = AirtableResponse<EarningFields>;
