/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AirtableRecord, AirtableResponse } from '@/lib/airtable';
import { Bounty } from './bounties';

export interface ProjectFields {
  Name: string;
  Description: string;
  Bounties?: string[] | Array<Bounty>;
  Participants?: string[];
  'Created At': string;
  'Modified At': string;
  Tools?: string[];
  Status: 'Todo' | 'In progress' | 'Done' | 'New';
  [key: string]: any; // Allow additional unknown fields
}

export type Project = AirtableRecord<ProjectFields>;
export type ProjectsResponse = AirtableResponse<ProjectFields>;
