import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { airtableClient } from '@/lib/airtable';
import type {
  Project,
  ProjectFields,
  ProjectsResponse,
} from '@/types/projects';
import { SubmissionFields } from '@/types/submissions';

// Hook to fetch all projects
export const useFetchProjects = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async (): Promise<ProjectsResponse> => {
      return airtableClient.getRecords('Projects', params);
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

// Hook to fetch a single project
// export const useFetchProject = (projectId: string) => {

//   return useQuery({
//     queryKey: ['projects', projectId, 'expanded'],
//     queryFn: async () => {
//       const response = await airtableClient.getRecord('Projects', projectId);
//       // return response.record as Project;
//       return response;
//     },
//     enabled: !!projectId, // Only run if projectId exists
//   });
// };

export const useFetchProject = (projectId: string) => {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      // First, get the project
      const project = await airtableClient.getRecord('Projects', projectId);

      // If project has bounties, fetch them separately
      if (project.fields.Bounties && Array.isArray(project.fields.Bounties)) {
        const bountyIds = project.fields.Bounties as string[];

        if (bountyIds.length > 0) {
          // Fetch bounties using filterByFormula to get multiple records at once
          const bountyRecordsQuery = bountyIds
            .map((id) => `RECORD_ID()="${id}"`)
            .join(',');
          const bountiesResponse = await airtableClient.getRecords('Bounties', {
            filterByFormula: `OR(${bountyRecordsQuery})`,
          });

          // Replace bounty IDs with full bounty objects
          project.fields.Bounties = bountiesResponse.records;
        }
      }

      if (
        project.fields.Participants &&
        Array.isArray(project.fields.Participants)
      ) {
        const participantIds = project.fields.Participants as string[];

        if (participantIds.length > 0) {
          // Fetch bounties using filterByFormula to get multiple records at once
          const bountyRecordsQuery = participantIds
            .map((id) => `RECORD_ID()="${id}"`)
            .join(',');
          const participantsResponse = await airtableClient.getRecords(
            'Users',
            {
              filterByFormula: `OR(${bountyRecordsQuery})`,
            },
          );

          // Replace bounty IDs with full bounty objects
          project.fields.Participants = participantsResponse.records;
        }
      }

      return project;
    },
    enabled: !!projectId, // Only run if projectId exists
  });
};

// Hook to create a new project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData: ProjectFields) => {
      const response = await airtableClient.createRecord(
        'Projects',
        projectData,
      );
      return response as Project;
    },
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// Hook to update a project
// export const useUpdateProject = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       projectId,
//       updates,
//     }: {
//       projectId: string;
//       updates: Partial<ProjectFields>;
//     }) => {
//       const response = await airtableClient.updateRecord(
//         'Projects',
//         projectId,
//         updates,
//       );
//       return response.record as Project;
//     },
//     onSuccess: (updatedProject) => {
//       // Update the specific project in cache
//       queryClient.setQueryData(['projects', updatedProject.id], updatedProject);
//       // Invalidate projects list to reflect changes
//       queryClient.invalidateQueries({ queryKey: ['projects'] });
//     },
//   });
// };

// Hook to delete a project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      return airtableClient.deleteRecord('Projects', projectId);
    },
    onSuccess: (_, projectId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['projects', projectId] });
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// Hook to fetch single bounty
export const useFetchBounty = (bountyId: string) => {
  return useQuery({
    queryKey: ['bounties', bountyId],
    queryFn: async () => {
      // First, get the bounty
      const bounty = await airtableClient.getRecord('Bounties', bountyId);

      // If project has participants, fetch them separately
      if (
        bounty.fields.Participants &&
        Array.isArray(bounty.fields.Participants)
      ) {
        const participantsIds = bounty.fields.Participants as string[];

        if (participantsIds.length > 0) {
          // Fetch bounties using filterByFormula to get multiple records at once
          const participantsRecordsQuery = participantsIds
            .map((id) => `RECORD_ID()="${id}"`)
            .join(',');
          const participantsResponse = await airtableClient.getRecords(
            'Users',
            {
              filterByFormula: `OR(${participantsRecordsQuery})`,
            },
          );

          // Replace bounty IDs with full bounty objects
          bounty.fields.Participants = participantsResponse.records;
        }
      }

      return bounty;
    },
    enabled: !!bountyId, // Only run if bountyId exists
  });
};

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionData: SubmissionFields) => {
      const response = await airtableClient.createRecord(
        'Submissions',
        submissionData,
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
};

// Hook to update a bounty
export const useUpdateBounty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bountyId,
      updates,
    }: {
      bountyId: string;
      updates: any;
    }) => {
      const response = await airtableClient.updateRecord(
        'Bounties',
        bountyId,
        updates,
      );
      // Return the response directly since it's already the bounty object
      return response;
    },
    onSuccess: (updatedBounty, variables) => {
      // Update the specific bounty in cache
      queryClient.setQueryData(['bounties', variables.bountyId], updatedBounty);
      // Invalidate bounties list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['bounties'] });
    },
  });
};

// Hook to fetch user's claimed bounties
export const useUserClaimedBounties = (userId: string) => {
  return useQuery({
    queryKey: ['user-claimed-bounties', userId],
    queryFn: async () => {
      // Fetch all bounties where the user is a participant
      const response = await airtableClient.getRecords('Bounties', {
        filterByFormula: `SEARCH("${userId}", ARRAYJOIN({Participants}))`,
      });

      // Filter to only include bounties where the user is actually a participant
      const userBounties = response.records.filter((bounty: any) => {
        const participants = bounty.fields.Participants || [];
        return participants.some((participant: any) => {
          if (typeof participant === 'string') {
            return participant === userId;
          } else if (participant && typeof participant === 'object' && participant.id) {
            return participant.id === userId;
          }
          return false;
        });
      });

      return userBounties;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
