'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileInformation from '@/components/custom/dashboard/settings/profile-information';
import Security from '@/components/custom/dashboard/settings/security';
import OrderHistory from '@/components/custom/dashboard/settings/order-history';

export default function SettingsPage() {
  const [activeSetting, setActiveSetting] = useState('profile');

  const tabItems = [
    {
      label: 'Personal Information',
      value: 'profile',
      url: '/platform/dashboard/settings/profile',
    },
    {
      label: 'Order History',
      value: 'orders',
      url: '/platform/dashboard/settings/orders',
    },
    {
      label: 'Security',
      value: 'security',
      url: '/platform/dashboard/settings/security',
    },
  ];

  return (
    <div className='p-5 md:p-9 lg:p-12 w-full'>
      {/* Heading */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-white'>
            Profile Settings
          </h1>
        </div>
      </div>

      {/* settings */}
      <div className='w-full'>
        <Tabs
          value={activeSetting}
          onValueChange={setActiveSetting}
          className={'w-full'}
        >
          <TabsList className='flex justify-start md:gap-2 bg-[#141414] p-2 h-[48px] w-[65%] xl:w-[58%] lg:max-w-[600px] overflow-x-auto overflow-y-hidden'>
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'font-medium text-xs md:text-sm lg:text-lg leading-[100px]',
                  activeSetting === tab.value
                    ? 'bg-black! text-white shadow-none rounded-[8px] !w-fit md:min-w-[73px]! px-2! py-4! h-[40px]'
                    : 'bg-transparent text-[#535252] hover:text-white',
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value='profile'>
            <ProfileInformation />
          </TabsContent>
          <TabsContent value='orders'>
            <OrderHistory />
          </TabsContent>
          <TabsContent value='security'>
            <Security />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
