'use client';

import React from 'react';
// import CustomSelectFilter from './custom-select-filter';
import Image from 'next/image';

import {
  Table,
  TableBody,
  //   TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import AvatarCircle from '@/images/avatar-circle.png';
// import CueCurrency from '@/svgs/cue-currency-dashboard.svg';
import CueCurrencyIcon from './cue-currency-icon';
import { PiCalendarBlankFill } from 'react-icons/pi';
import { useUsers } from '@/hooks/queries/useUsers';
import CustomSpinner from '@/components/custom/custom-spinner';

// Helper function to get user avatar
const getUserAvatar = (user: any) => {
  if (user.fields.Attachments && user.fields.Attachments.length > 0) {
    return user.fields.Attachments[0].url;
  }
  return AvatarCircle;
};

function LeaderboardTable() {
  // Fetch all users
  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useUsers();

  // Sort users by wallet balance (earnings) in descending order and take top 10
  const topUsers = usersData?.records
    ?.sort((a, b) => (b.fields['Total Earnings'] || 0) - (a.fields['Total Earnings'] || 0))
    .slice(0, 10) || [];

  if (isLoadingUsers) {
    return (
      <div className='bg-auth-bg border-[0.6px] border-auth-border shadow-[1px_1px_1px_0px_#10193466] rounded-[12px] py-4 lg:py-8'>
        <div className='flex justify-center items-center py-8'>
          <CustomSpinner />
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className='bg-auth-bg border-[0.6px] border-auth-border shadow-[1px_1px_1px_0px_#10193466] rounded-[12px] py-4 lg:py-8'>
        <div className='flex justify-center items-center py-8'>
          <div className='text-red-500 text-center'>
            <p>Error loading leaderboard: {usersError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-auth-bg border-[0.6px] border-auth-border shadow-[1px_1px_1px_0px_#10193466] rounded-[12px] py-4 lg:py-8'>
      <div className='flex justify-between items-center px-4 lg:px-12'>
        <h4 className='font-medium text-16c leading-[18px]'>
          Top Contributors
        </h4>

        {/* <CustomSelectFilter>
          <div className='flex items-center gap-0.5'>
            <PiCalendarBlankFill className='w-[10px] h-[10px]' />
            <span>Date</span>
          </div>
        </CustomSelectFilter> */}
      </div>

      <Table className='text-white mt-4'>
        {/* <TableCaption>Our top contributors.</TableCaption> */}
        <TableHeader className='[&_tr]:border-b-0'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='w-[35%]'>Developer Name</TableHead>
            <TableHead className='w-[25%]'>Total Projects</TableHead>
            <TableHead className='w-[25%]'>Status</TableHead>
            <TableHead className='text-right'>Total Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topUsers.map((user, idx) => {
            const isActive = user.fields.Status === 'Active';
            const totalEarnings = user.fields['Total Earnings'] || 0;
            const projectCount = user.fields.Projects?.length || 0;
            
            return (
              <TableRow
                key={user.id}
                className={`font-medium text-[10px] leading-14px hover:bg-[#1f1f1f]/50 ${isActive ? 'bg-[#0F0F0F]' : ''}`}
              >
                <TableCell className='flex items-center gap-2'>
                  <Image 
                    src={getUserAvatar(user)} 
                    alt={`${user.fields.Name} avatar`} 
                    width={16} 
                    height={16}
                    className="rounded-full"
                  />
                  <span>{user.fields.Name}</span>
                </TableCell>
                <TableCell
                  className={`${user.fields.Status === 'Active' ? 'text-white' : 'text-[#AEB9E1]'}`}
                >
                  {projectCount}
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 ${user.fields.Status === 'Active' ? 'active-status' : (user.fields.Status === 'Inactive' ? 'inactive-status' : 'canceled-status')} w-fit`}>
                    <div className={`w-[3px] h-[3px] rounded-full inline-block ${user.fields.Status === 'Active' ? 'bg-[#05C168]' : (user.fields.Status === 'Inactive' ? 'bg-[#FFB016]' : 'bg-[#FF5A65]')}`} />
                    <span>{user.fields.Status}</span>
                  </div>
                </TableCell>
                <TableCell
                  className={`flex items-center gap-1 ${isActive ? 'text-white' : 'text-[#AEB9E1]'}`}
                >
                  <CueCurrencyIcon
                    width={10}
                    height={10}
                    color={isActive ? 'white' : '#AEB9E1'}
                  />
                  <span>{totalEarnings.toLocaleString()}</span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default LeaderboardTable;
