'use client';

import Image from 'next/image';
import logo from '@/svgs/cuesoft-logo.svg';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-screen w-screen max-w-[1440px] mx-auto'>
      <div className='flex flex-col p-[2rem] bg-darkmode-bg h-full'>
        <div className=''>
          <Image
            src={logo}
            alt='Cuesoft Logo'
            width={213.7}
            height={42}
            className='w-[213.7px] h-[42px]'
          />
        </div>
        <div className='flex-1 flex items-center h-full'>
          <div className='auth-form-content-wrapper'>{children}</div>
        </div>
      </div>
    </div>
  );
}
