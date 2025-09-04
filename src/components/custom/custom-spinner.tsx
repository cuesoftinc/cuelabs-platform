import React from 'react';
import { TbFidgetSpinner } from 'react-icons/tb';

interface CustomSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function CustomSpinner({ size = 'lg' }: CustomSpinnerProps) {
  const sizeMap = {
    sm: 16,
    md: 32,
    lg: 60,
  };

  if (size === 'lg') {
    return (
      <>
        <div className='p-5 md:p-9 lg:p-12 w-full h-full'>
          <div className='w-full min-h-full flex items-center justify-center'>
            <TbFidgetSpinner
              className='text-dashboard-nav animate-spin opacity-50'
              size={sizeMap[size]}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <TbFidgetSpinner
      className='text-dashboard-nav animate-spin opacity-50'
      size={sizeMap[size]}
    />
  );
}
