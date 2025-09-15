'use client';

import React, { useState, useMemo } from 'react';
import { useAllBounties } from '@/hooks/queries/useAdmin';
import BountyManagement from '@/components/custom/admin/bounty-management';
import CustomSpinner from '@/components/custom/custom-spinner';
import { Input } from '@/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import { Bounty } from '@/types/bounties';

function AdminBountiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: allBounties, isLoading, error } = useAllBounties();

  // Filter bounties based on search term and status
  const filteredBounties = useMemo(() => {
    if (!allBounties) return [];
    
    let filtered = allBounties as Bounty[];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (bounty: Bounty) => bounty.fields.Status === statusFilter,
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((bounty: Bounty) => {
        const name = bounty.fields.Name?.toLowerCase() || '';
        const description = bounty.fields.Description?.toLowerCase() || '';
        const genre = bounty.fields.Genre?.toLowerCase() || '';

        return (
          name.includes(searchLower) ||
          description.includes(searchLower) ||
          genre.includes(searchLower)
        );
      });
    }

    return filtered;
  }, [allBounties, searchTerm, statusFilter]);

  // Get status counts for filter buttons
  const statusCounts = useMemo(() => {
    if (!allBounties) return { all: 0, New: 0, 'In progress': 0, Done: 0 };
    
    const bounties = allBounties as Bounty[];
    return {
      all: bounties.length,
      New: bounties.filter((b: Bounty) => b.fields.Status === 'New').length,
      'In progress': bounties.filter(
        (b: Bounty) => b.fields.Status === 'In progress',
      ).length,
      Done: bounties.filter((b: Bounty) => b.fields.Status === 'Done').length,
    };
  }, [allBounties]);

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
        <div className='text-red-500 text-lg mb-2'>Error Loading Bounties</div>
        <p className='text-auth-text text-sm'>{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-white mb-2'>
          Bounties Management
        </h1>
        <p className='text-auth-text text-sm'>
          View and manage all bounties in the system
        </p>
      </div>

      {/* Search and Filters */}
      <div className='mb-6 space-y-4'>
        {/* Search Bar */}
        <div className='relative max-w-md'>
          <CiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-auth-text' />
          <Input
            type='text'
            placeholder='Search bounties...'
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
              {status === 'all' ? 'All' : status} ({count})
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className='text-auth-text text-sm'>
          Showing {filteredBounties.length} of {allBounties?.length || 0}{' '}
          bounties
        </div>
      </div>

      {/* Bounties List */}
      {filteredBounties.length > 0 ? (
        <div className='space-y-4'>
          {filteredBounties.map((bounty: Bounty) => (
            <BountyManagement key={bounty.id} bounty={bounty} />
          ))}
        </div>
      ) : (
        <div className='bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-12'>
          <div className='text-center'>
            <div className='text-auth-text text-lg mb-2'>
              {searchTerm || statusFilter !== 'all'
                ? 'No matching bounties found'
                : 'No bounties found'}
            </div>
            <p className='text-auth-text text-sm'>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'There are no bounties in the system yet'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBountiesPage;
