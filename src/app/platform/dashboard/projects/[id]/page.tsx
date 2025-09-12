'use client';

import React, { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { FaCode } from 'react-icons/fa6';
// import { PiCalendarBlank, PiCalendarBlankFill } from 'react-icons/pi';
// import CustomSelectFilter from '@/components/custom/dashboard/custom-select-filter';
import { PiCalendarBlank } from 'react-icons/pi';
import { CiSearch } from 'react-icons/ci';
import { Input } from '@/components/ui/input';
import BountyCard from '@/components/custom/dashboard/projects/bounty-card';
import { useParams, useRouter } from 'next/navigation';
import {
  useFetchProject,
  useUserCompletedBounties,
  useAllCompletedBounties,
  useUserInProgressBounties,
  useAvailableBounties,
} from '@/hooks/queries/useProjects';
import { formatDateToDayMonthYear } from '@/lib/utils';
import CustomSpinner from '@/components/custom/custom-spinner';
// import { Bounty } from '@/types/bounties';
import { useAuth } from '@/hooks/queries/useAuth';

function ProjectDetailsPage() {
  const { id: projectId } = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<
    'new' | 'in-progress' | 'completed'
  >('new');
  const [completedFilter, setCompletedFilter] = useState<
    'my-completed' | 'all-completed'
  >('my-completed');

  const { user } = useAuth();
  const { data, isLoading, error } = useFetchProject(
    projectId?.toString() || '',
  );
  const fields = data?.fields;

  // Use new hooks for user-centric bounty data
  const { data: userCompletedBounties } = useUserCompletedBounties(
    user?.id || '',
  );
  const { data: allCompletedBounties } = useAllCompletedBounties();
  const { data: userInProgressBounties } = useUserInProgressBounties(
    user?.id || '',
  );
  const { data: availableBounties } = useAvailableBounties(user?.id || '');

  // Filter bounties by search term
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterBountiesBySearch = (bounties: any[]) => {
    if (!searchTerm) return bounties;
    return bounties.filter(
      (bounty) =>
        bounty.fields.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bounty.fields.Description?.toLowerCase().includes(
          searchTerm.toLowerCase(),
        ),
    );
  };

  // Get bounties for the active tab
  const getBountiesForActiveTab = () => {
    switch (activeTab) {
      case 'completed':
        const completedBounties =
          completedFilter === 'my-completed'
            ? userCompletedBounties
            : allCompletedBounties;
        return filterBountiesBySearch(completedBounties || []);
      case 'in-progress':
        return filterBountiesBySearch(userInProgressBounties || []);
      case 'new':
        return filterBountiesBySearch(availableBounties || []);
      default:
        return [];
    }
  };

  const currentBounties = getBountiesForActiveTab();

  if (isLoading) {
    return <CustomSpinner />;
  }

  if (error) {
    return (
      <div className='p-5 md:p-9 xl:p-12 w-full'>
        <div className='text-red-500'>
          Error loading project: {error.message}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='p-5 md:p-9 xl:p-12 w-full'>
        <div className='text-auth-text'>Project not found</div>
      </div>
    );
  }

  return (
    <div className='p-5 md:p-9 xl:p-12 w-full'>
      {/* Heading */}
      <div className='flex items-center justify-between mb-6 lg:mb-10'>
        <div>
          <div className='text-auth-text text-sm leading-[140%] flex items-center gap-4'>
            <span>Projects</span>
            <ChevronRight width={16} height={16} />
            <span>Bounties</span>
          </div>

          <div className='flex items-center gap-4 text-auth-text mt-6'>
            <ArrowLeft width={24} height={24} onClick={() => router.back()} />
            <h1 className='text-2xl font-semibold text-white'>
              Project Details
            </h1>
          </div>
        </div>
      </div>

      {/* Description card */}
      <div className='flex justify-between'>
        <Card className='card-container p-6 h-fit md:h-[204px] w-full'>
          <CardContent className='p-0 text-auth-text'>
            <div className='flex flex-wrap items-center gap-6'>
              <div className='flex items-center gap-4'>
                {fields?.Tools.map((tool: string, index: number) => (
                  <div
                    key={index}
                    className='flex gap-2 items-center bg-[#0F0F0F] border-[0.6px] border-[#1F1F1F] p-2 text-white font-medium text-xs rounded-[2px]'
                  >
                    <FaCode className='text-[#545454] w-3 h-3' />
                    <span>{tool}</span>
                  </div>
                ))}
              </div>

              <div className='flex items-center gap-1'>
                <div
                  className='w-[10px] h-[10px] rounded-full inline-block'
                  style={{
                    backgroundColor:
                      fields?.Status === 'In Progress'
                        ? '#FDB52A'
                        : fields?.Status === 'Completed'
                          ? '#14CA74'
                          : fields?.Status === 'New'
                            ? '#32ADE6'
                            : '#A0A0A0',
                  }}
                />
                <span>{fields?.Status || 'Unknown'}</span>
              </div>

              <div className='flex items-center gap-1'>
                <PiCalendarBlank />
                <span>
                  Date Created: {formatDateToDayMonthYear(fields?.Created_at)}
                </span>
              </div>
            </div>

            <h3 className='text-white text-[20px] leading-[120%] -tracking-[2%] font-semibold mt-6'>
              {fields?.Name || 'Project Name'}
            </h3>
            <p className='text-auth-text text-xs leading-[16px] mt-3 w-[80%]'>
              {fields?.Description ||
                'This is a placeholder description for the project. It can be replaced with actual project details.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bounties List */}
      <div className='mt-8 md:mt-12'>
        <div className='flex flex-col gap-6 md:flex-row justify-between md:items-center'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center justify-between md:w-[60%] xl:w-[50%]'>
            <h4 className='font-medium text-16c leading-[18px]'>
              Bounties ({currentBounties.length})
            </h4>

            <div className='relative w-full md:w-[75%] max-w-[375px] text-auth-text'>
              <CiSearch className='absolute left-3 top-1/2 -translate-y-1/2' />
              <Input
                type='text'
                placeholder='Search for bounties...'
                className='pl-10 border-auth-border bg-darkmode-bg text-xs rounded-[4px]'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className='mt-8 flex gap-4 border-b border-auth-border'>
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'new'
                ? 'text-white border-b-2 border-white'
                : 'text-auth-text hover:text-white'
            }`}
          >
            New ({availableBounties?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('in-progress')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'in-progress'
                ? 'text-white border-b-2 border-white'
                : 'text-auth-text hover:text-white'
            }`}
          >
            In Progress ({userInProgressBounties?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === 'completed'
                ? 'text-white border-b-2 border-white'
                : 'text-auth-text hover:text-white'
            }`}
          >
            Completed ({userCompletedBounties?.length || 0})
          </button>
        </div>

        {/* Completed Tab Filter */}
        {activeTab === 'completed' && (
          <div className='mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setCompletedFilter('my-completed')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
                  completedFilter === 'my-completed'
                    ? 'btn-main-p'
                    : 'btn-secondary-p'
                }`}
              >
                My Completed
              </button>
              <button
                onClick={() => setCompletedFilter('all-completed')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-200 ${
                  completedFilter === 'all-completed'
                    ? 'btn-main-p'
                    : 'btn-secondary-p'
                }`}
              >
                All Completed
              </button>
            </div>
            <span className='text-auth-text text-sm'>
              {completedFilter === 'my-completed'
                ? `Showing ${userCompletedBounties?.length || 0} of your completed bounties`
                : `Showing ${allCompletedBounties?.length || 0} completed bounties in project`}
            </span>
          </div>
        )}

        {/* Bounties Grid */}
        <div className='mt-8'>
          {currentBounties.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {currentBounties.map((bounty) => (
                <BountyCard key={bounty.id} bounty={bounty} />
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <div className='text-auth-text text-lg mb-2'>
                {activeTab === 'new' && 'No available bounties to claim'}
                {activeTab === 'in-progress' && 'No bounties in progress'}
                {activeTab === 'completed' && 'No completed bounties'}
              </div>
              <p className='text-auth-text text-sm'>
                {activeTab === 'new' &&
                  'Check back later for new bounties to work on'}
                {activeTab === 'in-progress' &&
                  'Start claiming bounties to see them here'}
                {activeTab === 'completed' &&
                  'Complete some bounties to see them here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
