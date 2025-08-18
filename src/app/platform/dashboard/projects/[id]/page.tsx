'use client';

import React, { useMemo, useState } from 'react';

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
import { useFetchProject } from '@/hooks/queries/useProjects';
import { formatDateToDayMonthYear } from '@/lib/utils';
import CustomSpinner from '@/components/custom/custom-spinner';
import { Bounty } from '@/types/bounties';

function ProjectDetailsPage() {
  const { id: projectId } = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useFetchProject(
    projectId?.toString() || '',
  );
  const fields = data?.fields;
  // console.log(data);
  const bounties = (fields?.Bounties as Bounty[]) || [];

  // Group bounties by status and filter by search term
  const groupedBounties = useMemo(() => {
    const filtered = bounties.filter((bounty) => {
      if (!searchTerm) return true;
      return (
        bounty.fields.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bounty.fields.Description?.toLowerCase().includes(
          searchTerm.toLowerCase(),
        )
      );
    });

    const groups = {
      New: filtered.filter((bounty) => bounty.fields.Status === 'New'),
      'In progress': filtered.filter(
        (bounty) => bounty.fields.Status === 'In progress',
      ),
      Done: filtered.filter((bounty) => bounty.fields.Status === 'Done'),
    };

    return groups;
  }, [bounties, searchTerm]);

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
              Bounties ({bounties.length})
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

          {/* <div className='flex gap-4 items-center justify-between w-fit md:w-[27%] xl:w-[20%]'>
            <CustomSelectFilter>
              <span>Status</span>
            </CustomSelectFilter>

            <CustomSelectFilter>
              <div className='flex items-center gap-0.5'>
                <PiCalendarBlankFill className='w-[10px] h-[10px]' />
                <span>Date</span>
              </div>
            </CustomSelectFilter>
          </div> */}
        </div>

        <div className='mt-10 w-full flex gap-5 justify-between overflow-auto max-h-[80vh]'>
          <div className='min-w-[200px] md:w-[31.5%] max-w-[329px]'>
            <div className='card-container h-[50px] rounded-[8px] flex items-center justify-center gap-1 text-sm font-medium text-dashboard-nav'>
              <span>New</span>
              <div className='border-[0.6px] border-[#575DFF80] rounded-[2px] px-1 py-0.5 text-[10px] text-[#D1DBF9] flex items-center bg-[#575DFF33]'>
                {groupedBounties.New.length}
              </div>
            </div>

            <div className='flex flex-col gap-5 mt-5'>
              {groupedBounties.New.length > 0 ? (
                groupedBounties.New.map((bounty) => (
                  <BountyCard key={bounty.id} bounty={bounty} />
                ))
              ) : (
                <div className='text-auth-text text-sm text-center py-8'>
                  No new bounties
                </div>
              )}
              {/* <BountyCard />
              <BountyCard category='design' /> */}
            </div>
          </div>

          <div className='min-w-[200px] md:w-[31.5%] max-w-[329px]'>
            <div className='card-container h-[50px] rounded-[8px] flex items-center justify-center gap-1 text-sm font-medium text-dashboard-nav'>
              <span>In Progress</span>
              <div className='border-[0.6px] border-[#575DFF80] rounded-[2px] px-1 py-0.5 text-[10px] text-[#D1DBF9] flex items-center bg-[#575DFF33]'>
                {groupedBounties['In progress'].length}
              </div>
            </div>

            <div className='flex flex-col gap-5 mt-5'>
              {groupedBounties['In progress'].length > 0 ? (
                groupedBounties['In progress'].map((bounty) => (
                  <BountyCard key={bounty.id} bounty={bounty} />
                ))
              ) : (
                <div className='text-auth-text text-sm text-center py-8'>
                  No bounties in progress
                </div>
              )}
              {/* <BountyCard />
              <BountyCard category='design' />
              <BountyCard /> */}
            </div>
          </div>

          <div className='min-w-[200px] md:w-[31.5%] max-w-[329px]'>
            <div className='card-container h-[50px] rounded-[8px] flex items-center justify-center gap-1 text-sm font-medium text-dashboard-nav'>
              <span>Completed</span>
              <div className='border-[0.6px] border-[#575DFF80] rounded-[2px] px-1 py-0.5 text-[10px] text-[#D1DBF9] flex items-center bg-[#575DFF33]'>
                {groupedBounties.Done.length}
              </div>
            </div>

            <div className='flex flex-col gap-5 mt-5'>
              {groupedBounties.Done.length > 0 ? (
                groupedBounties.Done.map((bounty) => (
                  <BountyCard key={bounty.id} bounty={bounty} />
                ))
              ) : (
                <div className='text-auth-text text-sm text-center py-8'>
                  No completed bounties
                </div>
              )}
              {/* <BountyCard />
              <BountyCard />
              <BountyCard category='design' />
              <BountyCard /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
