'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLink,
  Users,
  Calendar,
  DollarSign,
  Eye,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useBountySubmissions } from '@/hooks/queries/useAdmin';
import { formatDateToDayMonthYear } from '@/lib/utils';
import SubmissionReview from './submission-review';
import { Bounty } from '@/types/bounties';
import { Submission } from '@/types/submissions';

interface BountyManagementProps {
  bounty: Bounty;
}

function BountyManagement({ bounty }: BountyManagementProps) {
  const [showSubmissions, setShowSubmissions] = useState(false);
  const { data: submissions, isLoading: isLoadingSubmissions } =
    useBountySubmissions(bounty.id);

  const fields = bounty.fields;
  const participantCount = fields?.Participants?.length || 0;
  const status = fields?.Status;
  const reward = fields?.Reward;
  const dueDate = fields?.['Due Date'];
  const description = fields?.Description;
  const name = fields?.Name;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In progress':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Done':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'New':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In progress':
        return '🟡';
      case 'Done':
        return '✅';
      case 'New':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const submissionList = submissions as Submission[] | undefined;
  const pendingSubmissions =
    submissionList?.filter((sub: Submission) => {
      const status = sub.fields.Status;
      return !status || status === 'New' || status === 'Pending';
    }) || [];
  const acceptedSubmissions =
    submissionList?.filter(
      (sub: Submission) => sub.fields.Status === 'Accepted',
    ) || [];
  const declinedSubmissions =
    submissionList?.filter(
      (sub: Submission) => sub.fields.Status === 'Declined',
    ) || [];

  return (
    <Card className='card-container'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-white text-lg mb-2'>{name}</CardTitle>
            <div className='flex items-center gap-2 mb-3'>
              <Badge className={getStatusColor(status)}>
                {getStatusIcon(status)} {status}
              </Badge>
              {fields?.Winner && fields.Winner.length > 0 && (
                <Badge className='bg-purple-500/10 text-purple-400 border-purple-500/20'>
                  🏆 Winner: {fields.Winner[0]}
                </Badge>
              )}
            </div>
            <p className='text-auth-text text-sm line-clamp-2'>{description}</p>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setShowSubmissions(!showSubmissions)}
            className='text-auth-text hover:text-white'
          >
            {showSubmissions ? (
              <ChevronDown className='w-4 h-4' />
            ) : (
              <ChevronRight className='w-4 h-4' />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Bounty Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
          <div className='flex items-center gap-2 text-auth-text text-sm'>
            <Users className='w-4 h-4' />
            <span>{participantCount} participants</span>
          </div>
          <div className='flex items-center gap-2 text-auth-text text-sm'>
            <DollarSign className='w-4 h-4' />
            <span>{reward?.toLocaleString() || '0'} reward</span>
          </div>
          <div className='flex items-center gap-2 text-auth-text text-sm'>
            <Calendar className='w-4 h-4' />
            <span>
              {dueDate ? formatDateToDayMonthYear(dueDate) : 'No due date'}
            </span>
          </div>
          <div className='flex items-center gap-2 text-auth-text text-sm'>
            <Eye className='w-4 h-4' />
            <span>{submissions?.length || 0} submissions</span>
          </div>
        </div>

        {/* Submissions Section */}
        {showSubmissions && (
          <div className='border-t border-[#2A2A2A] pt-4'>
            <div className='flex items-center justify-between mb-3'>
              <h4 className='text-white font-medium'>Submissions</h4>
              <div className='flex gap-2 text-xs'>
                {pendingSubmissions.length > 0 && (
                  <Badge className='bg-yellow-500/10 text-yellow-400 border-yellow-500/20'>
                    {pendingSubmissions.length} pending
                  </Badge>
                )}
                {acceptedSubmissions.length > 0 && (
                  <Badge className='bg-green-500/10 text-green-400 border-green-500/20'>
                    {acceptedSubmissions.length} accepted
                  </Badge>
                )}
                {declinedSubmissions.length > 0 && (
                  <Badge className='bg-red-500/10 text-red-400 border-red-500/20'>
                    {declinedSubmissions.length} declined
                  </Badge>
                )}
              </div>
            </div>

            {isLoadingSubmissions ? (
              <div className='text-center py-4'>
                <div className='text-auth-text text-sm'>
                  Loading submissions...
                </div>
              </div>
            ) : submissionList && submissionList.length > 0 ? (
              <div className='space-y-3'>
                {submissionList.map((submission: Submission) => {
                  const status = submission.fields.Status;
                  const isPending =
                    !status || status === 'New' || status === 'Pending';

                  // Use SubmissionReview component for pending submissions
                  if (isPending) {
                    return (
                      <SubmissionReview
                        key={submission.id}
                        submission={submission}
                        onActionComplete={() => {
                          // The query will automatically refetch due to cache invalidation
                        }}
                      />
                    );
                  }

                  // Show summary for non-pending submissions
                  return (
                    <div
                      key={submission.id}
                      className='p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-1'>
                            <Badge
                              className={
                                status === 'Accepted'
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                              }
                            >
                              {status}
                            </Badge>
                            <span className='text-auth-text text-xs'>
                              User: {submission.fields.User?.[0] || 'Unknown'}
                            </span>
                          </div>
                          {submission.fields.Url && (
                            <div className='flex items-center gap-2'>
                              <ExternalLink className='w-3 h-3 text-auth-text' />
                              <a
                                href={submission.fields.Url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-400 hover:text-blue-300 text-xs truncate'
                              >
                                {submission.fields.Url}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      {submission.fields.Comment && (
                        <p className='text-auth-text text-xs mt-2 line-clamp-2'>
                          {submission.fields.Comment}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className='text-center py-4'>
                <div className='text-auth-text text-sm'>No submissions yet</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BountyManagement;
