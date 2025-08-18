/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AirtableRecord, AirtableResponse } from '@/lib/airtable';

export interface BountyFields {
  Name: string;
  Description: string;
  Participants?: string[];
  Status: 'Todo' | 'In progress' | 'Done' | 'New';
  Reward: number;
  Genre: string;
  'Due Date': string;
  'Created At': string;
  'Modified At': string;
  //   Tools?: string[];
  [key: string]: any; // Allow additional unknown fields
}

export type Bounty = AirtableRecord<BountyFields>;
export type BountiesResponse = AirtableResponse<BountyFields>;
