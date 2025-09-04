'use client';

import React from 'react';
import Image from 'next/image';

import { ArrowUpRight } from 'lucide-react';

import { PiTimerFill } from 'react-icons/pi';
// import { IoIosStar } from 'react-icons/io';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import cueCurrency from '@/svgs/cue-currency-dashboard.svg';
import chart from '@/svgs/overview-chart.svg';
import FullLeaderboardTable from '@/components/custom/dashboard/full-leaderboard-table';
import CustomSelectFilter from '@/components/custom/dashboard/custom-select-filter';
import { PiCalendarBlankFill } from 'react-icons/pi';
import { useUsers } from '@/hooks/queries/useUsers';
// import { useAuth } from '@/hooks/queries/useAuth';
import CustomSpinner from '@/components/custom/custom-spinner';

function LeaderboardPage() {
  // const { user: currentUser } = useAuth();
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();

  // Calculate total earnings across all users
  const totalEarnings =
    usersData?.records?.reduce((sum, user) => {
      return sum + (user.fields['Total Earnings'] || 0);
    }, 0) || 0;

  // Find current user's rank
  // const getUserRank = () => {
  //   if (!currentUser || !usersData?.records) return null;

  //   const sortedUsers = [...usersData.records].sort(
  //     (a, b) =>
  //       (b.fields['Total Earnings'] || 0) - (a.fields['Total Earnings'] || 0),
  //   );

  //   const userIndex = sortedUsers.findIndex(
  //     (user) => user.id === currentUser.id,
  //   );
  //   return userIndex >= 0 ? userIndex + 1 : null;
  // };

  // const userRank = getUserRank();
  // const userRankPercentage = usersData?.records ?
  //   Math.round(((userRank || 0) / usersData.records.length) * 100) : 0;

  if (isLoadingUsers) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <CustomSpinner />
      </div>
    );
  }

  return (
    <div className='p-5 md:p-9 lg:p-12 w-full'>
      {/* Heading */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-white'>
            Leaderboard
          </h1>
        </div>
      </div>

      {/* Overview cards */}
      <div className='flex flex-col md:flex-row gap-5 justify-between'>
        <Card className='card-container p-3 md:p-6 md:w-[62%] max-w-[647px]'>
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
                <span>{usersData?.records?.length || 0} Users</span>
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

        {/* <div className='flex flex-col gap-6 md:w-[36%] max-w-[375px]'>
          <Card className='card-container p-4 lg:p-6 h-[115px]'>
            <CardContent className='p-0'>
              <div className='text-dashboard-nav flex gap-1 items-center font-medium text-xs'>
                <IoIosStar className='w-3 h-3' />
                <span className=''>Wallet Balance</span>
              </div>

            
              <div className='flex items-center gap-1  mt-4'>
                <Image
                  src={cueCurrency}
                  alt='Cue Currency'
                  className='w-[23.1px] h-[18.73px]'
                />
                <span className='text-white text-3xl lg:text-[40px] leading-[32px] font-semibold'>
                  {currentUser?.fields['Wallet Balance']?.toLocaleString() || '0'}
                </span>
              </div>
            
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
                  {userRank ? `${userRank}${getOrdinalSuffix(userRank)}` : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>

      <div className='mt-8'>
        {/* <h2 className='text-2xl leading-[32px] font-semibold'>Leaderboard</h2> */}
        <div className='my-4'>
          <FullLeaderboardTable />
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
