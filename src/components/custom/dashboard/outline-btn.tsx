import { Button } from '@/components/ui/button';
import React from 'react';

function OutlineBtn({ text }: { text: string }) {
  return (
    <div className='p-[1px] rounded-[4px] bg-gradient-to-r from-[#CB39C1] via-[#B91F7A] to-[#3534FF] w-fit'>
      <Button
        variant={'outline'}
        className='bg-transparent! font-medium border-none rounded-[3px] cursor-pointer hover:scale-[0.97] min-w-[129px]'
      >
        <span className='text-[16px] leading-[28px] text-white'>{text}</span>
      </Button>
    </div>
  );
}

export default OutlineBtn;
