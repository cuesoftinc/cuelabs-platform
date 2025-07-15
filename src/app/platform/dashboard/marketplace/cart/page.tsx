import React from 'react';

import { ArrowLeft, ChevronRight, Minus, Plus, X } from 'lucide-react';
import cueGradient from '@/svgs/cue-currency-gradient.svg';
import cueCurrency from '@/svgs/cue-currency-dashboard.svg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function CartPage() {
  return (
    <div className='p-12 w-full'>
      {/* Heading */}
      <div className='flex items-center justify-between mb-10'>
        <div>
          <div className='text-auth-text text-sm leading-[140%] flex items-center gap-4'>
            <span>Marketplace</span>
            <ChevronRight width={16} height={16} />
            <span>Cart</span>
          </div>

          <div className='flex items-center gap-4 text-auth-text mt-6'>
            <ArrowLeft width={24} height={24} />
            <h1 className='text-2xl font-semibold text-white'>Cart</h1>
          </div>
        </div>
      </div>

      {/* Cart details */}
      <div className='mt-4'>
        <div className='flex items-start justify-between gap-4'>
          <div className='max-w-[667px] w-[65%]'>
            <div className='card-container p-4'>
              <h3 className='font-semibold text-16c leading-[100%] text-white border-b border-auth-border pb-5'>
                Your cart (2)
              </h3>

              <div className='mt-12 flex flex-col gap-8'>
                <div className='justify-between items-center flex'>
                  <div className='flex items-center justify-between w-[42%] '>
                    <div className='rounded-[12px] w-[80px] h-[80px] bg-teal-500'></div>

                    <div className=''>
                      <p className='capitalize text-sm leading-[175%] font-medium'>
                        Fancy water bottle
                      </p>

                      <div className='flex items-center gap-3 text-auth-text font-medium text-xs leading-[24px] mt-1'>
                        <div className='flex gap-2 items-center'>
                          <span>Color: </span>
                          <div className='bg-[#98BE9E] w-3 h-3 rounded-full'></div>
                        </div>
                        <Minus width={20} height={20} />
                        <span>Size: M</span>
                      </div>
                    </div>
                  </div>
                  <div className='w-[44%] flex items-center justify-between'>
                    <p className='flex items-center gap-1'>
                      <Image
                        src={cueGradient}
                        alt='cue currency with gradient'
                        width={15}
                        height={12}
                      />
                      <span className='gradient-bg-text text-lg leading-[100%] font-semibold'>
                        45.00
                      </span>
                    </p>

                    <div className='border border-[#E6E7E8] rounded-[4px] w-[107px] flex items-center justify-between py-2 px-4 text-[#5C5F6A]'>
                      <Minus
                        width={16}
                        height={16}
                        className='cursor-pointer'
                      />

                      <span className='text-white font-medium text-sm leading-[175%]'>
                        1
                      </span>

                      <Plus width={16} height={16} className='cursor-pointer' />
                    </div>

                    <div className='w-[40px] h-[40px] flex items-center justify-center bg-[#F6F6F6] text-[#5C5F6A] rounded-[4px] cursor-pointer'>
                      <X width={20} height={20} />
                    </div>
                  </div>
                </div>

                <div className='justify-between items-center flex'>
                  <div className='flex items-center justify-between w-[42%] '>
                    <div className='rounded-[12px] w-[80px] h-[80px] bg-amber-500'></div>

                    <div className=''>
                      <p className='capitalize text-sm leading-[175%] font-medium'>
                        Fancy Coffee bottle
                      </p>

                      <div className='flex items-center gap-3 text-auth-text font-medium text-xs leading-[24px] mt-1'>
                        <div className='flex gap-2 items-center'>
                          <span>Color: </span>
                          <div className='bg-[#98BE9E] w-3 h-3 rounded-full'></div>
                        </div>
                        <Minus width={20} height={20} />
                        <span>Size: M</span>
                      </div>
                    </div>
                  </div>
                  <div className='w-[44%] flex items-center justify-between'>
                    <p className='flex items-center gap-1'>
                      <Image
                        src={cueGradient}
                        alt='cue currency with gradient'
                        width={15}
                        height={12}
                      />
                      <span className='gradient-bg-text text-lg leading-[100%] font-semibold'>
                        45.00
                      </span>
                    </p>

                    <div className='border border-[#E6E7E8] rounded-[4px] w-[107px] flex items-center justify-between py-2 px-4 text-[#5C5F6A]'>
                      <Minus
                        width={16}
                        height={16}
                        className='cursor-pointer'
                      />

                      <span className='text-white font-medium text-sm leading-[175%]'>
                        1
                      </span>

                      <Plus width={16} height={16} className='cursor-pointer' />
                    </div>

                    <div className='w-[40px] h-[40px] flex items-center justify-center bg-[#F6F6F6] text-[#5C5F6A] rounded-[4px] cursor-pointer'>
                      <X width={20} height={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
          </div>

          {/* Order Summary */}
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
                      90.00
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
                    {/* <Image
                      src={cueCurrency}
                      alt='cue currency with gradient'
                      width={12}
                      height={12}
                    /> */}
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
                      30.00
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
                    190.00
                  </span>
                </p>
              </div>
            </div>

            <Button className='btn-main-p'>Proceed to Checkout</Button>

            <div className='text-center mt-8'>
              <Link
                href='/platform/dashboard/marketplace'
                className='gradient-underline-text underline! gradient-bg-text text-xs font-medium leading-[150%]'
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
