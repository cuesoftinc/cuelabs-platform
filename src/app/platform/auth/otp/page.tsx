'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

function OtpPage() {
  const router = useRouter();

  return (
    <>
      <h1 className='text-white text-2xl leading-[120%] font-semibold mb-2'>
        Check your inbox
      </h1>
      <p className='text-16c text-auth-text leading-[140%] '>
        Enter verification code we just sent to olaifeolawore@gmail.com
      </p>

      <div className='mt-8 w-full flex flex-col gap-6'>
        <div className='input-style'>
          <Label htmlFor='email' className=''>
            Enter OTP
          </Label>
          <Input type='text' id='otp' placeholder='6 digit code' required />
        </div>
      </div>
      <div className='w-full text-center'>
        <Button
          className='btn-main-p my-8'
          onClick={() => router.push('/platform/auth/success')}
        >
          Verify
        </Button>
        <p className='text-16c text-white flex items-center gap-2 mx-auto w-fit'>
          <ArrowLeft />
          <span>Return to create account</span>
        </p>
      </div>
    </>
  );
}

export default OtpPage;
