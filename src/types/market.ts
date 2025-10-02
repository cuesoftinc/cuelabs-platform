/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AirtableRecord, AirtableResponse } from '@/lib/airtable';

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

export interface MarketItemFields {
  Name: string;
  Bounties?: string[];
  Attachments?: Attachment[];
  Comment?: string;
  Category?: string[];
  Cues?: string | number;
  Sizes?: string[];
  Description?: string;
  [key: string]: any; // Allow additional unknown fields
}

export type MarketItem = AirtableRecord<MarketItemFields>;
export type MarketItemsResponse = AirtableResponse<MarketItemFields>;

// Cart Types
export interface CartItem {
  id: string;
  item: MarketItem;
  quantity: number;
  selectedSize?: string;
  price: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface OrderItemFields {
  ItemId: string;
  Item: string[];
  Quantity?: number;
  Size?: string;
  Price: number;
  Color?: string;
  [key: string]: any; // Allow additional unknown fields
}

export type OrderItem = AirtableRecord<OrderItemFields>;
export type OrderItemsResponse = AirtableResponse<OrderItemFields>;

export interface OrderFields {
  OrderId: string;
  User: string[];
  Items: string[];
  Address: string;
  Phone: string;
  Status: string;
  'Total Price': number;
  'Items Count': number;
  [key: string]: any; // Allow additional unknown fields
}

export type Order = AirtableRecord<OrderFields>;
export type OrdersResponse = AirtableResponse<OrderFields>;
