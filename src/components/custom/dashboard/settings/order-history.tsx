import React from 'react';
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
import CueCurrencyIcon from '@/svgs/cue-currency-dashboard.svg';

function OrderHistory() {
  const sampleData = [
    {
      img: AvatarCircle,
      name: 'Fancy Water Bottle',
      amount: 329.0,
      status: 'canceled',
      date: '24 Mar. 2022',
    },
    {
      img: AvatarCircle,
      name: 'Fancy Water Bottle',
      amount: 329.0,
      status: 'pending',
      date: '24 Mar. 2022',
    },
    {
      img: AvatarCircle,
      name: 'Fancy Water Bottle',
      amount: 329.0,
      status: 'delivered',
      date: '24 Mar. 2022',
    },
    {
      img: AvatarCircle,
      name: 'Fancy Water Bottle',
      amount: 329.0,
      status: 'pending',
      date: '24 Mar. 2022',
    },
  ];
  return (
    <div className='mt-8'>
      <div className='bg-auth-bg border-[0.6px] border-auth-border shadow-[1px_1px_1px_0px_#10193466] rounded-[12px] py-8 px-0'>
        <div className='flex justify-between items-center'>
          <h4 className='font-medium text-16c leading-[18px] px-8'>
            Top Contributors
          </h4>
        </div>

        <Table className='text-white mt-4'>
          {/* <TableCaption>Our top contributors.</TableCaption> */}
          <TableHeader className='[&_tr]:border-b-0'>
            <TableRow className='hover:bg-transparent uppercase text-auth-text'>
              <TableHead className='px-8'>Item</TableHead>
              <TableHead className='px-8'>Amount</TableHead>
              <TableHead className='px-8'>Status</TableHead>
              <TableHead className='px-8'>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((item, idx) => (
              <TableRow
                key={`${item.name}-${idx}`}
                className={`font-medium text-[10px] leading-14px hover:bg-[#1f1f1f]/50 ${idx % 2 === 0 ? 'bg-[#0F0F0F]' : ''}`}
              >
                <TableCell className='px-8'>
                  <div className='flex items-center gap-2'>
                    <Image src={item.img} alt='avatar' width={16} height={16} />
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell className='px-8'>
                  <div className='text-white font-medium text-sm flex items-center gap-1'>
                    <Image
                      src={CueCurrencyIcon}
                      alt='cue currency icon'
                      width={12}
                      height={12}
                    />
                    <span>{item.amount}</span>
                  </div>
                </TableCell>
                <TableCell className='px-8'>
                  <div
                    className={`${
                      item.status === 'pending'
                        ? 'inactive-status'
                        : item.status === 'canceled'
                          ? 'canceled-status'
                          : 'active-status'
                    } w-fit`}
                  >
                    {item.status === 'delivered' ? (
                      <div className='flex items-center gap-1'>
                        <div className='w-[3px] h-[3px] bg-[#05C168] rounded-full inline-block' />
                        <span>Active</span>
                      </div>
                    ) : item.status === 'pending' ? (
                      <div className='flex items-center gap-1'>
                        <div className='w-[3px] h-[3px] bg-[#FDB52A] rounded-full inline-block' />
                        <span>Pending</span>
                      </div>
                    ) : item.status === 'canceled' ? (
                      <div className='flex items-center gap-1'>
                        <div className='w-[3px] h-[3px] bg-[#FF5A5F] rounded-full inline-block' />
                        <span>Canceled</span>
                      </div>
                    ) : (
                      <div className='flex items-center gap-1'>
                        <div className='w-[3px] h-[3px] bg-[#AEB9E1] rounded-full inline-block' />
                        <span>Inactive</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className={`px-8`}>
                  <span>{item.date}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default OrderHistory;
