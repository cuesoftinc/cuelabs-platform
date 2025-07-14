import React from 'react';

function GradientBtn({ text }: { text: string }) {
  return (
    <div className='p-[2px] rounded-[4px] bg-gradient-to-r from-[#CB39C1] via-[#B91F7A] to-[#3534FF] w-fit'>
      <button className='block h-full w-full font-medium border-none rounded-[3px] cursor-pointer hover:scale-[0.97] text-center py-1.5 bg-[#0F0F0F]'>
        <span className='text-[16px] gradient-bg-text leading-[100%]'>
          {text}
        </span>
      </button>
    </div>
  );
}

export default GradientBtn;
