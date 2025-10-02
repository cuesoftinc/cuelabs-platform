import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import type { CartItem } from '@/types/market';

interface CartItemProps {
  cartItem: CartItem;
}

function CartItemComponent({ cartItem }: CartItemProps) {
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // Get the first attachment as the main image
  const mainImage = cartItem.item.fields.Attachments?.[0];
  const imageUrl =
    mainImage?.url ||
    mainImage?.thumbnails?.large?.url ||
    mainImage?.thumbnails?.small?.url;

  // Reset error state when item data changes (new URLs)
  useEffect(() => {
    setImageError(false);
    setRetryCount(0);
  }, [cartItem.item.fields.Attachments]);

  const handleQuantityChange = (increment: boolean) => {
    const newQuantity = increment
      ? cartItem.quantity + 1
      : Math.max(1, cartItem.quantity - 1);
    dispatch(
      updateQuantity({
        itemId: cartItem.item.id,
        quantity: newQuantity,
        selectedSize: cartItem.selectedSize,
      }),
    );
  };

  const handleRemove = () => {
    dispatch(
      removeFromCart({
        itemId: cartItem.item.id,
        selectedSize: cartItem.selectedSize,
      }),
    );
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
    <div className='flex items-center gap-4 p-4 border-b border-[#1F1F1F]'>
      {/* Item Image */}
      <div className='w-20 h-20 flex-shrink-0'>
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={cartItem.item.fields.Name || 'Product image'}
            width={80}
            height={80}
            className='w-full h-full object-cover rounded-[8px]'
            onError={handleImageError}
            key={`${imageUrl}-${retryCount}`} // Force re-render on retry
          />
        ) : (
          <div className='w-full h-full bg-[#1F1F1F] rounded-[8px] flex items-center justify-center'>
            <span className='text-auth-text text-xs'>
              {retryCount > 0 && retryCount < maxRetries
                ? 'Retrying...'
                : 'No Image'}
            </span>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className='flex-grow'>
        <h3 className='text-white font-medium text-sm'>
          {cartItem.item.fields.Name || 'Unnamed Item'}
        </h3>
        {cartItem.selectedSize && (
          <p className='text-auth-text text-xs mt-1'>
            Size: {cartItem.selectedSize}
          </p>
        )}
        <p className='text-auth-text text-xs mt-1'>
          Price: {cartItem.price} Cues
        </p>
      </div>

      {/* Quantity Controls */}
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleQuantityChange(false)}
          className='w-8 h-8 p-0 border-auth-border bg-darkmode-bg'
        >
          <Minus className='w-3 h-3' />
        </Button>

        <span className='text-white text-sm min-w-[2rem] text-center'>
          {cartItem.quantity}
        </span>

        <Button
          variant='outline'
          size='sm'
          onClick={() => handleQuantityChange(true)}
          className='w-8 h-8 p-0 border-auth-border bg-darkmode-bg'
        >
          <Plus className='w-3 h-3' />
        </Button>
      </div>

      {/* Total Price */}
      <div className='text-white font-medium text-sm min-w-[4rem] text-right'>
        {(cartItem.price * cartItem.quantity).toFixed(2)} Cues
      </div>

      {/* Remove Button */}
      <Button
        variant='ghost'
        size='sm'
        onClick={handleRemove}
        className='w-8 h-8 p-0 text-auth-text hover:text-red-400'
      >
        <X className='w-4 h-4' />
      </Button>
    </div>
  );
}

export default CartItemComponent;
