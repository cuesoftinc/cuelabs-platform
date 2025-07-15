'use client';

import Image from 'next/image';
import cartIcon from '@/svgs/cart-gradient.svg';
import userIcon from '@/svgs/user-gradient.svg';
import TabBar from '@/components/custom/dashboard/marketplace/tabBar';
import { useState } from 'react';
import ItemCard from '@/components/custom/dashboard/marketplace/item-card';

import airpod from '@/images/airpods-m.png';
import flask from '@/images/flask-m.png';
import shirt from '@/images/shirt-m.png';
import macbook from '@/images/macbook-m.png';
import iwatch from '@/images/iwatch-m.png';
import ipad from '@/images/ipad-m.png';
import Link from 'next/link';

function MarketplacePage() {
  const [tabValue, setTabValue] = useState('all');

  const items = [
    {
      img: shirt,
    },
    {
      img: airpod,
    },
    {
      img: iwatch,
    },
    {
      img: macbook,
    },
    {
      img: flask,
    },
    {
      img: ipad,
    },
  ];

  return (
    <div className='p-12 w-full'>
      {/* Heading */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-white'>Marketplace</h1>
          <p className='text-auth-text mt-1'>Place orders on with your cues</p>
        </div>

        <div className='flex items-center gap-6'>
          <Link
            href={'/platform/dashboard/marketplace/cart'}
            className='cursor-pointer bg-none flex items-center gap-1'
          >
            <Image src={cartIcon} alt='cart icon' />
            Cart
          </Link>

          <div className='cursor-pointer bg-none flex items-center gap-1'>
            <Image src={userIcon} alt='user icon' />
            Profile
          </div>
        </div>
      </div>

      {/*  */}
      <div className='w-full'>
        <div className='w-[60%]'>
          <TabBar
            value={tabValue}
            onValueChange={setTabValue}
            className='rounded-[12px]'
          />
        </div>

        <div className='mt-16 flex flex-wrap justify-between items-center gap-y-12'>
          {items.map((item, idx) => (
            <ItemCard key={idx} img={item.img} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarketplacePage;
