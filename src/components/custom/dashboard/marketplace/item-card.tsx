import React from 'react';
import Image, { StaticImageData } from 'next/image';

import cueGradient from '@/svgs/cue-currency-gradient.svg';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ItemCard({
  img,
  btnType = 'main',
}: {
  img: StaticImageData | string;
  btnType?: string;
}) {
  return (
    <div className='md:w-[44%] xl:w-[32%] min-w-[220px] max-w-[337px] rounded-[12px] bg-[#000000DE] shadow-[0px_3px_24px_4px_#0000000F] p-5'>
      <Link href={'/platform/dashboard/marketplace/123'} className=''>
        <Image src={img} alt='image' className='relative bottom-10' />
      </Link>
      <div>
        <h3 className='text-lg lg:text-xl xl:text-[22px] font-semibold leading-[100%] text-white'>
          Lorem ipsum dolor
        </h3>

        <p className='flex items-center gap-1 mt-2 mb-4'>
          <Image
            src={cueGradient}
            alt='cue currency with gradient'
            width={15}
            height={12}
          />
          <span className='gradient-bg-text text-sm lg:text-lg leading-[100%] font-semibold'>
            45.00
          </span>
        </p>

        {btnType === 'main' ? (
          <p className='text-[#FFFFFFB2] text-xs lg:text-sm'>
            Last Sale: 1000 Cues
          </p>
        ) : (
          <p className='text-[#FFFFFFB2] text-xs lg:text-sm'>In Stock</p>
        )}
      </div>

      {btnType === 'main' ? (
        <div className='flex flex-row lg:flex-col xl:flex-row justify-between gap-2 mt-4'>
          <Button className='btn-main-p text-xs lg:text-[16px] w-[45%] lg:w-full xl:w-[45%] min-w-[100px]'>
            Add to Cart
          </Button>

          <div className='p-[2px] rounded-[4px] bg-gradient-to-r from-[#CB39C1] via-[#B91F7A] to-[#3534FF] w-[45%] lg:w-full xl:w-[45%] min-w-[90px]'>
            <button className='block h-full w-full font-medium border-none rounded-[3px] cursor-pointer hover:scale-[0.97] text-center py-1.5 bg-[#0F0F0F]'>
              <span className='text-xs lg:text-[16px] gradient-bg-text lg:leading-[100%]'>
                Place Order
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ItemCard;
