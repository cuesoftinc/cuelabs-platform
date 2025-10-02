import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import cueGradient from '@/svgs/cue-currency-gradient.svg';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MarketItem } from '@/types/market';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { useRouter } from 'next/navigation';

function ItemCard({
  item,
  btnType = 'main',
}: {
  item: MarketItem;
  btnType?: string;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items } = useAppSelector((state) => state.cart);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Get the first attachment as the main image, or use a placeholder
  const mainImage = item.fields.Attachments?.[0];
  const imageUrl =
    mainImage?.url ||
    mainImage?.thumbnails?.large?.url ||
    mainImage?.thumbnails?.small?.url;

  // Check if this item is in the cart
  const isInCart = items.some((cartItem) => cartItem.item.id === item.id);

  // Reset error state when item data changes (new URLs)
  useEffect(() => {
    setImageError(false);
    setRetryCount(0);
  }, [item.fields.Attachments]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        item,
        quantity: 1,
      }),
    );
  };

  const handlePlaceOrder = () => {
    // Navigate to cart page with the specific item for direct ordering
    router.push(`/platform/dashboard/marketplace/cart?directOrder=${item.id}`);
  };

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      // Retry after a short delay
      setTimeout(
        () => {
          setRetryCount((prev) => prev + 1);
          setImageError(false); // Reset to try again
        },
        1000 * (retryCount + 1),
      ); // Exponential backoff: 1s, 2s
    } else {
      setImageError(true);
    }
  };

  return (
    <div className='md:w-[44%] xl:w-[32%] min-w-[220px] max-w-[337px] rounded-[12px] bg-[#000000DE] shadow-[0px_3px_24px_4px_#0000000F] p-5'>
      <div className='flex flex-col justify-between h-full '>
        <Link href={`/platform/dashboard/marketplace/${item.id}`} className=''>
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={item.fields.Name || 'Marketplace item'}
              width={300}
              height={200}
              className='relative bottom-10 w-full h-auto object-cover rounded-[8px]'
              onError={handleImageError}
              key={`${imageUrl}-${retryCount}`} // Force re-render on retry
            />
          ) : (
            <div className='relative bottom-10 w-full h-[200px] bg-[#1F1F1F] rounded-[8px] flex items-center justify-center'>
              <span className='text-auth-text text-sm'>
                {retryCount > 0 && retryCount < maxRetries
                  ? 'Retrying...'
                  : 'No Image'}
              </span>
            </div>
          )}
        </Link>

        <div className='flex flex-col gap-2 justify-between flex-grow'>
          <div className=''>
            <h3 className='text-lg lg:text-xl xl:text-[22px] font-semibold leading-[100%] text-white'>
              {item.fields.Name || 'Unnamed Item'}
            </h3>

            <p className='flex items-center gap-1 mt-2 mb-4'>
              <Image
                src={cueGradient}
                alt='cue currency with gradient'
                width={15}
                height={12}
              />
              <span className='gradient-bg-text text-sm lg:text-lg leading-[100%] font-semibold'>
                {item.fields.Cues || '0.00'}
              </span>
            </p>

            {btnType === 'main' ? (
              <p className='text-[#FFFFFFB2] text-xs lg:text-sm'>
                {item.fields.Description || 'No description available'}
              </p>
            ) : (
              <p className='text-[#FFFFFFB2] text-xs lg:text-sm'>In Stock</p>
            )}
          </div>

          {btnType === 'main' ? (
            <div className='flex flex-row lg:flex-col xl:flex-row justify-between gap-2 mt-4'>
              <Button
                onClick={handleAddToCart}
                className={`text-xs lg:text-[16px] w-[45%] lg:w-full xl:w-[45%] min-w-[100px] btn-main-p ${
                  isInCart ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isInCart}
              >
                {isInCart ? 'Added' : 'Add to Cart'}
              </Button>

              <div className='p-[2px] rounded-[4px] bg-gradient-to-r from-[#CB39C1] via-[#B91F7A] to-[#3534FF] w-[45%] lg:w-full xl:w-[45%] min-w-[90px]'>
                <button
                  onClick={handlePlaceOrder}
                  className='block h-full w-full font-medium border-none rounded-[3px] cursor-pointer hover:scale-[0.97] text-center py-1.5 bg-[#0F0F0F]'
                >
                  <span className='text-xs lg:text-[16px] gradient-bg-text lg:leading-[100%]'>
                    Place Order
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
