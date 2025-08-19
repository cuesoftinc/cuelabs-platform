/* eslint-disable @typescript-eslint/no-explicit-any */
const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;
const AIRTABLE_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

interface AirtableRecord<T = Record<string, any>> {
  id: string;
  fields: T;
  createdTime: string;
}

interface AirtableResponse<T = Record<string, any>> {
  records: AirtableRecord<T>[];
  offset?: string;
}

class AirtableClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${AIRTABLE_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = new Error(`Airtable API error: ${response.statusText}`);
      (error as any).status = response.status;
      throw error;
    }

    return response.json();
  }

  async getRecords<T = Record<string, any>>(
    tableName: string,
    params?: Record<string, string>,
  ): Promise<AirtableResponse<T>> {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';

    return this.request<AirtableResponse<T>>(`/${tableName}${query}`);
  }

  async getRecord<T = Record<string, any>>(
    tableName: string,
    recordId: string,
    params?: Record<string, string | string[]>,
  ): Promise<AirtableRecord<T>> {
    let query = '';

    if (params) {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Handle array parameters like expand: ['Bounties', 'Participants']
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, value);
        }
      });

      query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    }

    return this.request<AirtableRecord<T>>(`/${tableName}/${recordId}${query}`);
  }

  async createRecord<T = Record<string, any>>(
    tableName: string,
    fields: T,
  ): Promise<AirtableRecord<T>> {
    const result = await this.request<AirtableRecord<T>>(
      `/${tableName}`,
      {
        method: 'POST',
        body: JSON.stringify({ fields }),
      },
    );

    return result;
  }

  async updateRecord<T = Record<string, any>>(
    tableName: string,
    recordId: string,
    fields: T,
  ): Promise<{ record: AirtableRecord<T> }> {
    return this.request<{ record: AirtableRecord<T> }>(
      `/${tableName}/${recordId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ fields }),
      },
    );
  }

  async deleteRecord(
    tableName: string,
    recordId: string,
  ): Promise<{ deleted: boolean; id: string }> {
    return this.request<{ deleted: boolean; id: string }>(
      `/${tableName}/${recordId}`,
      {
        method: 'DELETE',
      },
    );
  }
}

export const airtableClient = new AirtableClient();
export type { AirtableRecord, AirtableResponse };
