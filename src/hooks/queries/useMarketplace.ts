import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { airtableClient } from '@/lib/airtable';
import type {
  // MarketItem,
  // MarketItemFields,
  MarketItemsResponse,
  OrderFields,
  OrderItemFields,
  // Order,
  // OrderItem,
} from '@/types/market';

// Hook to fetch all marketplace items
export const useFetchMarketItems = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['marketplace', params],
    queryFn: async (): Promise<MarketItemsResponse> => {
      return airtableClient.getRecords('Marketplace', params);
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

// Hook to fetch a single marketplace item
export const useFetchMarketItem = (itemId: string) => {
  return useQuery({
    queryKey: ['marketplace', itemId],
    queryFn: async () => {
      const item = await airtableClient.getRecord('Marketplace', itemId);

      return item;
    },
    enabled: !!itemId, // Only run if itemId exists
  });
};

// Hook to search marketplace items
export const useSearchMarketItems = (searchTerm: string) => {
  return useQuery({
    queryKey: ['marketplace', 'search', searchTerm],
    queryFn: async (): Promise<MarketItemsResponse> => {
      const params = {
        filterByFormula: `SEARCH("${searchTerm}", {Name})`,
      };
      return airtableClient.getRecords('Marketplace', params);
    },
    enabled: !!searchTerm && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // Data stays fresh for 2 minutes for search results
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};

// Hook to fetch marketplace items by category (if you have a category field)
export const useFetchMarketItemsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['marketplace', 'category', category],
    queryFn: async (): Promise<MarketItemsResponse> => {
      const params = {
        filterByFormula: `{Category}="${category}"`,
      };
      return airtableClient.getRecords('Marketplace', params);
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to create order items
export const useCreateOrderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderItemsData: OrderItemFields[]) => {
      // Create multiple order items
      const promises = orderItemsData.map((itemData) =>
        airtableClient.createRecord('Order Items', itemData),
      );

      const responses = await Promise.all(promises);
      return responses;
    },
    onSuccess: () => {
      // Invalidate and refetch order items
      queryClient.invalidateQueries({ queryKey: ['order-items'] });
    },
  });
};

// Hook to create an order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: OrderFields) => {
      const response = await airtableClient.createRecord('Orders', orderData);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Hook to fetch orders (for future use)
export const useFetchOrders = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      return airtableClient.getRecords('Orders', params);
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

// Hook to fetch order items (for future use)
export const useFetchOrderItems = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['order-items', params],
    queryFn: async () => {
      return airtableClient.getRecords('Order Items', params);
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
