import React from 'react';
import CustomSelectFilter from './custom-select-filter';
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

const sampleData = [
  {
    img: AvatarCircle,
    name: 'Tejumade Desmond',
    projects: 200,
    status: 'active',
    earnings: 329,
  },
  {
    img: AvatarCircle,
    name: 'Olaife Olawore',
    projects: 400,
    status: 'inactive',
    earnings: 800,
  },
  {
    img: AvatarCircle,
    name: 'Tejumade Desmond',
    projects: 200,
    status: 'inactive',
    earnings: 329,
  },
  {
    img: AvatarCircle,
    name: 'Olaife Olawore',
    projects: 400,
    status: 'inactive',
    earnings: 800,
  },
  {
    img: AvatarCircle,
    name: 'Tejumade Desmond',
    projects: 200,
    status: 'active',
    earnings: 329,
  },
  {
    img: AvatarCircle,
    name: 'Olaife Olawore',
    projects: 400,
    status: 'inactive',
    earnings: 800,
  },
];

function LeaderboardTable() {
  return (
    <div className='bg-auth-bg border-[0.6px] border-auth-border shadow-[1px_1px_1px_0px_#10193466] rounded-[12px] py-8'>
      <div className='flex justify-between items-center px-12'>
        <h4 className='font-medium text-16c leading-[18px]'>
          Top Contributors
        </h4>

        <CustomSelectFilter>
          <div className='flex items-center gap-0.5'>
            <PiCalendarBlankFill className='w-[10px] h-[10px]' />
            <span>Date</span>
          </div>
        </CustomSelectFilter>
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
          {sampleData.map((item, idx) => (
            <TableRow
              key={`${item.name}-${idx}`}
              className={`font-medium text-[10px] leading-14px hover:bg-[#1f1f1f]/50 ${item.status === 'active' ? 'bg-[#0F0F0F]' : ''}`}
            >
              <TableCell className='flex items-center gap-2'>
                <Image src={item.img} alt='avatar' width={16} height={16} />
                <span>{item.name}</span>
              </TableCell>
              <TableCell
                className={`${item.status === 'active' ? 'text-white' : 'text-[#AEB9E1]'}`}
              >
                {item.projects}
              </TableCell>
              <TableCell>
                <div
                  className={`${item.status === 'active' ? 'active-status' : 'inactive-status'} w-fit`}
                >
                  {item.status === 'active' ? (
                    <div className='flex items-center gap-1'>
                      <div className='w-[3px] h-[3px] bg-[#05C168] rounded-full inline-block' />
                      <span>Active</span>
                    </div>
                  ) : (
                    <div className='flex items-center gap-1'>
                      <div className='w-[3px] h-[3px] bg-[#FDB52A] rounded-full inline-block' />
                      <span>Inactive</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell
                className={`flex items-center gap-1 ${item.status === 'active' ? 'text-white' : 'text-[#AEB9E1]'}`}
              >
                <CueCurrencyIcon
                  width={10}
                  height={10}
                  color={item.status === 'active' ? 'white' : '#AEB9E1'}
                />
                <span>{item.earnings}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default LeaderboardTable;
