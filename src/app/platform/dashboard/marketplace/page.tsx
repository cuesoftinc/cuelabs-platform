'use client';

import Image from 'next/image';
import cartIcon from '@/svgs/cart-gradient.svg';
import userIcon from '@/svgs/user-gradient.svg';
import TabBar from '@/components/custom/dashboard/marketplace/tabBar';
import { useState, useMemo } from 'react';
import ItemCard from '@/components/custom/dashboard/marketplace/item-card';
import { Input } from '@/components/ui/input';
import { CiSearch } from 'react-icons/ci';
import Link from 'next/link';
import { useFetchMarketItems } from '@/hooks/queries/useMarketplace';
import CustomSpinner from '@/components/custom/custom-spinner';
import { MarketItem } from '@/types/market';
import { useAppSelector } from '@/store/hooks';

function MarketplacePage() {
  const [tabValue, setTabValue] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: marketPlaceData, isLoading } = useFetchMarketItems();
  const { itemCount } = useAppSelector((state) => state.cart);

  // Filter items based on search term and selected category
  const filteredItems = useMemo(() => {
    if (!marketPlaceData?.records) return [];

    let filtered = marketPlaceData.records as MarketItem[];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.fields.Name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by category
    if (tabValue !== 'all') {
      filtered = filtered.filter((item) =>
        item.fields.Category?.includes(tabValue),
      );
    }

    return filtered;
  }, [marketPlaceData?.records, searchTerm, tabValue]);

  if (isLoading) {
    return <CustomSpinner />;
  }

  return (
    <div className='p-5 md:p-9 lg:p-12 w-full'>
      {/* Heading */}
      <div className='flex gap-4 items-center justify-between mb-8'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-white'>
            Marketplace
          </h1>
          <p className='text-auth-text text-xs mt-1'>
            Place orders on with your cues
          </p>
        </div>

        <div className='flex items-center gap-6'>
          <Link
            href={'/platform/dashboard/marketplace/cart'}
            className='cursor-pointer bg-none flex items-center gap-1'
          >
            <div className='relative'>
              <Image src={cartIcon} alt='cart icon' />
              {itemCount > 0 && (
                <div className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                  {itemCount > 99 ? '99+' : itemCount}
                </div>
              )}
            </div>
            <span className='hidden md:inline-block'>Cart</span>
          </Link>

          <div className='cursor-pointer bg-none flex items-center gap-1'>
            <Image src={userIcon} alt='user icon' />
            <span className='hidden md:inline-block'>Profile</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className='w-full mb-8'>
        <div className='flex flex-col md:flex-row gap-4 justify-between items-start md:items-center'>
          <div className='w-full md:w-[60%]'>
            <TabBar
              value={tabValue}
              onValueChange={setTabValue}
              className='rounded-[12px]'
            />
          </div>

          <div className='relative w-full md:w-[40%] max-w-[400px] text-auth-text'>
            <CiSearch className='absolute left-3 top-1/2 -translate-y-1/2' />
            <Input
              type='text'
              placeholder='Search marketplace items...'
              className='pl-10 border-auth-border bg-darkmode-bg text-xs rounded-[4px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className='w-full mt-16'>
        {filteredItems.length > 0 ? (
          <div className='flex flex-wrap justify-between items-stretch gap-y-12'>
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-auth-text text-lg'>
              {searchTerm || tabValue !== 'all'
                ? 'No items found matching your criteria'
                : 'No marketplace items available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketplacePage;
