'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, XCircle, User, Calendar, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { useApproveSubmission, useDeclineSubmission } from '@/hooks/queries/useAdmin';
import { useUser } from '@/hooks/queries/useUsers';
import { Submission } from '@/types/submissions';

interface SubmissionReviewProps {
  submission: Submission;
  onActionComplete?: () => void;
}

function SubmissionReview({ submission, onActionComplete }: SubmissionReviewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const approveSubmission = useApproveSubmission();
  const declineSubmission = useDeclineSubmission();
  
  // Fetch user data to get the name
  const userId = submission.fields.User?.[0];
  const { data: userData, isLoading: isLoadingUser } = useUser(userId || '');

  const handleAccept = async () => {
    if (!submission.fields.User?.[0] || !submission.fields.Bounties?.[0]) {
      console.error('Missing user or bounty ID in submission');
      return;
    }

    setIsProcessing(true);
    try {
      await approveSubmission.mutateAsync({
        submissionId: submission.id,
        userId: submission.fields.User[0],
        bountyId: submission.fields.Bounties[0],
      });
      onActionComplete?.();
    } catch (error) {
      console.error('Error accepting submission:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    try {
      await declineSubmission.mutateAsync(submission.id);
      onActionComplete?.();
    } catch (error) {
      console.error('Error declining submission:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const submissionUrl = submission.fields.Url;
  const comments = submission.fields.Comment;
  const createdAt = submission.fields['Created At'];
  const submissionStatus = submission.fields.Status;
  
  // Check if submission has already been processed
  const isProcessed = submissionStatus === 'Accepted' || submissionStatus === 'Declined';

  // Get status badge styling
  const getStatusBadge = () => {
    if (submissionStatus === 'Accepted') {
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    } else if (submissionStatus === 'Declined') {
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    } else {
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  return (
    <Card className='card-container hover:border-[#3A3A3A] transition-colors'>
      <CardContent className='p-4'>
        {/* Compact Header */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <User className='w-4 h-4 text-auth-text' />
              <span className='text-white text-sm font-medium'>
                {isLoadingUser ? (
                  <div className='w-20 h-4 bg-[#2A2A2A] rounded animate-pulse'></div>
                ) : (
                  userData?.fields?.Name || 'Unknown User'
                )}
              </span>
            </div>
            <div className='flex items-center gap-2 text-auth-text text-sm'>
              <Calendar className='w-4 h-4' />
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className='flex items-center gap-2'>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge()}`}>
              {submissionStatus || 'Pending'}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='p-1 hover:bg-[#2A2A2A] rounded transition-colors'
            >
              {isExpanded ? (
                <ChevronUp className='w-4 h-4 text-auth-text' />
              ) : (
                <ChevronDown className='w-4 h-4 text-auth-text' />
              )}
            </button>
          </div>
        </div>

        {/* Compact URL Display */}
        <div className='flex items-center gap-2 mb-3'>
          <ExternalLink className='w-4 h-4 text-auth-text flex-shrink-0' />
          <a
            href={submissionUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-400 hover:text-blue-300 text-sm truncate '
          >
            {submissionUrl}
          </a>
        </div>

        {/* Comments Preview */}
        {comments && (
          <div className='flex items-center gap-2 mb-3'>
            <MessageSquare className='w-4 h-4 text-auth-text flex-shrink-0' />
            <span className='text-auth-text text-sm truncate flex-1'>
              {comments.length > 100 ? `${comments.substring(0, 100)}...` : comments}
            </span>
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className='border-t border-[#2A2A2A] pt-4 space-y-4'>
            {/* Full Comments */}
            {comments && (
              <div>
                <label className='text-auth-text text-sm font-medium mb-2 block'>
                  Full Comments
                </label>
                <div className='p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg'>
                  <p className='text-white text-sm whitespace-pre-wrap'>{comments}</p>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex items-center gap-2 text-auth-text text-sm'>
                <User className='w-4 h-4' />
                <span>
                  {isLoadingUser ? (
                    <div className='w-24 h-4 bg-[#2A2A2A] rounded animate-pulse'></div>
                  ) : (
                    `User: ${userData?.fields?.Name || 'Unknown User'}`
                  )}
                </span>
              </div>
              <div className='flex items-center gap-2 text-auth-text text-sm'>
                <Calendar className='w-4 h-4' />
                <span>Submitted: {new Date(createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4 border-t border-[#2A2A2A]'>
              {isProcessed ? (
                <div className='flex-1 text-center py-3'>
                  <div className={`flex items-center justify-center gap-2 ${
                    submissionStatus === 'Accepted' 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {submissionStatus === 'Accepted' ? (
                      <>
                        <CheckCircle className='w-4 h-4' />
                        Submission Accepted
                      </>
                    ) : (
                      <>
                        <XCircle className='w-4 h-4' />
                        Submission Declined
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    onClick={handleAccept}
                    disabled={isProcessing}
                    className='flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white disabled:opacity-50'
                  >
                    {isProcessing ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
                        Processing...
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <CheckCircle className='w-4 h-4' />
                        Accept
                      </div>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleDecline}
                    disabled={isProcessing}
                    className='flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white disabled:opacity-50'
                  >
                    {isProcessing ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
                        Processing...
                      </div>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <XCircle className='w-4 h-4' />
                        Decline
                      </div>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SubmissionReview;