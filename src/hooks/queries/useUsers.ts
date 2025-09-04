import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { airtableClient } from '@/lib/airtable';
import { User, UsersResponse, UserFields } from '@/types/users';

// Query hook for fetching all users
export const useUsers = (params?: Record<string, string>) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', params],
    queryFn: () => airtableClient.getRecords<UserFields>('Users', params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Query hook for fetching a single user by ID
export const useUser = (userId: string) => {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => airtableClient.getRecord<UserFields>('Users', userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Query hook for fetching users by email
export const useUserByEmail = (email: string) => {
  return useQuery<UsersResponse>({
    queryKey: ['user', 'email', email],
    queryFn: () =>
      airtableClient.getRecords<UserFields>('Users', {
        filterByFormula: `{Email} = "${email}"`,
      }),
    enabled: !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation hook for creating a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<UserFields>) =>
      airtableClient.createRecord('Users', userData),
    onSuccess: (newUser) => {
      // Set the individual user cache
      queryClient.setQueryData(['user', newUser.id], newUser);

      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Mutation hook for updating a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: Partial<UserFields>;
    }) => airtableClient.updateRecord('Users', userId, userData),
    onSuccess: (data, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(['user', variables.userId], {
        ...data,
        id: variables.userId,
      });

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
    },
  });
};

// Query hook for fetching users with pagination
export const useUsersWithPagination = (
  pageSize: number = 100,
  offset?: string,
) => {
  const params: Record<string, string> = {
    pageSize: pageSize.toString(),
  };

  if (offset) {
    params.offset = offset;
  }

  return useQuery<UsersResponse>({
    queryKey: ['users', 'paginated', pageSize, offset],
    queryFn: () => airtableClient.getRecords<UserFields>('Users', params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
