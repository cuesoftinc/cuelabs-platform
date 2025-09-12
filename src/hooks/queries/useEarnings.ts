import { useQuery } from '@tanstack/react-query';
import { airtableClient } from '@/lib/airtable';
import { Earning } from '@/types/earnings';

// Hook to fetch all earnings
export const useEarnings = () => {
  return useQuery({
    queryKey: ['earnings'],
    queryFn: async () => {
      const response = await airtableClient.getRecords('Earnings');
      return response.records as Earning[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch earnings for a specific user
export const useUserEarnings = (userId: string) => {
  return useQuery({
    queryKey: ['earnings', userId],
    queryFn: async () => {
      const response = await airtableClient.getRecords('Earnings', {
        filterByFormula: `{User} = "${userId}"`
      });
      return response.records as Earning[];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch earnings for a specific time period
export const useEarningsByPeriod = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['earnings', 'period', startDate, endDate],
    queryFn: async () => {
      const response = await airtableClient.getRecords('Earnings', {
        filterByFormula: `AND(IS_SAME({Created At}, "${startDate}", 'day'), IS_SAME({Created At}, "${endDate}", 'day'))`
      });
      return response.records as Earning[];
    },
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
