import React from 'react';
import Image from 'next/image';

import { FaCode } from 'react-icons/fa6';
import { HiDotsHorizontal } from 'react-icons/hi';
import { PiPuzzlePieceFill } from 'react-icons/pi';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

import projectLogo from '@/svgs/project-logo.svg';

function ProjectCard() {
  return (
    <Card className='card-container p-0 w-[33%] max-w-[329px] gap-0'>
      <CardContent className='p-5'>
        <div className='flex items-center justify-between'>
          <div>
            <Image src={projectLogo} alt='project logo' />
          </div>

          <div className='flex gap-1 items-center font-medium text-dashboard-nav text-[10px] '>
            <PiPuzzlePieceFill className='w-3 h-3' />
            <span>5 Bounties</span>
          </div>
        </div>

        <div className='mt-4'>
          <h3 className='text-xs leading-[14px] mb-1 font-semibold text-white'>
            Landing page design & development
          </h3>

          <p className='text-xs leading-[18px] font-medium text-dashboard-nav'>
            Lorem ipsum dolor sit amet consectetur sed id massa morbi porta
            malesuada dictumst.
          </p>
        </div>
      </CardContent>

      <CardFooter className='mt-0 py-4 border-t-[0.6px] border-[#1F1F1F] justify-between'>
        <div className='flex gap-2 items-center bg-[#0F0F0F] border-[0.6px] border-[#1F1F1F] p-2 text-white font-medium text-xs rounded-[2px]'>
          <FaCode className='text-[#545454] w-3 h-3' />
          <span>Development</span>
        </div>

        <HiDotsHorizontal className='text-white' />
      </CardFooter>
    </Card>
  );
}

export default ProjectCard;
