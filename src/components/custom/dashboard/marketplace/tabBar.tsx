import * as React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TAB_ITEMS = [
  { label: 'All', value: 'all' },
  { label: 'Shirts', value: 'shirts' },
  { label: 'MacBooks', value: 'macbooks' },
  { label: 'Laptops', value: 'laptops' },
  { label: 'iWatches', value: 'iwatches' },
];

interface TabBarProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const TabBar: React.FC<TabBarProps> = ({
  value,
  onValueChange,
  className,
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className={cn('w-full', className)}
    >
      <TabsList className='flex w-full justify-start gap-2 bg-[#141414] p-2 h-[48px]'>
        {TAB_ITEMS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'font-medium text-lg leading-[100px]',
              value === tab.value
                ? 'bg-black! text-white shadow-none rounded-[8px] !w-fit min-w-[73px]! px-2 py-4! h-[40px]'
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
