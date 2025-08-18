import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToDayMonthYear(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });
  const year = date.getUTCFullYear();
  return `${day}. ${month} ${year}`;
}
