'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import cueCurrency from '@/svgs/cue-currency-dashboard.svg';
import successCheckmark from '@/svgs/success-labs.svg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/store/slices/cartSlice';
import CartItemComponent from '@/components/custom/dashboard/marketplace/cart-item';
import { useFetchMarketItem, useCreateOrderItems, useCreateOrder } from '@/hooks/queries/useMarketplace';
import { MarketItem } from '@/types/market';
import CustomSpinner from '@/components/custom/custom-spinner';

function CartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { items, total, itemCount } = useAppSelector((state) => state.cart);
  
  const [directOrderItem, setDirectOrderItem] = useState<MarketItem | null>(null);
  const [directOrderQuantity, setDirectOrderQuantity] = useState(1);
  const [directOrderSize, setDirectOrderSize] = useState<string>('');
  const [directOrderImageError, setDirectOrderImageError] = useState(false);
  const [directOrderRetryCount, setDirectOrderRetryCount] = useState(0);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string>('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const maxRetries = 2;

  // Order creation hooks
  const createOrderItemsMutation = useCreateOrderItems();
  const createOrderMutation = useCreateOrder();

  // Check for direct order parameter
  const directOrderId = searchParams.get('directOrder');

  // Use the existing hook to fetch the direct order item
  const { data: directOrderData, isLoading: isLoadingDirectOrder } = useFetchMarketItem(directOrderId || '');

  useEffect(() => {
    if (directOrderData) {
      setDirectOrderItem(directOrderData as MarketItem);
    }
  }, [directOrderData]);

  // Reset error state when direct order item data changes (new URLs)
  useEffect(() => {
    if (directOrderItem) {
      setDirectOrderImageError(false);
      setDirectOrderRetryCount(0);
    }
  }, [directOrderItem]);

  const handleCheckout = async () => {
    setIsProcessingOrder(true);
    setOrderError('');

    try {
      if (directOrderItem) {
        // Handle direct order checkout
        await processDirectOrder();
      } else {
        // Handle regular cart checkout
        await processCartOrder();
      }
    } catch (error) {
      console.error('Order creation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      setOrderError(errorMessage);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const processDirectOrder = async () => {
    if (!directOrderItem) return;

    // Create order items for direct order
    const orderItemsData = [{
      ItemId: directOrderItem.id,
      Item: [directOrderItem.id],
      Quantity: directOrderQuantity,
      Size: directOrderSize || undefined,
      Price: directOrderPrice,
      Color: undefined, // Add color if you have color selection
    }];

    const createdOrderItems = await createOrderItemsMutation.mutateAsync(orderItemsData);

    // Create the order
    const orderData = {
      OrderId: `ORD-${Date.now()}`,
      User: ['recCYY9sSXIeRjlvq'], // Using the provided user ID
      Items: createdOrderItems.map(item => item.id), // Array of order item IDs
      Address: '20386 Chevron Drive, Lagos Island, Delaware(DE)',
      Phone: '+1 23455246337',
      Status: 'New', // Default status as requested
      'Total Price': directOrderTotal,
      'Items Count': directOrderQuantity,
    };

    await createOrderMutation.mutateAsync(orderData);

    // Reset form state and show success dialog
    setDirectOrderQuantity(1);
    setDirectOrderSize('');
    setOpenSuccess(true);
  };

  const processCartOrder = async () => {
    if (items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Create order items for cart items
    const orderItemsData = items.map(cartItem => ({
      ItemId: cartItem.item.id,
      Item: [cartItem.item.id],
      Quantity: cartItem.quantity,
      Size: cartItem.selectedSize || undefined,
      Price: cartItem.price,
      Color: undefined, // Add color if you have color selection
    }));

    const createdOrderItems = await createOrderItemsMutation.mutateAsync(orderItemsData);

    // Create the order
    const orderData = {
      OrderId: `ORD-${Date.now()}`,
      User: ['recCYY9sSXIeRjlvq'], // Using the provided user ID
      Items: createdOrderItems.map(item => item.id), // Array of order item IDs
      Address: '20386 Chevron Drive, Lagos Island, Delaware(DE)',
      Phone: '+1 23455246337',
      Status: 'New', // Default status as requested
      'Total Price': total,
      'Items Count': itemCount,
    };

    await createOrderMutation.mutateAsync(orderData);

    // Clear cart and show success dialog
    dispatch(clearCart());
    setOpenSuccess(true);
  };

  const handleContinueShopping = () => {
    router.push('/platform/dashboard/marketplace');
  };

  const handleDirectOrderQuantityChange = (increment: boolean) => {
    if (increment) {
      setDirectOrderQuantity(prev => prev + 1);
    } else if (directOrderQuantity > 1) {
      setDirectOrderQuantity(prev => prev - 1);
    }
  };

  const handleDirectOrderSizeSelect = (size: string) => {
    setDirectOrderSize(size);
  };

  const handleDirectOrderImageError = () => {
    if (directOrderRetryCount < maxRetries) {
      // Retry after a short delay
      setTimeout(() => {
        setDirectOrderRetryCount(prev => prev + 1);
        setDirectOrderImageError(false); // Reset to try again
      }, 1000 * (directOrderRetryCount + 1)); // Exponential backoff: 1s, 2s
    } else {
      setDirectOrderImageError(true);
    }
  };

  // Calculate totals based on whether it's a direct order or regular cart
  const isDirectOrder = !!directOrderId;
  const displayItemCount = isDirectOrder ? directOrderQuantity : itemCount;
  
  // Calculate total for direct order
  const directOrderPrice = directOrderItem ? 
    (typeof directOrderItem.fields.Cues === 'string' 
      ? parseFloat(directOrderItem.fields.Cues) 
      : (directOrderItem.fields.Cues as number) || 0) : 0;
  const directOrderTotal = directOrderPrice * directOrderQuantity;
  const displayTotal = isDirectOrder ? directOrderTotal : total;

  if (isLoadingDirectOrder) {
    return <CustomSpinner />;
  }

  return (
    <div className='p-12 w-full'>
      {/* Heading */}
      <div className='flex items-center justify-between mb-10'>
        <div>
          <div className='text-auth-text text-sm leading-[140%] flex items-center gap-4'>
            <span>Marketplace</span>
            <ChevronRight width={16} height={16} />
            <span>{isDirectOrder ? 'Direct Order' : 'Cart'}</span>
          </div>

          <div className='flex items-center gap-4 text-auth-text mt-6'>
            <ArrowLeft width={24} height={24} onClick={() => router.back()} />
            <h1 className='text-2xl font-semibold text-white'>
              {isDirectOrder ? 'Place Order' : 'Cart'}
            </h1>
          </div>
        </div>
      </div>

      {/* Cart details */}
      <div className='mt-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='max-w-[667px] w-[65%]'>
            <div className='card-container p-4'>
              <h3 className='font-semibold text-16c leading-[100%] text-white border-b border-auth-border pb-5'>
                {isDirectOrder ? 'Order Item' : `Your cart (${displayItemCount})`}
              </h3>

              {isDirectOrder && directOrderItem ? (
                <div className='mt-8'>
                  {/* Direct Order Item Display */}
                  <div className='flex items-center gap-4 p-4 border-b border-[#1F1F1F]'>
                    {/* Item Image */}
                    <div className='w-20 h-20 flex-shrink-0'>
                      {directOrderItem.fields.Attachments?.[0] && !directOrderImageError ? (
                        <Image
                          src={directOrderItem.fields.Attachments[0].url}
                          alt={directOrderItem.fields.Name || 'Product image'}
                          width={80}
                          height={80}
                          className='w-full h-full object-cover rounded-[8px]'
                          onError={handleDirectOrderImageError}
                          key={`${directOrderItem.fields.Attachments[0].url}-${directOrderRetryCount}`}
                        />
                      ) : (
                        <div className='w-full h-full bg-[#1F1F1F] rounded-[8px] flex items-center justify-center'>
                          <span className='text-auth-text text-xs'>
                            {directOrderRetryCount > 0 && directOrderRetryCount < maxRetries ? 'Retrying...' : 'No Image'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className='flex-grow'>
                      <h3 className='text-white font-medium text-sm'>
                        {directOrderItem.fields.Name || 'Unnamed Item'}
                      </h3>
                      {directOrderSize && (
                        <p className='text-auth-text text-xs mt-1'>
                          Size: {directOrderSize}
                        </p>
                      )}
                      <p className='text-auth-text text-xs mt-1'>
                        Price: {directOrderPrice} Cues
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDirectOrderQuantityChange(false)}
                        className='w-8 h-8 p-0 border-auth-border bg-darkmode-bg'
                      >
                        <span className='text-white'>-</span>
                      </Button>
                      
                      <span className='text-white text-sm min-w-[2rem] text-center'>
                        {directOrderQuantity}
                      </span>
                      
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleDirectOrderQuantityChange(true)}
                        className='w-8 h-8 p-0 border-auth-border bg-darkmode-bg'
                      >
                        <span className='text-white'>+</span>
                      </Button>
                    </div>

                    {/* Total Price */}
                    <div className='text-white font-medium text-sm min-w-[4rem] text-right'>
                      {directOrderTotal.toFixed(2)} Cues
                    </div>
                  </div>

                  {/* Size Selection for Direct Order */}
                  {directOrderItem.fields.Sizes && directOrderItem.fields.Sizes.length > 0 && (
                    <div className='mt-4 p-4 border-b border-[#1F1F1F]'>
                      <span className='text-auth-text text-sm font-medium'>Select Size:</span>
                      <div className='flex items-center gap-2 mt-2'>
                        {directOrderItem.fields.Sizes.map((size: string) => (
                          <div
                            key={size}
                            className={`w-[40px] h-[40px] rounded-[4px] text-xs leading-[24px] flex items-center justify-center cursor-pointer transition-all ${
                              directOrderSize === size
                                ? 'p-[2px] bg-gradient-to-r from-[#CB39C1] via-[#B91F7A] to-[#3534FF]'
                                : 'border border-[#E6E7E8] text-[#5C5F6A]'
                            }`}
                            onClick={() => handleDirectOrderSizeSelect(size)}
                          >
                            {directOrderSize === size ? (
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
                  )}
                </div>
              ) : items.length > 0 ? (
                <div className='mt-8'>
                  {items.map((cartItem) => (
                    <CartItemComponent key={cartItem.id} cartItem={cartItem} />
                  ))}
                </div>
              ) : (
                <div className='mt-8 text-center py-12'>
                  <p className='text-auth-text text-lg mb-4'>Your cart is empty</p>
                  <Button 
                    onClick={handleContinueShopping}
                    className='btn-main-p'
                  >
                    Continue Shopping
                  </Button>
                </div>
              )}
            </div>

            {(items.length > 0 || isDirectOrder) && (
              <div className='card-container p-4 mt-10'>
                <h3 className='font-semibold text-16c leading-[100%] text-white border-b border-auth-border pb-5'>
                  Delivery Info
                </h3>

                <div className='mt-5 flex flex-col gap-4'>
                  <div className='text-white text-sm flex items-center gap-2'>
                    <div className='bg-pink-500 w-5 h-5 rounded-[2px]'></div>
                    <span>20386 Chevron Drive, Lagos Island, Delaware(DE)</span>
                  </div>

                  <div className='text-white text-sm flex items-center gap-2'>
                    <div className='bg-pink-500 w-5 h-5 rounded-[2px]'></div>
                    <span>+1 23455246337</span>
                  </div>

                  <div className='text-white text-sm flex items-center gap-2'>
                    <div className='bg-pink-500 w-5 h-5 rounded-[2px]'></div>
                    <span>olaifeolawore@email.com</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {(items.length > 0 || isDirectOrder) && (
            <div className='card-container max-w-[341px] w-[33%] py-8 px-5'>
              <h3 className='font-semibold text-16c leading-[100%] text-white pb-5'>
                Order Summary
              </h3>

              <div className='mt-5 flex flex-col gap-3 pb-8 border-b border-[#E6E7E8]'>
                <div className='flex justify-between'>
                  <span className='text-sm font-medium text-auth-text'>
                    Subtotal:
                  </span>
                  <div>
                    <p className='flex items-center gap-1'>
                      <Image
                        src={cueCurrency}
                        alt='cue currency with gradient'
                        width={12}
                        height={12}
                      />
                      <span className='text-white text-sm leading-[175%] font-medium'>
                        {displayTotal.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className='flex justify-between'>
                  <span className='text-sm font-medium text-auth-text'>
                    Shipping:
                  </span>
                  <div>
                    <p className='flex items-center gap-1'>
                      <span className='text-white text-sm leading-[175%] font-medium'>
                        Free
                      </span>
                    </p>
                  </div>
                </div>

                <div className='flex justify-between'>
                  <span className='text-sm font-medium text-auth-text'>Tax:</span>
                  <div>
                    <p className='flex items-center gap-1'>
                      <Image
                        src={cueCurrency}
                        alt='cue currency with gradient'
                        width={12}
                        height={12}
                      />
                      <span className='text-white text-sm leading-[175%] font-medium'>
                        {(displayTotal * 0.1).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex justify-between my-8'>
                <span className='text-sm font-medium text-auth-text'>Total:</span>
                <div>
                  <p className='flex items-center gap-1'>
                    <Image
                      src={cueCurrency}
                      alt='cue currency with gradient'
                      width={12}
                      height={12}
                    />
                    <span className='text-white text-sm leading-[175%] font-medium'>
                      {(displayTotal * 1.1).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>

              {orderError && (
                <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-red-700 text-sm'>{orderError}</p>
                </div>
              )}

              <Button 
                onClick={handleCheckout}
                disabled={isProcessingOrder}
                className='btn-main-p w-full'
              >
                {isProcessingOrder ? (
                  <div className='flex items-center gap-2'>
                    <CustomSpinner size='sm' />
                    {isDirectOrder ? 'Placing Order...' : 'Processing Order...'}
                  </div>
                ) : (
                  isDirectOrder ? 'Place Order' : 'Proceed to Checkout'
                )}
              </Button>

              <div className='text-center mt-8'>
                <button
                  onClick={handleContinueShopping}
                  className='gradient-underline-text underline! gradient-bg-text text-xs font-medium leading-[150%]'
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent
          aria-describedby={undefined}
          className='bg-[#0A0A0A] p-[20px] rounded-[12px] w-[70%] md:w-[35%]! max-w-[318px]! border-0 shadow-2xl'
        >
          <VisuallyHidden>
            <DialogTitle>Order Success</DialogTitle>
          </VisuallyHidden>

          <div className='text-center'>
            <div className='flex justify-center'>
              <Image
                src={successCheckmark}
                alt='Success checkmark'
                width={80}
                height={80}
                className='mb-4'
              />
            </div>
            <h1 className='text-white text-xl leading-[100%] font-semibold mb-2'>
              Order Successful!
            </h1>
            <p className='text-xs text-auth-text leading-[100%] mb-4'>
              Your order has been placed successfully and is being processed.
            </p>

            <div className='w-full text-center'>
              <Button
                className='btn-main-p'
                onClick={() => {
                  setOpenSuccess(false);
                  router.push('/platform/dashboard/marketplace');
                }}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CartPage;
