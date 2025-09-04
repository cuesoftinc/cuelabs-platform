/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { airtableClient } from '@/lib/airtable';

// Query hook for fetching records
export const useAirtableRecords = (
  tableName: string,
  params?: Record<string, string>,
) => {
  return useQuery({
    queryKey: ['airtable', tableName, params],
    queryFn: () => airtableClient.getRecords(tableName, params),
    enabled: !!tableName,
  });
};

// Query hook for fetching a single record
export const useAirtableRecord = (tableName: string, recordId: string) => {
  return useQuery({
    queryKey: ['airtable', tableName, recordId],
    queryFn: () => airtableClient.getRecord(tableName, recordId),
    enabled: !!tableName && !!recordId,
  });
};

// Mutation hook for creating records
export const useCreateAirtableRecord = (tableName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: Record<string, any>) =>
      airtableClient.createRecord(tableName, fields),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['airtable', tableName] });
    },
  });
};

// Mutation hook for updating records
export const useUpdateAirtableRecord = (tableName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recordId,
      fields,
    }: {
      recordId: string;
      fields: Record<string, any>;
    }) => airtableClient.updateRecord(tableName, recordId, fields),
    onSuccess: (data, variables) => {
      // Update the specific record in cache
      queryClient.setQueryData(['airtable', tableName, variables.recordId], {
        record: data,
      });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['airtable', tableName] });
    },
  });
};

// Mutation hook for deleting records
export const useDeleteAirtableRecord = (tableName: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: string) =>
      airtableClient.deleteRecord(tableName, recordId),
    onSuccess: (data) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['airtable', tableName, data.id] });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['airtable', tableName] });
    },
  });
};
