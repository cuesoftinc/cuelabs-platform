'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { FaCode } from 'react-icons/fa6';
import { HiDotsHorizontal } from 'react-icons/hi';
import { PiPuzzlePieceFill } from 'react-icons/pi';
import { HiMiniPencil } from 'react-icons/hi2';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { ExternalLink } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import projectLogo from '@/svgs/project-logo.svg';
import cueCurrency from '@/svgs/cue-currency-gradient.svg';
import CustomTextareaToolbar from '../custom-textarea-toolbar';
import successCheckmark from '@/svgs/success-labs.svg';
import { Bounty } from '@/types/bounties';
import { formatDateToDayMonthYear } from '@/lib/utils';
import {
  useFetchBounty,
  useCreateSubmission,
  useUpdateBounty,
} from '@/hooks/queries/useProjects';
import { airtableClient } from '@/lib/airtable';
import { User } from '@/types/users';
import { useAuth } from '@/hooks/queries/useAuth';
import { updateUser } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';

type BountyCardProps = {
  bounty?: Bounty;
  category?: string;
  canClaimMoreBounties?: boolean;
};

function BountyCard({
  bounty,
  category = 'development',
  canClaimMoreBounties = true,
}: BountyCardProps) {
  const [openBountyDetails, setOpenBountyDetails] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  // const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const createSubmissionMutation = useCreateSubmission();
  const updateBountyMutation = useUpdateBounty();

  const { data: bountyDetailsData, error: bountyDetailsError } = useFetchBounty(
    bounty?.id.toString() || '',
  );

  // Check if current user is among participants
  const checkIfUserIsParticipant = () => {
    if (!user || !bountyDetailsData?.fields?.Participants) return false;

    const participants = bountyDetailsData.fields.Participants;
    const currentUserId = user.id;

    // Check if current user ID is in the participants array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return participants.some((participant: any) => {
      // Handle both string IDs and User objects
      if (typeof participant === 'string') {
        return participant === currentUserId;
      } else if (
        participant &&
        typeof participant === 'object' &&
        participant.id
      ) {
        return participant.id === currentUserId;
      }
      return false;
    });
  };

  // Check if bounty is in user's submitted bounties
  const checkIfBountyIsSubmitted = () => {
    if (!user || !bounty?.id) return false;

    const submittedBounties = user.fields['Submitted Bounties'] || [];
    return submittedBounties.some((item: string | Bounty) => {
      const itemId = typeof item === 'string' ? item : item.id;
      return itemId === bounty.id;
    });
  };

  // Set initial claimed and submitted state based on user participation
  React.useEffect(() => {
    if (bountyDetailsData && user) {
      const isParticipant = checkIfUserIsParticipant();
      const isBountySubmitted = checkIfBountyIsSubmitted();

      setIsClaimed(isParticipant);
      setIsSubmitted(isBountySubmitted);
    }
  }, [
    bountyDetailsData,
    user,
    user?.fields?.['Active Bounties'],
    user?.fields?.['Submitted Bounties'],
  ]);

  const handleClaimBounty = async () => {
    if (!user || !bounty?.id) {
      console.error('User or bounty ID not available');
      return;
    }

    // Check if bounty can be claimed
    const currentParticipants = bountyDetailsData?.fields?.Participants || [];
    const participantCount = currentParticipants.length;
    const bountyStatus = bountyDetailsData?.fields?.Status;

    // Check restrictions
    if (bountyStatus === 'Done') {
      setClaimError('This bounty has been completed and cannot be claimed.');
      setTimeout(() => setClaimError(null), 5000);
      return;
    }

    if (participantCount >= 5) {
      setClaimError(
        'This bounty has reached the maximum number of participants (5).',
      );
      setTimeout(() => setClaimError(null), 5000);
      return;
    }

    // Clear any previous errors
    setClaimError(null);
    setIsClaiming(true);

    try {
      const participantIds = currentParticipants
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((participant: any) => {
          // Handle both string IDs and User objects
          if (typeof participant === 'string') {
            return participant;
          } else if (
            participant &&
            typeof participant === 'object' &&
            participant.id
          ) {
            return participant.id;
          }
          return null;
        })
        .filter(Boolean);

      // Check if user is already a participant
      if (participantIds.includes(user.id)) {
        // User is already a participant, just update UI state
        setIsClaimed(true);
        return;
      }

      // Add current user to participants
      const updatedParticipants = [...participantIds, user.id];

      // Update the bounty with new participants and status - wait for this to complete
      const shouldUpdateStatus = participantCount === 0; // First participant
      const updatedBounty = await updateBountyMutation.mutateAsync({
        bountyId: bounty.id,
        updates: {
          Participants: updatedParticipants,
          ...(shouldUpdateStatus && { Status: 'In progress' }),
        },
      });

      // Also update the user's Active Bounties field
      if (user && updatedBounty && updatedBounty.id) {
        const currentUserActiveBounties = user.fields['Active Bounties'] || [];

        // Convert to string IDs and add bounty to Active Bounties
        const activeBountyIds = currentUserActiveBounties.map(
          (item: string | Bounty) =>
            typeof item === 'string' ? item : item.id,
        );
        const updatedUserActiveBounties = [...activeBountyIds, bounty.id];

        await airtableClient.updateRecord('Users', user.id, {
          'Active Bounties': updatedUserActiveBounties,
        });

        // Update Redux state to reflect the change immediately
        dispatch(
          updateUser({
            fields: {
              ...user.fields,
              'Active Bounties': updatedUserActiveBounties,
            },
          }),
        );
      }

      // Only set claimed state after successful Airtable update
      if (updatedBounty && updatedBounty.id) {
        setIsClaimed(true);
      } else {
        throw new Error(
          'Failed to update bounty in Airtable - invalid response',
        );
      }
    } catch (error) {
      console.error('Error claiming bounty:', error);

      // Reset claiming state on error
      setIsClaiming(false);

      // Show user-friendly error message
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to claim bounty. Please try again.';

      // Set error state for UI display
      setClaimError(errorMessage);

      // Clear error after 5 seconds
      setTimeout(() => setClaimError(null), 5000);
    } finally {
      setIsClaiming(false);
    }
  };

  const validateUrl = (url: string) => {
    if (!url.trim()) {
      return 'Submission URL is required';
    }

    // Basic URL format validation
    try {
      const urlObj = new URL(url);

      // Check if it's a valid protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return 'URL must use http:// or https://';
      }

      // Encourage specific platforms for submissions
      const hostname = urlObj.hostname.toLowerCase();
      const validPlatforms = [
        'github.com',
        'gitlab.com',
        'bitbucket.org',
        'codepen.io',
        'codesandbox.io',
        'stackblitz.com',
        'vercel.app',
        'netlify.app',
        'herokuapp.com',
        'figma.com',
        'dribbble.com',
        'behance.net',
      ];

      const isValidPlatform = validPlatforms.some(
        (platform) =>
          hostname === platform || hostname.endsWith('.' + platform),
      );

      if (!isValidPlatform) {
        console.warn('Uncommon platform detected:', hostname);
      }

      return '';
    } catch {
      return 'Please enter a valid URL (e.g., https://github.com/username/repo)';
    }
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setUrlError('');
    setSubmissionError('');

    const urlValidationError = validateUrl(submissionUrl);
    setUrlError(urlValidationError);

    if (urlValidationError) {
      return;
    }

    if (!bounty?.id) {
      setSubmissionError('No bounty ID available');
      return;
    }

    // if (!user) {
    //   setSubmissionError('You must be logged in to submit');
    //   return;
    // }

    setIsSubmitting(true);

    try {
      // 1. Create submission
      await createSubmissionMutation.mutateAsync({
        Url: submissionUrl,
        Bounties: [bounty.id],
        Comment: comments.trim() || undefined,
        User: user ? [user.id] : undefined,
      });

      // 2. Add bounty to Submitted Bounties (keep in Active Bounties)
      if (user) {
        const currentSubmittedBounties =
          user.fields['Submitted Bounties'] || [];

        // Convert to string IDs and add bounty to Submitted Bounties (don't remove from Active Bounties)
        const submittedBountyIds = currentSubmittedBounties.map(
          (item: string | Bounty) =>
            typeof item === 'string' ? item : item.id,
        );
        const updatedSubmittedBounties = [...submittedBountyIds, bounty.id];

        // Update user record in Airtable - only update Submitted Bounties
        await airtableClient.updateRecord('Users', user.id, {
          'Submitted Bounties': updatedSubmittedBounties,
        });

        // Update Redux state to reflect the change immediately
        dispatch(
          updateUser({
            fields: {
              ...user.fields,
              'Submitted Bounties': updatedSubmittedBounties,
            },
          }),
        );
      }

      setHasSubmitted(true);
      setOpenBountyDetails(false);
      setOpenSuccess(true);

      // Reset form
      setSubmissionUrl('');
      setComments('');
      setUrlError('');
      setSubmissionError('');
      // setSubmissionId(null);
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to submit. Please try again.';
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setOpenBountyDetails(false);
    setSubmissionUrl('');
    setComments('');
    setUrlError('');
    setSubmissionError('');
    setHasSubmitted(false);
    // setSubmissionId(null);
  };

  const isFormValid = submissionUrl.trim() !== '' && !urlError;

  const fields = bountyDetailsData?.fields;
  const displayCategory = fields?.Genre?.toLowerCase() || category;
  const participantCount = fields?.Participants?.length || 0;
  const bountyStatus = fields?.Status;

  // Check if bounty can be claimed
  const canClaimBounty = bountyStatus !== 'Done' && participantCount < 5;

  // console.log('Bounty Card Fields:', bountyDetailsData);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'In progress':
        return '#FDB52A';
      case 'Done':
        return '#14CA74';
      case 'New':
        return '#32ADE6';
      default:
        return '#05C168'; // Default to green for "Open"
    }
  };

  return (
    <Card className='card-container p-0 w-full max-w-[329px] gap-0'>
      <CardContent className='p-3 md:p-5'>
        <div className='flex items-center justify-between'>
          <div>
            <Image src={projectLogo} alt='project logo' />
          </div>

          <div className='flex gap-1 items-center font-medium text-dashboard-nav text-[10px] '>
            <PiPuzzlePieceFill className='w-3 h-3' />
            <span>
              {participantCount} Participant{participantCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className='mt-4'>
          <h3 className='text-xs leading-[14px] mb-1 font-semibold text-white'>
            {fields?.Name || 'Landing page design & development'}
          </h3>

          <p className='text-xs leading-[18px] font-medium text-dashboard-nav'>
            {fields?.Description ||
              'Lorem ipsum dolor sit amet consectetur sed id massa morbi porta malesuada dictumst.'}
          </p>
        </div>
      </CardContent>

      <CardFooter className='mt-0 py-4 border-t-[0.6px] border-[#1F1F1F] justify-between px-3 md:px-5 '>
        <div className='flex gap-2 items-center bg-[#0F0F0F] border-[0.6px] border-[#1F1F1F] p-2 text-white font-medium text-xs rounded-[2px]'>
          {displayCategory === 'development' && (
            <FaCode className='text-[#545454] w-3 h-3' />
          )}
          {displayCategory === 'design' && (
            <HiMiniPencil className='text-[#545454] w-3 h-3' />
          )}
          <span>
            {displayCategory === 'development'
              ? 'Development'
              : displayCategory === 'design'
                ? 'Design'
                : fields?.Genre || 'Development'}
          </span>
        </div>
        <Popover>
          <PopoverTrigger>
            <HiDotsHorizontal className='text-white cursor-pointer' />
          </PopoverTrigger>
          <PopoverContent className='card-container max-w-[70px] text-white p-2 text-center'>
            <span
              className='font-medium cursor-pointer text-xs hover:font-extrabold'
              onClick={() => setOpenBountyDetails(true)}
            >
              View
            </span>
          </PopoverContent>
        </Popover>
      </CardFooter>

      <Dialog open={openBountyDetails} onOpenChange={setOpenBountyDetails}>
        <DialogContent
          aria-describedby={undefined}
          className='bg-[#0A0A0A] p-3 md:p-[20px] lg:p-[30px] rounded-[12px] max-h-[90vh] w-[90vw]! md:w-[60vw]! max-w-[731px]! border-0 overflow-auto shadow-2xl'
        >
          <VisuallyHidden>
            <DialogTitle>Bounty Details</DialogTitle>
          </VisuallyHidden>

          {bountyDetailsError ? (
            <div className='text-red-500'>
              Error loading bounty details: {bountyDetailsError.message}
            </div>
          ) : (
            <div className='w-full'>
              <div className='flex justify-end w-full text-[#919EAB]'>
                <IoCloseCircleSharp
                  width={24}
                  height={24}
                  className='cursor-pointer'
                  onClick={() => setOpenBountyDetails(false)}
                />
              </div>

              <div>
                {/* Header */}
                <div>
                  <div className='flex items-center flex-wrap gap-4 w-full'>
                    <div className='flex items-center gap-2 '>
                      <h2 className='text-lg md:text-xl leading-[120%] -tracking-[2%]'>
                        {fields?.Name || 'Homepage Bug'}
                      </h2>
                      <span
                        className={`active-status gap-1 ${
                          fields?.Status === 'In progress'
                            ? 'inactive-status'
                            : fields?.Status === 'Done'
                              ? 'active-status'
                              : 'new-status'
                        }`}
                      >
                        <div
                          className='w-[3px] h-[3px] rounded-full inline-block'
                          style={{
                            backgroundColor: getStatusColor(fields?.Status),
                          }}
                        />
                        {fields?.Status}
                      </span>
                    </div>

                    {/* Claim Bounty Button */}
                    <Button
                      onClick={handleClaimBounty}
                      disabled={
                        isClaimed ||
                        isClaiming ||
                        !canClaimMoreBounties ||
                        !canClaimBounty
                      }
                      className={`h-10 px-4 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                        isSubmitted
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white cursor-not-allowed shadow-lg'
                          : isClaimed
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white cursor-not-allowed shadow-lg'
                            : isClaiming
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white cursor-not-allowed shadow-lg'
                              : !canClaimMoreBounties || !canClaimBounty
                                ? 'bg-gray-500 hover:bg-gray-600 text-white cursor-not-allowed shadow-lg'
                                : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}
                    >
                      {isClaiming && (
                        <div className='w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2'></div>
                      )}
                      {isSubmitted ? (
                        <span className='flex items-center gap-2'>
                          <svg
                            className='w-4 h-4'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                              clipRule='evenodd'
                            />
                          </svg>
                          Submitted
                        </span>
                      ) : isClaimed ? (
                        <span className='flex items-center gap-2'>
                          <svg
                            className='w-4 h-4'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                          Claimed
                        </span>
                      ) : isClaiming ? (
                        'Claiming...'
                      ) : !canClaimMoreBounties ? (
                        'Limit Reached'
                      ) : !canClaimBounty ? (
                        bountyStatus === 'Done' ? (
                          'Completed'
                        ) : (
                          'Full'
                        )
                      ) : (
                        'Claim Bounty'
                      )}
                    </Button>

                    {/* Error Display */}
                    {claimError && (
                      <div className='mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg'>
                        <p className='text-red-400 text-xs'>{claimError}</p>
                      </div>
                    )}

                    {/* Limit Reached Message */}
                    {!canClaimMoreBounties && !isClaimed && (
                      <div className='mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg'>
                        <p className='text-yellow-400 text-xs'>
                          You&apos;ve reached the maximum limit of 3 active
                          bounties. Complete some bounties to claim new ones.
                        </p>
                      </div>
                    )}

                    {/* Bounty Restrictions Message */}
                    {!canClaimBounty && !isClaimed && canClaimMoreBounties && (
                      <div className='mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg'>
                        <p className='text-orange-400 text-xs'>
                          {bountyStatus === 'Done'
                            ? 'This bounty has been completed and is no longer available.'
                            : `This bounty has reached the maximum number of participants (${participantCount}/5).`}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className='text-auth-text text-xs md:text-[16px] leading-[145%] md:mt-2'>
                    Bounty Details
                  </p>
                </div>

                {/* Body */}
                <div className='mt-8 flex flex-col gap-4'>
                  <div className='flex flex-col md:flex-row gap-2 md:items-center justify-between'>
                    <div className='md:w-[20%]'>
                      <p className='text-auth-text text-xs leading-[16px]'>
                        Participants
                      </p>
                    </div>
                    <div className='flex gap-3 items-center justify-start w-full'>
                      {fields?.Participants &&
                      fields.Participants.length > 0 ? (
                        fields.Participants.slice(0, 3).map(
                          (participant: User, index: number) => {
                            // Handle both User objects and string IDs
                            const isUserObject =
                              typeof participant === 'object' &&
                              participant !== null &&
                              'fields' in participant;
                            const userName = isUserObject
                              ? participant.fields?.Name
                              : typeof participant === 'string'
                                ? participant
                                : 'Unknown User';
                            const userInitials = userName
                              ? userName
                                  .split(' ')
                                  .map((n) => n.charAt(0))
                                  .join('')
                                  .toUpperCase()
                                  .substring(0, 2)
                              : 'UN';

                            return (
                              <div
                                key={index}
                                className='rounded-[16px] border border-auth-border bg-[#0F0F0F] px-1.5 py-1 flex items-center gap-2'
                              >
                                <div className='w-[24px] h-[24px] bg-auth-bg rounded-full text-[10px] text-[#3CB49D] leading-[16px] flex items-center justify-center'>
                                  {userInitials}
                                </div>
                                <span className='text-xs leading-[16px]'>
                                  {userName}
                                </span>
                              </div>
                            );
                          },
                        )
                      ) : (
                        <span className='text-xs text-auth-text'>
                          No participants yet
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row gap-2 md:items-center justify-between'>
                    <div className='md:w-[20%]'>
                      <p className='text-auth-text text-xs leading-[16px]'>
                        Due Date
                      </p>
                    </div>
                    <div className='w-full'>
                      <span className='text-xs md:text-sm md:leading-[145%]'>
                        {fields?.['Due Date']
                          ? formatDateToDayMonthYear(fields?.['Due Date'])
                          : ''}
                      </span>
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row gap-2 justify-between'>
                    <div className='w-[20%]'>
                      <p className='text-auth-text text-xs leading-[16px]'>
                        Description
                      </p>
                    </div>
                    <div className='w-full'>
                      <span className='text-xs md:text-sm md:leading-[145%]'>
                        {fields?.Description ||
                          "A little about the project and the team that you'll be working with. A little about the specifications you'll be working with. This is where the description goes little about the project and the team that you'll be working with."}
                      </span>
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row gap-2 justify-between'>
                    <div className='md:w-[20%]'>
                      <p className='text-auth-text text-xs leading-[16px]'>
                        Link
                      </p>
                    </div>
                    <div className='w-full flex items-center gap-2'>
                      <div className='rounded-[16px] bg-[#1A1A1A] px-3 py-1.5 flex items-center gap-2 w-fit cursor-pointer'>
                        <span className='text-sm leading-[145%] underline'>
                          https://www.github.co/homepagebugbj
                        </span>
                      </div>

                      <ExternalLink
                        width={20}
                        height={20}
                        className='inline-block'
                      />
                    </div>
                    {/* <ExternalLink
                          width={20}
                          height={20}
                          className='hidden md:inline-block'
                        /> */}
                  </div>

                  <div className='flex flex-col md:flex-row gap-2 justify-between'>
                    <div className='w-[20%]'>
                      <p className='text-auth-text text-xs leading-[16px]'>
                        Reward
                      </p>
                    </div>
                    <div className='w-full'>
                      <div className='flex items-center gap-2 w-fit cursor-pointer'>
                        <Image
                          src={cueCurrency}
                          alt='cue currency icon with gradient color'
                        />

                        <span className='text-xl md:text-2xl leading-[32px] font-semibold'>
                          {fields?.Reward
                            ? fields.Reward.toLocaleString()
                            : '18,400'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submission Form - Only show if user has claimed the bounty but not yet submitted */}
                  {isClaimed && !isSubmitted && (
                    <div className='space-y-4 p-4 bg-[#111111] rounded-lg border border-[#1F1F1F]'>
                      <h3 className='text-white font-semibold text-sm'>
                        Submit Your Work
                      </h3>

                      {submissionError && (
                        <div className='border border-red-500/20 bg-red-500/10 p-3 rounded-lg'>
                          <span className='text-red-400 text-sm'>
                            {submissionError}
                          </span>
                        </div>
                      )}

                      <div className='input-style'>
                        <Label htmlFor='submission-url' className=''>
                          Submission URL *
                        </Label>
                        <Input
                          type='url'
                          id='submission-url'
                          placeholder='https://github.com/your-repo/your-submission'
                          value={submissionUrl}
                          onChange={(e) => {
                            setSubmissionUrl(e.target.value);
                            if (urlError) setUrlError('');
                            if (submissionError) setSubmissionError('');
                          }}
                          className={urlError ? 'border-red-500' : ''}
                          disabled={isSubmitting}
                        />
                        {urlError && (
                          <span className='text-red-500 text-xs mt-1'>
                            {urlError}
                          </span>
                        )}
                        <div className='text-xs text-[#666] mt-1 space-y-1'>
                          <p>
                            Provide a link to your completed work. Accepted
                            platforms:
                          </p>
                          <ul className='list-disc list-inside text-[10px] ml-2 space-y-0.5'>
                            <li>GitHub/GitLab repositories</li>
                            <li>Live demos (Vercel, Netlify, etc.)</li>
                            <li>Code playgrounds (CodePen, CodeSandbox)</li>
                            <li>Design files (Figma, Dribbble)</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <div className='flex items-center justify-between mb-2'>
                          <Label className='text-sm font-medium text-auth-text'>
                            Comments (Optional)
                          </Label>
                          <span className='text-xs text-[#666]'>
                            {comments.length}/500
                          </span>
                        </div>
                        <CustomTextareaToolbar
                          value={comments}
                          onChange={(value) => {
                            if (value.length <= 500) {
                              setComments(value);
                            }
                          }}
                          disabled={isSubmitting}
                        />
                        <div className='text-xs text-[#666] mt-1'>
                          <p>Add any additional notes about your submission:</p>
                          <ul className='list-disc list-inside text-[10px] ml-2 mt-1 space-y-0.5'>
                            <li>Implementation approach</li>
                            <li>Technologies used</li>
                            <li>Challenges faced</li>
                            <li>Special features or considerations</li>
                          </ul>
                        </div>
                      </div>

                      {/* Submission Preview */}
                      {(submissionUrl.trim() || comments.trim()) &&
                        !submissionError && (
                          <div className='space-y-2 p-3 bg-[#0A0A0A] rounded-lg border border-[#1F1F1F]'>
                            <h4 className='text-white font-medium text-xs'>
                              Submission Preview
                            </h4>
                            {submissionUrl.trim() && (
                              <div>
                                <span className='text-[#666] text-xs'>
                                  URL:
                                </span>
                                <div className='mt-1 p-2 bg-[#111] rounded text-xs text-white break-all'>
                                  {submissionUrl}
                                </div>
                              </div>
                            )}
                            {comments.trim() && (
                              <div>
                                <span className='text-[#666] text-xs'>
                                  Comments:
                                </span>
                                <div className='mt-1 p-2 bg-[#111] rounded text-xs text-white whitespace-pre-wrap'>
                                  {comments.length > 100
                                    ? comments.substring(0, 100) + '...'
                                    : comments}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className='flex gap-4 justify-between items-center md:justify-end w-full mt-8'>
                  <Button
                    className='btn-secondary-p w-fit'
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>

                  <Button
                    className='btn-main-p w-fit relative'
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isFormValid || hasSubmitted}
                  >
                    {isSubmitting && (
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin'></div>
                      </div>
                    )}
                    <span
                      className={isSubmitting ? 'opacity-0' : 'opacity-100'}
                    >
                      {hasSubmitted ? 'Already Submitted' : 'Submit'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent
          aria-describedby={undefined}
          className='bg-[#0A0A0A] p-[20px] rounded-[12px] w-[70%] md:w-[35%]! max-w-[318px]! border-0 shadow-2xl'
        >
          <VisuallyHidden>
            <DialogTitle>Bounty Submission Success</DialogTitle>
          </VisuallyHidden>

          <div className='text-center'>
            <div className='flex justify-center'>
              <Image
                src={successCheckmark}
                alt='Success checkmark'
                width={80}
                height={80}
                className='mb-4'
              />
            </div>
            <h1 className='text-white text-xl leading-[100%] font-semibold mb-2'>
              Submission Successful!
            </h1>
            <p className='text-xs text-auth-text leading-[100%] mb-4'>
              Your bounty submission has been received and is under review. You
              will be notified once it&apos;s approved.
            </p>

            {/* {submissionId && (
              <div className='bg-[#111] p-3 rounded-lg mb-4'>
                <p className='text-xs text-[#666] mb-1'>Submission ID:</p>
                <p className='text-xs text-white font-mono'>{submissionId}</p>
              </div>
            )} */}

            <div className='bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] p-4 rounded-lg mb-4'>
              <div className='flex items-center justify-center gap-2 mb-2'>
                <span className='text-sm font-semibold text-white flex items-center gap-1'>
                  Potential Reward:
                  <Image
                    src={cueCurrency}
                    alt='cue currency icon'
                    width={20}
                    height={20}
                  />
                  {fields?.Reward ? fields.Reward.toLocaleString() : '18,400'}
                </span>
              </div>
              <p className='text-xs text-[#888] text-center'>
                Reward will be distributed upon approval
              </p>
            </div>

            {/* {submissionUrl && (
              <div className='mt-4 p-3 bg-[#111111] rounded border border-[#1F1F1F]'>
                <p className='text-xs text-auth-text mb-1'>Submitted:</p>
                <div className='flex items-center gap-2'>
                  <ExternalLink className='h-3 w-3 text-[#666]' />
                  <span className='text-xs text-white truncate'>
                    {submissionUrl}
                  </span>
                </div>
              </div>
            )} */}

            <div className='w-full text-center'>
              <Button
                className='btn-main-p '
                onClick={() => {
                  setOpenSuccess(false);
                  // Reset form for potential future submissions to other bounties
                  setSubmissionUrl('');
                  setComments('');
                  // setSubmissionId(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default BountyCard;
