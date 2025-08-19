/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AirtableRecord, AirtableResponse } from '@/lib/airtable';

export interface SubmissionFields {
  Url: string;
  Bounties?: string[];
  Attachment?: any;
  Comment?: string;
  [key: string]: any; // Allow additional unknown fields
}

export type Submission = AirtableRecord<SubmissionFields>;
export type SubmissionsResponse = AirtableResponse<SubmissionFields>;
