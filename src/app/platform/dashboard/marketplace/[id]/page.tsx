import React from 'react';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, Minus, Plus } from 'lucide-react';

import flaskImage from '@/images/product-details-img.png';
import cueGradient from '@/svgs/cue-currency-gradient.svg';
import { Button } from '@/components/ui/button';
import ItemCard from '@/components/custom/dashboard/marketplace/item-card';
// import GradientBtn from '@/components/custom/dashboard/gradient-btn';

import airpod from '@/images/airpods-m.png';
import flask from '@/images/flask-m.png';
import shirt from '@/images/shirt-m.png';

function ProductDetailsPage() {
  return (
    <div className='p-12 w-full'>
      {/* Heading */}
      <div className='flex items-center justify-between mb-10'>
        <div>
          <div className='text-auth-text text-sm leading-[140%] flex items-center gap-4'>
            <span>Projects</span>
            <ChevronRight width={16} height={16} />
            <span>Bounties</span>
          </div>

          <div className='flex items-center gap-4 text-auth-text mt-6'>
            <ArrowLeft width={24} height={24} />
            <h1 className='text-2xl font-semibold text-white'>
              Project Details
            </h1>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className='mt-8 flex gap-20 '>
        <div className='w-[39%] max-w-[408px]'>
          <Image src={flaskImage} alt='flask image with slider dots' />
        </div>

        <div className='w-[37%] max-w-[366px]'>
          <h4 className='text-2xl leading-[100%] font-bold mb-2'>
            Fancy Water Bottle
          </h4>

          <p className='text-[#667185] text-sm leading-[145%]'>
            “La vie est belle,” a French expression meaning “life is beautiful,”
            is about choosing your own path to happiness. Introducing a new
            fragrance chapter of happiness to the La vie est belle family, La
            vie est belle Intensément is an addictive.
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
                75.00
              </span>
            </p>

            <div className='mt-5'>
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
            </div>

            <div className='mt-5'>
              <span className='uppercase text-xs text-auth-text tracking-[5%] font-medium'>
                Select Size
              </span>

              <div className='flex items-center gap-2 mt-2'>
                <div className='p-[2px] w-[40px] h-[40px] rounded-[4px] bg-gradient-to-r from-[#CB39C1] via-[#B91F7A] to-[#3534FF]'>
                  <button className='block h-full w-full font-medium border-none rounded-[3px] cursor-pointer hover:scale-[0.97] text-center py-1.5 bg-[#0F0F0F]'>
                    <span className='text-[12px] gradient-bg-text leading-[24px]'>
                      S
                    </span>
                  </button>
                </div>

                <div className='w-[40px] h-[40px] border border-[#E6E7E8] rounded-[4px] text-xs leading-[24px] flex items-center justify-center text-[#5C5F6A]'>
                  M
                </div>

                <div className='w-[40px] h-[40px] border border-[#E6E7E8] rounded-[4px] text-xs leading-[24px] flex items-center justify-center text-[#5C5F6A]'>
                  X
                </div>

                <div className='w-[40px] h-[40px] border border-[#E6E7E8] rounded-[4px] text-xs leading-[24px] flex items-center justify-center text-[#5C5F6A]'>
                  XL
                </div>

                <div className='w-[40px] h-[40px] border border-[#E6E7E8] rounded-[4px] text-xs leading-[24px] flex items-center justify-center text-[#5C5F6A]'>
                  XXL
                </div>
              </div>
            </div>

            <div className='mt-5'>
              <span className='uppercase text-xs text-auth-text tracking-[5%] font-medium'>
                Quantity
              </span>

              <div className='border border-[#E6E7E8] rounded-[4px] mt-2 w-[164px] flex items-center justify-between p-4 text-[#5C5F6A]'>
                <Minus width={20} height={20} className='cursor-pointer' />

                <span className='text-white font-medium text-sm leading-[175%]'>
                  1
                </span>

                <Plus width={20} height={20} className='cursor-pointer' />
              </div>
            </div>
          </div>

          <Button className='btn-main-p uppercase mt-12'>Add to cart</Button>
        </div>
      </div>

      <hr className='border-[#1F1F1F] my-14' />

      {/* Suggestions */}
      <div>
        <div>
          <h1 className='text-2xl font-bold text-white'>You might also like</h1>
          <p className='text-[#667185] text-xs leading-[24px] font-medium mt-1 uppercase'>
            Similar Products
          </p>
        </div>

        <div className='flex justify-between mt-12'>
          <ItemCard img={airpod} btnType='similar products' />
          <ItemCard img={flask} btnType='similar products' />
          <ItemCard img={shirt} btnType='similar products' />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
