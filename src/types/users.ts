/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AirtableRecord, AirtableResponse } from '@/lib/airtable';
import { Bounty } from './bounties';
import { Project } from './projects';

export interface AttachmentThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface AttachmentThumbnails {
  small: AttachmentThumbnail;
  large: AttachmentThumbnail;
  full: AttachmentThumbnail;
}

export interface Attachment {
  id: string;
  width: number;
  height: number;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails: AttachmentThumbnails;
}

export interface UserFields {
  Name: string;
  Email: string;
  'Wallet Balance'?: number;
  'Total Earnings'?: number;
  Attachments?: Attachment[];
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
