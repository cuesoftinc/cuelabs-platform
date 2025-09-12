'use client';

import React from 'react';
import Image from 'next/image';

import { ArrowDown, ArrowUpRight } from 'lucide-react';

import { PiTimerFill, PiPuzzlePieceFill } from 'react-icons/pi';
import { IoIosStar } from 'react-icons/io';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import ProjectCard from '@/components/custom/dashboard/project-card';

import cueCurrency from '@/svgs/cue-currency-dashboard.svg';
import chart from '@/svgs/overview-chart.svg';
import LeaderboardTable from '@/components/custom/dashboard/leaderboard-table';
import CustomSelectFilter from '@/components/custom/dashboard/custom-select-filter';
import { PiCalendarBlankFill } from 'react-icons/pi';

import { useUser, useUsers } from '@/hooks/queries/useUsers';
import { useAuth } from '@/hooks/queries/useAuth';
import { useFetchProjects } from '@/hooks/queries/useProjects';
import { useQuery } from '@tanstack/react-query';
import CustomSpinner from '@/components/custom/custom-spinner';
import BountyCard from '@/components/custom/dashboard/projects/bounty-card';
import { Bounty } from '@/types/bounties';
import { airtableClient } from '@/lib/airtable';

// Helper function to get ordinal suffix
const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
};

