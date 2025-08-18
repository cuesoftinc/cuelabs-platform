/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AirtableRecord, AirtableResponse } from '@/lib/airtable';
import { Bounty } from './bounties';
import { Project } from './projects';

export interface UserFields {
  Name: string;
  Email: string;
  'Wallet Balance'?: number;
  Status?: 'Inactive' | 'Pending' | 'Active';
  'Active Bounties'?: Bounty[] | string[];
  'Completed Bounties'?: Bounty[] | string[];
  Rank?: number;
  Address?: string;
  Projects?: Project[] | string[];
  'Created At': string;
  'Modified At': string;
  [key: string]: any; // Allow additional unknown fields
}

export type User = AirtableRecord<UserFields>;
export type UsersResponse = AirtableResponse<UserFields>;
