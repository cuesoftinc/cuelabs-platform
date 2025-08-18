'use client';

import React from 'react';
import CustomSelectFilter from '@/components/custom/dashboard/custom-select-filter';
import { columns } from '@/components/custom/dashboard/projects/columns';
import { DataTable } from '@/components/custom/dashboard/projects/data-table';
import { Card, CardContent } from '@/components/ui/card';
import { PiCalendarBlankFill } from 'react-icons/pi';
import { Input } from '@/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import { useFetchProjects } from '@/hooks/queries/useProjects';
import CustomSpinner from '@/components/custom/custom-spinner';

// const projectsData: Project[] = [
//   {
//     name: 'Expendit',
//     reward: 450,
//     participants: 5,
//     status: 'new',
//   },
//   {
//     name: 'Apparule',
//     reward: 450,
//     participants: 5,
//     status: 'completed',
//   },
//   {
//     name: 'Upstat',
//     reward: 450,
//     participants: 5,
//     status: 'in-progress',
//   },
//   {
//     name: 'Storefront',
//     reward: 450,
//     participants: 5,
//     status: 'completed',
//   },
// ];

function ProjectsPage() {
  // const params: Record<string, string> = {
  //   view: 'Grid view',
  //   maxRecords: '5',
  // };
  const { data: projectsData, isLoading } = useFetchProjects();

  // console.log('Projects Data:', projectsData);

  if (isLoading) {
    return <CustomSpinner />;
  }

  return (
    <div className='p-5 md:p-9 lg:p-12 w-full'>
      {/* Heading */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-white'>Projects</h1>
          <p className='text-auth-text text-xs mt-1'>
            General overview and activity
          </p>
        </div>
      </div>

      {/* Overview cards */}
      <div className='flex flex-col md:flex-row gap-5 justify-between'>
        <Card className='card-container p-6 h-[115px] max-w-[340px] w-full md:w-[33%]'>
          <CardContent className='p-0'>
            <h3 className='text-auth-text font-medium text-xs leading-[100%] mb-2'>
              Total Projects
            </h3>

            <p className='text-white text-3xl lg:text-[36px] leading-[56px] font-semibold'>
              20
            </p>
          </CardContent>
        </Card>

        <Card className='card-container p-6 h-[115px] max-w-[340px] w-full md:w-[33%]'>
          <CardContent className='p-0'>
            <h3 className='text-auth-text font-medium text-xs leading-[100%] mb-2'>
              In Progress
            </h3>

            <p className='text-white text-3xl lg:text-[36px] leading-[56px] font-semibold'>
              15
            </p>
          </CardContent>
        </Card>

        <Card className='card-container p-6 h-[115px] max-w-[340px] w-full md:w-[33%]'>
          <CardContent className='p-0'>
            <h3 className='text-auth-text font-medium text-xs leading-[100%] mb-2'>
              Completed
            </h3>

            <p className='text-white text-3xl lg:text-[36px] leading-[56px] font-semibold'>
              18
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects list */}

      <div className='bg-auth-bg border-[0.6px] border-auth-border shadow-[1px_1px_1px_0px_#10193466] rounded-[12px] py-4 xl:py-8 my-8'>
        <div className='flex flex-col gap-4 md:flex-row justify-between md:items-center px-4 xl:px-10'>
          <div className='flex flex-col gap-2 md:flex-row md:items-center justify-between md:w-[60%] xl:w-[50%]'>
            <h4 className='font-medium text-16c leading-[18px]'>Projects</h4>

            <div className='relative md:w-[80%] max-w-[375px] text-auth-text'>
              <CiSearch className='absolute left-3 top-1/2 -translate-y-1/2' />
              <Input
                type='text'
                placeholder='Search for projects...'
                className='pl-10 border-auth-border bg-darkmode-bg text-xs rounded-[4px]'
              />
            </div>
          </div>

          <div className='flex items-center gap-4 md:justify-between md:w-[30%] xl:w-[20%]'>
            <CustomSelectFilter>
              <span>Status</span>
            </CustomSelectFilter>

            <CustomSelectFilter>
              <div className='flex items-center gap-0.5'>
                <PiCalendarBlankFill className='w-[10px] h-[10px]' />
                <span>Date</span>
              </div>
            </CustomSelectFilter>
          </div>
        </div>

        <div className='mt-6'>
          <DataTable columns={columns} data={projectsData?.records || []} />
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
