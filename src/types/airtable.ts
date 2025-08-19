/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AirtableRecord<T = Record<string, any>> {
  id: string;
  fields: T;
  createdTime: string;
}

export interface AirtableResponse<T = Record<string, any>> {
  records: AirtableRecord<T>[];
  offset?: string;
}

// Example: Define your specific table types
export interface UserRecord {
  Name: string;
  Email: string;
  'Created At': string;
  Status: 'Active' | 'Inactive';
}
