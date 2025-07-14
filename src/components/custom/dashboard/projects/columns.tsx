'use client';

// import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Project = {
  name: string;
  reward: number;
  participants: number;
  status: 'completed' | 'in-progress' | 'new';
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'name',
    header: 'Project Name',
  },
  {
    accessorKey: 'reward',
    header: 'Reward',
  },
  {
    accessorKey: 'participants',
    header: 'Participants',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');

      if (status === 'completed') {
        return (
          <div className='active-status w-fit'>
            <div className='flex items-center gap-1'>
              <div className='w-[3px] h-[3px] bg-[#05C168] rounded-full inline-block' />
              <span>Completed</span>
            </div>
          </div>
        );
      } else if (status === 'in-progress') {
        return (
          <div className='inactive-status w-fit'>
            <div className='flex items-center gap-1'>
              <div className='w-[3px] h-[3px] bg-[#FDB52A] rounded-full inline-block' />
              <span>In Progress</span>
            </div>
          </div>
        );
      } else if (status === 'new') {
        return (
          <div className='new-status w-fit'>
            <div className='flex items-center gap-1'>
              <div className='w-[3px] h-[3px] bg-[#32ADE6] rounded-full inline-block' />
              <span>New</span>
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
            href={'/platform/dashboard/projects/123'}
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
