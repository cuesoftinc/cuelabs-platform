'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, Minus, Plus } from 'lucide-react';

import cueGradient from '@/svgs/cue-currency-gradient.svg';
import { Button } from '@/components/ui/button';
import ItemCard from '@/components/custom/dashboard/marketplace/item-card';
import { useRouter, useParams } from 'next/navigation';
import {
  useFetchMarketItem,
  useFetchMarketItems,
} from '@/hooks/queries/useMarketplace';
import CustomSpinner from '@/components/custom/custom-spinner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { MarketItem } from '@/types/market';

function ProductDetailsPage() {
  const router = useRouter();
  const { id: itemId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  const {
    data: item,
    isLoading,
    error,
  } = useFetchMarketItem(itemId?.toString() || '');
  const { data: allItems } = useFetchMarketItems();

  // Get similar items (excluding current item)
  const similarItems =
    allItems?.records?.filter((item) => item.id !== itemId)?.slice(0, 3) || [];

  // Get the first attachment as the main image
  const mainImage = item?.fields.Attachments?.[0];
  const imageUrl =
    mainImage?.url ||
    mainImage?.thumbnails?.large?.url ||
    mainImage?.thumbnails?.small?.url;

  // Check if this item is in the cart
  const isInCart = items.some(cartItem => cartItem.item.id === itemId);

  // Reset error state when item data changes (new URLs)
  useEffect(() => {
    if (item) {
      setImageError(false);
      setRetryCount(0);
    }
  }, [item?.fields.Attachments]);

  if (isLoading) {
    return <CustomSpinner />;
  }

  if (error) {
    return (
      <div className='p-12 w-full'>
        <div className='text-red-500'>Error loading item: {error.message}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className='p-12 w-full'>
        <div className='text-auth-text'>Item not found</div>
      </div>
    );
  }

  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity((prev) => prev + 1);
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      // Retry after a short delay
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImageError(false); // Reset to try again
      }, 1000 * (retryCount + 1)); // Exponential backoff: 1s, 2s
    } else {
      setImageError(true);
    }
  };

  const handleAddToCart = () => {
    if (item.fields.Sizes && item.fields.Sizes.length > 0 && !selectedSize) {
      // Show error or alert that size must be selected
      alert('Please select a size before adding to cart');
      return;
    }

    dispatch(addToCart({
      item: item as MarketItem,
      quantity,
      selectedSize,
    }));
  };

  return (
    <div className='p-12 w-full'>
      {/* Heading */}
      <div className='flex items-center justify-between mb-10'>
        <div>
          <div className='text-auth-text text-sm leading-[140%] flex items-center gap-4'>
            <span>Marketplace</span>
            <ChevronRight width={16} height={16} />
            <span>{item.fields.Name || 'Items'}</span>
          </div>

          <div className='flex items-center gap-4 text-auth-text mt-6'>
            <ArrowLeft width={24} height={24} onClick={() => router.back()} />
            <h1 className='text-2xl font-semibold text-white'>
              {item.fields.Name || 'Item Details'}
            </h1>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className='mt-8 flex gap-20'>
        <div className='w-[39%] max-w-[408px]'>
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={item.fields.Name || 'Product image'}
              width={408}
              height={408}
              className='w-full h-auto object-cover rounded-[8px]'
              onError={handleImageError}
              key={`${imageUrl}-${retryCount}`}
            />
          ) : (
            <div className='w-full h-[408px] bg-[#1F1F1F] rounded-[8px] flex items-center justify-center'>
              <span className='text-auth-text text-lg'>
                {retryCount > 0 && retryCount < maxRetries ? 'Retrying...' : 'No Image Available'}
              </span>
            </div>
          )}
        </div>

        <div className='w-[37%] max-w-[366px]'>
          <h4 className='text-2xl leading-[100%] font-bold mb-2'>
            {item.fields.Name || 'Unnamed Item'}
          </h4>

          <p className='text-[#667185] text-sm leading-[145%]'>
            {item.fields.Description ||
              'No description available for this item.'}
          </p>

          <div className='my-6'>
            <p className='flex items-center gap-1 my-4'>
              <Image
                src={cueGradient}
                alt='cue currency with gradient'
                width={15}
                height={12}
              />
              <span className='gradient-bg-text text-lg leading-[100%] font-semibold'>
                {item.fields.Cues || '0.00'}
              </span>
            </p>

            {/* <div className='mt-5'>
               <span className='uppercase text-xs text-auth-text tracking-[5%] font-medium'>
                 Available Colors
               </span>

               <div className='flex items-center gap-2 mt-2'>
                 <div className='w-[32px] h-[32px] border border-[#0E1422] rounded-full flex items-center justify-center'>
                   <div className='w-[24px] h-[24px] bg-[#A3BEF8] rounded-full inline-block' />
                 </div>

                 <div className='w-[32px] h-[32px] border border-transparent rounded-full flex items-center justify-center'>
                   <div className='w-[24px] h-[24px] bg-[#FFD58A] rounded-full inline-block' />
                 </div>

                 <div className='w-[32px] h-[32px] border border-transparent rounded-full flex items-center justify-center'>
                   <div className='w-[24px] h-[24px] bg-[#83B18B] rounded-full inline-block' />
                 </div>
               </div>
             </div> */}

            {item.fields.Sizes && item.fields.Sizes.length > 0 ? (
              <div className='mt-5'>
                <span className='uppercase text-xs text-auth-text tracking-[5%] font-medium'>
                  Select Size
                </span>

                <div className='flex items-center gap-2 mt-2'>
                  {item.fields.Sizes.map((size: string) => (
                    <div
                      key={size}
                      className={`w-[40px] h-[40px] rounded-[4px] text-xs leading-[24px] flex items-center justify-center cursor-pointer transition-all ${
                        selectedSize === size
                          ? 'p-[2px] bg-gradient-to-r from-[#CB39C1] via-[#B91F7A] to-[#3534FF]'
                          : 'border border-[#E6E7E8] text-[#5C5F6A]'
                      }`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {selectedSize === size ? (
                        <button className='block h-full w-full font-medium border-none rounded-[3px] cursor-pointer hover:scale-[0.97] text-center py-1.5 bg-[#0F0F0F]'>
                          <span className='text-[12px] gradient-bg-text leading-[24px]'>
                            {size}
                          </span>
                        </button>
                      ) : (
                        <span>{size}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className='mt-5'>
              <span className='uppercase text-xs text-auth-text tracking-[5%] font-medium'>
                Quantity
              </span>

              <div className='border border-[#E6E7E8] rounded-[4px] mt-2 w-[164px] flex items-center justify-between p-4 text-[#5C5F6A]'>
                <Minus
                  width={20}
                  height={20}
                  className='cursor-pointer'
                  onClick={() => handleQuantityChange(false)}
                />

                <span className='text-white font-medium text-sm leading-[175%]'>
                  {quantity}
                </span>

                <Plus
                  width={20}
                  height={20}
                  className='cursor-pointer'
                  onClick={() => handleQuantityChange(true)}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleAddToCart}
            className={`uppercase mt-12 btn-main-p ${
              isInCart ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isInCart}
          >
            {isInCart ? 'Added' : 'Add to cart'}
          </Button>
        </div>
      </div>

      <hr className='border-[#1F1F1F] my-14' />

      {/* Suggestions */}
      {similarItems.length > 0 && (
        <div>
          <div>
            <h1 className='text-2xl font-bold text-white'>
              You might also like
            </h1>
            <p className='text-[#667185] text-xs leading-[24px] font-medium mt-1 uppercase'>
              Similar Products
            </p>
          </div>

          <div className='flex justify-between mt-12'>
            {similarItems.map((similarItem) => (
              <ItemCard
                key={similarItem.id}
                item={similarItem}
                btnType='similar products'
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailsPage;
