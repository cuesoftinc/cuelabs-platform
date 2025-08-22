'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import AvatarCircle from '@/images/avatar-circle.png';
import CueCurrencyIcon from './cue-currency-icon';
import { useUsers } from '@/hooks/queries/useUsers';
import CustomSpinner from '@/components/custom/custom-spinner';

// Helper function to get user avatar
const getUserAvatar = (user: any) => {
  if (user.fields.Attachments && user.fields.Attachments.length > 0) {
    return user.fields.Attachments[0].url;
  }
  return AvatarCircle;
};

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

function FullLeaderboardTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Show 20 users per page

  // Fetch all users
  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useUsers();

  // Sort users by total earnings in descending order
  const sortedUsers = usersData?.records
    ?.sort((a, b) => (b.fields['Total Earnings'] || 0) - (a.fields['Total Earnings'] || 0)) || [];

  // Calculate pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  if (isLoadingUsers) {
    return (
      <div className='bg-auth-bg border-[0.6px] border-auth-border shadow-[1px_1px_1px_0px_#10193466] rounded-[12px] py-4 lg:py-8'>
        <div className='flex justify-center items-center py-8'>
          <CustomSpinner />
          <span className='ml-2 text-white'>Loading leaderboard...</span>
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
      <div className='flex justify-between items-center px-4 lg:px-12 mb-6'>
        <h4 className='font-medium text-16c leading-[18px]'>
          All Contributors ({sortedUsers.length} users)
        </h4>
        
        <div className='text-auth-text text-sm'>
          Page {currentPage} of {totalPages}
        </div>
      </div>

      <Table className='text-white'>
        <TableHeader className='[&_tr]:border-b-0'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='w-[10%]'>Rank</TableHead>
            <TableHead className='w-[35%]'>Developer Name</TableHead>
            <TableHead className='w-[20%]'>Total Projects</TableHead>
            <TableHead className='w-[20%]'>Status</TableHead>
            <TableHead className='text-right'>Total Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user, idx) => {
            const globalRank = startIndex + idx + 1;
            const isActive = user.fields.Status === 'Active';
            const totalEarnings = user.fields['Total Earnings'] || 0;
            const projectCount = user.fields.Projects?.length || 0;
            
            return (
              <TableRow
                key={user.id}
                className={`font-medium text-[10px] leading-14px hover:bg-[#1f1f1f]/50 ${isActive ? 'bg-[#0F0F0F]' : ''}`}
              >
                <TableCell className='text-center'>
                  <span className='text-auth-text font-bold'>
                    #{globalRank}
                  </span>
                </TableCell>
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
                  className={`${isActive ? 'text-white' : 'text-[#AEB9E1]'}`}
                >
                  {projectCount}
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 ${isActive ? 'active-status' : (user.fields.Status === 'Inactive' ? 'inactive-status' : 'canceled-status')} w-fit`}>
                    <div className={`w-[3px] h-[3px] rounded-full inline-block ${isActive ? 'bg-[#05C168]' : (user.fields.Status === 'Inactive' ? 'bg-[#FFB016]' : 'bg-[#FF5A65]')}`} />
                    <span>{user.fields.Status}</span>
                  </div>
                </TableCell>
                <TableCell
                  className={`flex items-center gap-1 justify-end ${isActive ? 'text-white' : 'text-[#AEB9E1]'}`}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center items-center gap-2 mt-6 px-4 lg:px-12'>
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant='outline'
            size='sm'
            className='border-auth-border bg-darkmode-bg text-white hover:bg-[#1f1f1f]'
          >
            Previous
          </Button>
          
          <div className='flex gap-1'>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size='sm'
                  className={currentPage === pageNum 
                    ? 'bg-white text-black hover:bg-gray-200' 
                    : 'border-auth-border bg-darkmode-bg text-white hover:bg-[#1f1f1f]'
                  }
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant='outline'
            size='sm'
            className='border-auth-border bg-darkmode-bg text-white hover:bg-[#1f1f1f]'
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default FullLeaderboardTable;
