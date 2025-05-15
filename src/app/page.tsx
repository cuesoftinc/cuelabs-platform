import Image from 'next/image';

import NavBar from '@/components/custom/navigation/navbar';

import { Button } from '@/components/ui/button';

import btnIcon from '@/svgs/cta-arrow.svg';
import heroImgFront from '@/images/hero-img-front.webp';
import heroImgBack from '@/images/hero-img-back.webp';
import cueCurrency from '@/svgs/cue-currency.svg';

export default function Home() {
  return (
    <div className='w-full font-fustat'>
      <NavBar />

      <main className='w-full bg-yellow-50'>
        <section className='h-screen bg-[url("/svgs/hero-bg.svg")] flex items-center justify-center bg-cover bg-no-repeat'>
          <div className='w-[74.2%] mx-auto flex items-center justify-between'>
            <div className='w-[53%] relative flex items-center justify-end'>
              <Image
                src={heroImgFront}
                alt='Hero Image Front'
                className='w-[500px] h-[520px] absolute -top-8 left-0'
              />

              <Image
                src={heroImgBack}
                alt='Hero Image Back'
                className='w-[440px] h-[460px]'
              />

              <Image
                src={cueCurrency}
                alt='Cue Currency'
                className='absolute -bottom-1/3 right-1/3'
              />

              <div className='floating-badge -left-1/12 bottom-1/5'>
                Redeem Now
              </div>

              <div className='floating-badge -right-1/12 bottom-2/5 rotate-[18deg]'>
                Cool Gadgets
              </div>
            </div>

            <div className='w-[40%]'>
              <h1 className='capitalize text-[56px] leading-[72.8px] font-extrabold'>
                Contribute to open-source AI
              </h1>

              <p className='text-[40px] leading-[59.8px] font-extrabold capitalize gradient-bg mt-4'>
                earn cue points, And redeem awesome gadgets!
              </p>

              <div className='flex gap-6 items-center mt-6 w-full'>
                <Button className='btn-secondary'>Sign Up</Button>

                <Button variant={'default'} className='btn-main'>
                  Join Our Community
                  <Image src={btnIcon} alt='Arrow Icon' />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