function DashboardPage() {
  const { user } = useAuth();

  // Use the authenticated user from Redux instead of hardcoded ID
  const userId = user?.id;

  // Fetch the user data
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useUser(userId || '');

  // Fetch all users for metrics calculation
  const { data: usersData } = useUsers();

  // Fetch all projects
  const { data: projectsData, isLoading: isLoadingProjects } =
    useFetchProjects();

  // Get current user's total earnings
  const totalEarnings = userData?.fields['Total Earnings'] || 0;

  // Get user's active bounties from their profile
  const userActiveBounties: (string | Bounty)[] =
    userData?.fields['Active Bounties'] || [];

  // Check if user can claim more bounties (limit of 3)
  const canClaimMoreBounties = (userActiveBounties?.length || 0) < 3;
  const claimedBountiesCount = userActiveBounties?.length || 0;

  // Fetch the actual bounty details for the user's active bounties
  const { data: claimedBounties, isLoading: isLoadingClaimedBounties } =
    useQuery({
      queryKey: ['user-active-bounties', userId, userActiveBounties],
      queryFn: async () => {
        if (!userActiveBounties || userActiveBounties.length === 0) {
          return [];
        }

        // Extract bounty IDs (handle both string IDs and Bounty objects)
        const bountyIds = userActiveBounties
          .map((bounty) => {
            if (typeof bounty === 'string') {
              return bounty;
            } else if (bounty && typeof bounty === 'object' && 'id' in bounty) {
              return bounty.id;
            }
            return null;
          })
          .filter(Boolean) as string[];

        if (bountyIds.length === 0) {
          return [];
        }

        // Fetch bounty details using the IDs
        const bountyRecordsQuery = bountyIds
          .map((id) => `RECORD_ID()="${id}"`)
          .join(',');

        const response = await airtableClient.getRecords('Bounties', {
          filterByFormula: `OR(${bountyRecordsQuery})`,
        });

        return response.records || [];
      },
      enabled:
        !!userData && !!userActiveBounties && userActiveBounties.length > 0,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  // Find current user's rank
  const getUserRank = () => {
    if (!userData || !usersData?.records) return null;

    const sortedUsers = [...usersData.records].sort(
      (a, b) =>
        (b.fields['Total Earnings'] || 0) - (a.fields['Total Earnings'] || 0),
    );

    const userIndex = sortedUsers.findIndex((user) => user.id === userData.id);
    return userIndex >= 0 ? userIndex + 1 : null;
  };

  const userRank = getUserRank();
  const userRankPercentage = usersData?.records
    ? Math.round(((userRank || 0) / usersData.records.length) * 100)
    : 0;

  // Select 3 random projects
  const getRandomProjects = () => {
    if (!projectsData?.records || projectsData.records.length === 0) {
      return [];
    }

    const shuffled = [...projectsData.records].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const recommendedProjects = getRandomProjects();

  // User is already set in Redux from the login flow, no need to set it again

  // Show loading state while fetching user
  if (isLoadingUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <CustomSpinner />
      </div>
    );
  }

  // Show error state if user fetch fails
  if (userError) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-red-500 text-center'>
          <h2 className='text-xl font-semibold mb-2'>Error Loading User</h2>
          <p>{userError.message}</p>
        </div>
      </div>
    );
  }

  // Show loading state if no user data yet
  if (!userData) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <CustomSpinner />
      </div>
    );
  }

  return (
    <div className='p-5 md:p-9 lg:p-12 w-full'>
      {/* Heading */}
      <div className='flex flex-col gap-3 md:gap-0 md:flex-row items-center justify-between mb-8'>
        <div className=' w-full md:w-fit'>
          <h1 className='text-xl md:text-2xl font-bold text-white'>
            Welcome {userData.fields.Name}!
          </h1>
          <p className='text-auth-text text-xs md:mt-1'>
            General overview and activity
          </p>
        </div>

        <div className='flex items-center gap-4 flex-wrap'>
          <Button className='btn-secondary-p'>
            Export data <ArrowDown />
          </Button>

          <Button className='btn-main-p w-fit'>Create report</Button>
        </div>
      </div>

      {/* Overview cards */}
      <div className='flex flex-col md:flex-row gap-5 justify-between'>
        <Card className='card-container p-3 md:p-6 md:w-[62%] max-w-[647px] gap-5'>
          <CardHeader className='p-0'>
            <CardTitle className='text-dashboard-nav flex gap-1 items-center font-medium text-xs'>
              <PiTimerFill className='w-3 h-3' />
              <span className=''>Total Earnings</span>
            </CardTitle>
            <CardDescription className='flex items-center gap-1'>
              <Image
                src={cueCurrency}
                alt='Cue Currency'
                className='w-[23.1px] h-[18.73px]'
              />
              <span className='text-white text-lg md:text-xl lg:text-2xl font-semibold'>
                {totalEarnings.toLocaleString()}
              </span>

              <div className='active-status'>
                <span>This Week</span>
                <ArrowUpRight className='w-3 h-3' />
              </div>
            </CardDescription>
            <CardAction className=''>
              <CustomSelectFilter>
                <div className='flex items-center gap-0.5'>
                  <PiCalendarBlankFill className='w-[10px] h-[10px]' />
                  <span>This Week</span>
                </div>
              </CustomSelectFilter>
            </CardAction>
          </CardHeader>

          <CardContent className='p-0 min-h-[60%]'>
            <Image src={chart} alt='Earnings Chart' className='w-full h-full' />
          </CardContent>
        </Card>

        <div className='flex flex-col gap-6 md:w-[36%] max-w-[375px]'>
          <Card className='card-container p-4 lg:p-6 h-[115px]'>
            <CardContent className='p-0'>
              <div className='text-dashboard-nav flex gap-1 items-center font-medium text-xs'>
                <IoIosStar className='w-3 h-3' />
                <span className=''>Wallet Balance</span>
              </div>

              {/* <div> */}
              <div className='flex items-center gap-1  mt-4'>
                <Image
                  src={cueCurrency}
                  alt='Cue Currency'
                  className='w-[23.1px] h-[18.73px]'
                />
                <span className='text-white text-3xl lg:text-[40px] leading-[32px] font-semibold'>
                  {userData.fields['Wallet Balance']?.toLocaleString() || '0'}
                </span>
              </div>
              {/* </div> */}
            </CardContent>
          </Card>

          <Card className='card-container p-4 lg:p-6 h-[115px]'>
            <CardContent className='p-0'>
              <div className='flex items-center justify-between'>
                <div className='text-dashboard-nav flex gap-1 items-center font-medium text-xs'>
                  <IoIosStar className='w-3 h-3' />
                  <span className=''>Rank</span>
                </div>

                <div className='flex items-center gap-1'>
                  <span className='text-[#7E89AC] text-sm'>
                    You&apos;re in{' '}
                  </span>
                  <div className='active-status'>
                    <span>Top {userRankPercentage}%</span>
                  </div>
                </div>
              </div>

              <div className='mt-4'>
                <span className='text-white text-3xl lg:text-[40px] leading-[32px] font-semibold'>
                  {userRank
                    ? `${userRank}${getOrdinalSuffix(userRank)}`
                    : 'N/A'}
                </span>
              </div>
              {/* </div> */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Claimed Bounties Section */}
      <div className='my-12'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-2xl leading-[32px] font-semibold'>
            My Claimed Bounties
          </h2>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-auth-text'>
              {claimedBountiesCount}/3 claimed
            </span>
            {!canClaimMoreBounties && (
              <div className='px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg'>
                <span className='text-yellow-400 text-xs font-medium'>
                  Limit reached
                </span>
              </div>
            )}
          </div>
        </div>

        {isLoadingClaimedBounties ? (
          <div className='flex items-center justify-center py-8'>
            <CustomSpinner />
          </div>
        ) : claimedBounties && claimedBounties.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {claimedBounties.map((bounty) => (
              <div key={bounty.id} className='h-full'>
                <BountyCard
                  bounty={bounty as Bounty}
                  canClaimMoreBounties={canClaimMoreBounties}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center p-12 bg-[#0F0F0F] border border-[#1F1F1F] rounded-lg'>
            <div className='text-auth-text mb-4'>
              <PiPuzzlePieceFill className='w-12 h-12 mx-auto mb-4 text-[#545454]' />
              <h3 className='text-lg font-semibold text-white mb-2'>
                No Bounties Claimed Yet
              </h3>
              <p className='text-sm text-auth-text'>
                Start claiming bounties to earn rewards and build your
                portfolio.
              </p>
            </div>
            <Button
              className='btn-main-p'
              onClick={() =>
                (window.location.href = '/platform/dashboard/projects')
              }
            >
              Browse Projects
            </Button>
          </div>
        )}
      </div>

      {/* Recommended projects */}
      <div className='my-12'>
        <h2 className='text-2xl leading-[32px] font-semibold'>
          Recommended Projects
        </h2>

        {isLoadingProjects ? (
          <div className='mt-4 flex items-center justify-center py-8'>
            <CustomSpinner />
            <span className='ml-2 text-white'>Loading projects...</span>
          </div>
        ) : recommendedProjects.length > 0 ? (
          <div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
            {recommendedProjects.map((project) => (
              <div key={project.id} className='h-full'>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className='mt-4 text-center py-8'>
            <p className='text-auth-text'>No projects available</p>
          </div>
        )}
      </div>

      <div>
        <h2 className='text-2xl leading-[32px] font-semibold'>Leaderboard</h2>
        <div className='my-4'>
          <LeaderboardTable />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
