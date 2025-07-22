import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TAB_ITEMS = [
  { label: 'All', value: 'all', url: '' },
  { label: 'Shirts', value: 'shirts', url: '' },
  { label: 'MacBooks', value: 'macbooks', url: '' },
  { label: 'Laptops', value: 'laptops', url: '' },
  { label: 'iWatches', value: 'iwatches', url: '' },
];

interface TabBarProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  tabItems?: { label: string; value: string; url?: string }[];
  // links?: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({
  value,
  onValueChange,
  className,
  tabItems = TAB_ITEMS,
  // links = false,
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className={cn('w-full', className)}
    >
      <TabsList className='flex w-full justify-start xl:gap-2 bg-[#141414] p-2 h-[48px] overflow-x-scroll overflow-y-hidden'>
        {tabItems.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'font-medium text-xs md:text-sm lg:text-lg leading-[100px]',
              value === tab.value
                ? 'bg-black! text-white shadow-none rounded-[8px] !w-fit md:min-w-[73px]! px-2 py-4! h-[40px]'
                : 'bg-transparent text-[#535252] hover:text-white',
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TabBar;
