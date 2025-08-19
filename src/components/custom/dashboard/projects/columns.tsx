'use client';

import { Project } from '@/types/projects';
// import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Project = {
//   name: string;
//   reward: number;
//   participants: number;
//   status: 'completed' | 'in-progress' | 'new' | 'todo';
// };

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'fields.Name',
    header: 'Project Name',
  },
  // {
  //   accessorKey: 'reward',
  //   header: 'Reward',
  // },
  {
    accessorKey: 'fields.Participants',
    header: 'Participants',
    cell: ({ row }) => {
      return row.original.fields.Participants?.length || 0;
    },
  },
  {
    accessorKey: 'fields.Status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.fields.Status;

      if (status === 'Done') {
        return (
          <div className='active-status w-fit'>
            <div className='flex items-center gap-1'>
              <div className='w-[3px] h-[3px] bg-[#05C168] rounded-full inline-block' />
              <span>Completed</span>
            </div>
          </div>
        );
      } else if (status === 'In progress') {
        return (
          <div className='inactive-status w-fit'>
            <div className='flex items-center gap-1'>
              <div className='w-[3px] h-[3px] bg-[#FDB52A] rounded-full inline-block' />
              <span>In Progress</span>
            </div>
          </div>
        );
      } else if (status === 'New') {
        return (
          <div className='new-status w-fit'>
            <div className='flex items-center gap-1'>
              <div className='w-[3px] h-[3px] bg-[#32ADE6] rounded-full inline-block' />
              <span>{status}</span>
            </div>
          </div>
        );
      } else if (status === 'Todo') {
        return (
          <div className='todo-status w-fit'>
            <div className='flex items-center gap-1'>
              <div className='w-[3px] h-[3px] bg-[#A0A0A0] rounded-full inline-block' />
              <span>{status}</span>
            </div>
          </div>
        );
      }
    },
  },
  {
    header: 'Action',
    cell: ({ row }) => {
      const isEven = row.index % 2 === 0;
      return (
        <div className='p-[1px] rounded-[4px] bg-gradient-to-r from-[#CB39C1] via-[#B91F7A] to-[#3534FF] w-fit'>
          <Link
            // variant={'outline'}
            href={`/platform/dashboard/projects/${row.original.id}`}
            className='block w-[63px] font-medium border-none rounded-[3px] cursor-pointer hover:scale-[0.97] text-center py-1.5'
            style={
              isEven
                ? { backgroundColor: '#0F0F0F' }
                : { backgroundColor: '#0A0A0A' }
            }
          >
            <span className='text-[10px] gradient-bg-text leading-[14px]'>
              View
            </span>
          </Link>
        </div>
      );
    },
  },
];
