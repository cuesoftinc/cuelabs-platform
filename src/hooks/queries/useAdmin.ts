import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { airtableClient } from '@/lib/airtable';
import { User } from '@/types/users';
import { Submission } from '@/types/submissions';
import { Bounty } from '@/types/bounties';

// Hook to fetch all pending submissions
export const usePendingSubmissions = () => {
  return useQuery({
    queryKey: ['pending-submissions'],
    queryFn: async () => {
      const response = await airtableClient.getRecords('Submissions', {
        filterByFormula: "{Status} = 'Pending'"
      });
      return response.records || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch ALL submissions (for debugging and comprehensive view)
export const useAllSubmissions = () => {
  return useQuery({
    queryKey: ['all-submissions'],
    queryFn: async () => {
      const response = await airtableClient.getRecords('Submissions');
      return response.records || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to approve a submission
export const useApproveSubmission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      submissionId, 
      userId, 
      bountyId 
    }: {
      submissionId: string;
      userId: string;
      bountyId: string;
    }) => {
      // 1. Update submission status to "Accepted"
      await airtableClient.updateRecord('Submissions', submissionId, {
        Status: 'Accepted'
      });
      
      // 2. Get bounty details to get the reward amount
      const bounty = await airtableClient.getRecord('Bounties', bountyId);
      const rewardAmount = bounty.fields.Reward || 0;
      
      // 3. Update bounty: set status to "Done" and add winner
      await airtableClient.updateRecord('Bounties', bountyId, {
        Status: 'Done',
        Winner: [userId]
      });
      
      // 4. Update winning user: move bounty from Submitted to Completed and add reward
      const user = await airtableClient.getRecord('Users', userId);
      const submittedBounties = user.fields['Submitted Bounties'] || [];
      const completedBounties = user.fields['Completed Bounties'] || [];
      const currentWalletBalance = user.fields['Wallet Balance'] || 0;
      const currentTotalEarnings = user.fields['Total Earnings'] || 0;
      
      const updatedSubmittedBounties = submittedBounties.filter((id: string) => id !== bountyId);
      const updatedCompletedBounties = [...completedBounties, bountyId];
      const newWalletBalance = currentWalletBalance + rewardAmount;
      const newTotalEarnings = currentTotalEarnings + rewardAmount;
      
      await airtableClient.updateRecord('Users', userId, {
        'Submitted Bounties': updatedSubmittedBounties,
        'Completed Bounties': updatedCompletedBounties,
        'Wallet Balance': newWalletBalance,
        'Total Earnings': newTotalEarnings,
      });
      
      // 5. Create earnings record to track this reward
      await airtableClient.createRecord('Earnings', {
        User: [userId],
        Bounty: [bountyId],
      });
      
      // 6. Get all users to clean up their Active and Submitted Bounties
      const allUsers = await airtableClient.getRecords('Users');
      
      // 7. Clean up all users' Active and Submitted Bounties for this bounty
      const userList = allUsers.records as User[] | undefined;
      const updatePromises = userList?.map(async (user: User) => {
        const activeBounties = user.fields['Active Bounties'] || [];
        const submittedBounties = user.fields['Submitted Bounties'] || [];
        
        const updatedActiveBounties = activeBounties.filter((item: string | Bounty) => {
          const id = typeof item === 'string' ? item : item.id;
          return id !== bountyId;
        });
        const updatedSubmittedBounties = submittedBounties.filter((item: string | Bounty) => {
          const id = typeof item === 'string' ? item : item.id;
          return id !== bountyId;
        });
        
        // Only update if there were changes
        if (updatedActiveBounties.length !== activeBounties.length || 
            updatedSubmittedBounties.length !== submittedBounties.length) {
          return airtableClient.updateRecord('Users', user.id, {
            'Active Bounties': updatedActiveBounties,
            'Submitted Bounties': updatedSubmittedBounties,
          });
        }
        return null;
      }) || [];
      
      // Wait for all user updates to complete
      await Promise.all(updatePromises.filter(Boolean));
      
      // 8. Decline all other submissions for the same bounty
      const otherSubmissions = await airtableClient.getRecords('Submissions', {
        filterByFormula: `AND({Bounties} = "${bountyId}", OR({Status} = 'Pending', {Status} = 'New'), RECORD_ID() != "${submissionId}")`
      });
      
      const submissionList = otherSubmissions.records as Submission[] | undefined;
      const declinePromises = submissionList?.map((submission: Submission) =>
        airtableClient.updateRecord('Submissions', submission.id, {
          Status: 'Declined'
        })
      ) || [];
      
      await Promise.all(declinePromises);
      
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['pending-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-completed-bounties'] });
      queryClient.invalidateQueries({ queryKey: ['user-in-progress-bounties'] });
      queryClient.invalidateQueries({ queryKey: ['available-bounties'] });
      queryClient.invalidateQueries({ queryKey: ['bounties'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Hook to decline a submission
export const useDeclineSubmission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (submissionId: string) => {
      await airtableClient.updateRecord('Submissions', submissionId, {
        Status: 'Declined'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-submissions'] });
    },
  });
};

// Hook to fetch all bounties for admin
export const useAllBounties = () => {
  return useQuery({
    queryKey: ['admin-all-bounties'],
    queryFn: async () => {
      const response = await airtableClient.getRecords('Bounties');
      return response.records || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch submissions for a specific bounty
export const useBountySubmissions = (bountyId: string) => {
  return useQuery({
    queryKey: ['bounty-submissions', bountyId],
    queryFn: async () => {
      if (!bountyId) return [];
      
      try {
        // Try with filter formula first
        const response = await airtableClient.getRecords('Submissions', {
          filterByFormula: `{Bounties} = "${bountyId}"`
        });
        
        // If no results, try fetching all submissions and filtering client-side
        if (!response.records || response.records.length === 0) {
          const allSubmissions = await airtableClient.getRecords('Submissions');
          const allSubmissionsList = allSubmissions.records as Submission[] | undefined;
          const filtered = allSubmissionsList?.filter((submission: Submission) => {
            const bountyIds = submission.fields.Bounties;
            if (Array.isArray(bountyIds)) {
              return bountyIds.includes(bountyId);
            }
            return bountyIds === bountyId;
          }) || [];
          
          return filtered;
        }
        
        return response.records || [];
      } catch (error) {
        console.error('Error fetching submissions for bounty', bountyId, ':', error);
        return [];
      }
    },
    enabled: !!bountyId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  });
};
