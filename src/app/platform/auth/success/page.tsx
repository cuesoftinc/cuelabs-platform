'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import successCheckmark from '@/svgs/success-labs.svg';
import { useRouter } from 'next/navigation';

function SuccessPage() {
  const router = useRouter();

  return (
    <>
      <div>
        <Image
          src={successCheckmark}
          alt='Success checkmark'
          width={80}
          height={80}
          className='mb-4'
        />
      </div>
      <h1 className='text-white text-2xl leading-[120%] font-semibold mb-2'>
        All done! Your account is ready
      </h1>
      <p className='text-16c text-auth-text leading-[140%] '>
        Your CueLABs account has been successfully created
      </p>

      <div className='w-full text-center'>
        <Button
          className='btn-main-p my-8'
          onClick={() => router.push('/platform/auth/login')}
        >
          Proceed to login
        </Button>
      </div>
    </>
  );
}

export default SuccessPage;
