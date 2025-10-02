'use client';

import React, { useState, useMemo } from 'react';
import { useAllSubmissions } from '@/hooks/queries/useAdmin';
import SubmissionReview from '@/components/custom/admin/submission-review';
import CustomSpinner from '@/components/custom/custom-spinner';
import { Input } from '@/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import { Submission } from '@/types/submissions';

function AdminSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const {
    data: allSubmissions,
    isLoading: isLoadingAll,
    error: allError,
  } = useAllSubmissions();

  // Use all submissions for comprehensive view
  const submissions = allSubmissions;
  const isLoading = isLoadingAll;
  const error = allError;

  // Filter submissions based on search term and status
  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];

    let filtered = submissions as Submission[];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((submission: Submission) => {
        const status = submission.fields.Status;
        if (statusFilter === 'pending') {
          return !status || status === 'New' || status === 'Pending';
        }
        // Handle case mismatch: filter uses lowercase, data uses capitalized
        const capitalizedFilter =
          statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
        return status === capitalizedFilter;
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((submission: Submission) => {
        const url = submission.fields.Url?.toLowerCase() || '';
        const comments = submission.fields.Comment?.toLowerCase() || '';
        const userId = submission.fields.User?.[0]?.toLowerCase() || '';
        const bountyId = submission.fields.Bounties?.[0]?.toLowerCase() || '';

        return (
          url.includes(searchLower) ||
          comments.includes(searchLower) ||
          userId.includes(searchLower) ||
          bountyId.includes(searchLower)
        );
      });
    }

    return filtered;
  }, [submissions, searchTerm, statusFilter]);

  // Get status counts for filter buttons
  const statusCounts = useMemo(() => {
    if (!submissions) return { all: 0, pending: 0, accepted: 0, declined: 0 };

    const submissionList = submissions as Submission[];
    return {
      all: submissionList.length,
      pending: submissionList.filter((s: Submission) => {
        const status = s.fields.Status;
        return !status || status === 'New' || status === 'Pending';
      }).length,
      accepted: submissionList.filter(
        (s: Submission) => s.fields.Status === 'Accepted',
      ).length,
      declined: submissionList.filter(
        (s: Submission) => s.fields.Status === 'Declined',
      ).length,
    };
  }, [submissions]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <CustomSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='text-red-500 text-lg mb-2'>
          Error Loading Submissions
        </div>
        <p className='text-auth-text text-sm'>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-white mb-2'>
          Submissions Management
        </h1>
        <p className='text-auth-text text-sm'>
          Review and manage all bounty submissions
        </p>
      </div>

      {/* Search and Filters */}
      <div className='mb-6 space-y-4'>
        {/* Search Bar */}
        <div className='relative max-w-md'>
          <CiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-auth-text' />
          <Input
            type='text'
            placeholder='Search submissions...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 border-auth-border bg-darkmode-bg text-white'
          />
        </div>

        {/* Status Filter Buttons */}
        <div className='flex flex-wrap gap-2'>
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-w-[100px] ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white'
                  : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
              }`}
            >
              {status === 'all'
                ? 'All'
                : status.charAt(0).toUpperCase() + status.slice(1)}{' '}
              ({count})
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className='text-auth-text text-sm'>
          Showing {filteredSubmissions.length} of {submissions?.length || 0}{' '}
          submissions
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length > 0 ? (
        <div className='grid gap-4'>
          {filteredSubmissions.map((submission: Submission) => (
            <SubmissionReview
              key={submission.id}
              submission={submission}
              onActionComplete={() => {
                // The query will automatically refetch due to cache invalidation
              }}
            />
          ))}
        </div>
      ) : (
        <div className='bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-12'>
          <div className='text-center'>
            <div className='text-auth-text text-lg mb-2'>
              {searchTerm || statusFilter !== 'all'
                ? 'No matching submissions found'
                : 'No submissions found'}
            </div>
            <p className='text-auth-text text-sm'>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'There are no submissions in the system yet'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSubmissionsPage;
