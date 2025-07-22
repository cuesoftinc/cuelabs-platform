'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { FaCode } from 'react-icons/fa6';
import { HiDotsHorizontal } from 'react-icons/hi';
import { PiPuzzlePieceFill } from 'react-icons/pi';
import { HiMiniPencil } from 'react-icons/hi2';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { ExternalLink } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import projectLogo from '@/svgs/project-logo.svg';
import cueCurrency from '@/svgs/cue-currency-gradient.svg';
import CustomTextareaToolbar from '../custom-textarea-toolbar';
import successCheckmark from '@/svgs/success-labs.svg';

type BountyCardProps = {
  // projectLogo?: string;
  // bountyCount: number;
  // title: string;
  // description: string;
  category?: string;
};

function BountyCard({ category = 'development' }: BountyCardProps) {
  const [openBountyDetails, setOpenBountyDetails] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  return (
    <Card className='card-container p-0 w-full max-w-[329px] gap-0'>
      <CardContent className='p-3 md:p-5'>
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

      <CardFooter className='mt-0 py-4 border-t-[0.6px] border-[#1F1F1F] justify-between px-3 md:px-5 '>
        <div className='flex gap-2 items-center bg-[#0F0F0F] border-[0.6px] border-[#1F1F1F] p-2 text-white font-medium text-xs rounded-[2px]'>
          {category === 'development' && (
            <FaCode className='text-[#545454] w-3 h-3' />
          )}
          {category === 'design' && (
            <HiMiniPencil className='text-[#545454] w-3 h-3' />
          )}
          <span>
            {category === 'development'
              ? 'Development'
              : category === 'design'
                ? 'Design'
                : category}
          </span>
        </div>
        <Popover>
          <PopoverTrigger>
            <HiDotsHorizontal className='text-white cursor-pointer' />
          </PopoverTrigger>
          <PopoverContent className='card-container max-w-[70px] text-white p-2 text-center'>
            <span
              className='font-medium cursor-pointer text-xs hover:font-extrabold'
              onClick={() => setOpenBountyDetails(true)}
            >
              View
            </span>
          </PopoverContent>
        </Popover>
      </CardFooter>

      <Dialog open={openBountyDetails} onOpenChange={setOpenBountyDetails}>
        <DialogContent
          aria-describedby={undefined}
          className='bg-[#0A0A0A] p-3 md:p-[20px] lg:p-[30px] rounded-[12px] max-h-[90vh] w-[80vw]! md:w-[60vw]! max-w-[731px]! border-0 overflow-auto shadow-2xl'
        >
          <VisuallyHidden>
            <DialogTitle>Bounty Details</DialogTitle>
          </VisuallyHidden>

          <div className='w-full'>
            <div className='flex justify-end w-full text-[#919EAB]'>
              <IoCloseCircleSharp
                width={24}
                height={24}
                className='cursor-pointer'
                onClick={() => setOpenBountyDetails(false)}
              />
            </div>

            <div>
              {/* Header */}
              <div>
                <div className='flex items-center gap-2'>
                  <h2 className='text-lg md:text-xl leading-[120%] -tracking-[2%]'>
                    Homepage Bug
                  </h2>
                  <span className='active-status gap-1'>
                    <div className='w-[3px] h-[3px] bg-[#05C168] rounded-full inline-block' />
                    Open
                  </span>
                </div>

                <p className='text-auth-text text-xs md:text-[16px] leading-[145%] md:mt-2'>
                  Bounty Details
                </p>
              </div>

              {/* Body */}
              <div className='mt-8 flex flex-col gap-4'>
                <div className='flex flex-col md:flex-row gap-2 md:items-center justify-between'>
                  <div className='md:w-[20%]'>
                    <p className='text-auth-text text-xs leading-[16px]'>
                      Participants
                    </p>
                  </div>
                  <div className='flex gap-3 items-center justify-start w-full'>
                    <div className='rounded-[16px] border border-auth-border bg-[#0F0F0F] px-1.5 py-1 flex items-center gap-2'>
                      <div className='w-[24px] h-[24px] bg-auth-bg rounded-full  text-[10px] text-[#3CB49D] leading-[16px] flex items-center justify-center'>
                        MJ
                      </div>

                      <span className='text-xs leading-[16px] '>
                        Mallory James
                      </span>
                    </div>

                    <div className='rounded-[16px] border border-auth-border bg-[#0F0F0F] px-1.5 py-1 flex items-center gap-2'>
                      <div className='w-[24px] h-[24px] bg-auth-bg rounded-full  text-[10px] text-[#3CB49D] leading-[16px] flex items-center justify-center'>
                        OO
                      </div>

                      <span className='text-xs leading-[16px] '>
                        Olaife Olawore
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col md:flex-row gap-2 md:items-center justify-between'>
                  <div className='md:w-[20%]'>
                    <p className='text-auth-text text-xs leading-[16px]'>
                      Due Date
                    </p>
                  </div>
                  <div className='w-full'>
                    <span className='text-xs md:text-sm md:leading-[145%]'>
                      February 2, 2025
                    </span>
                  </div>
                </div>

                <div className='flex flex-col md:flex-row gap-2 justify-between'>
                  <div className='w-[20%]'>
                    <p className='text-auth-text text-xs leading-[16px]'>
                      Description
                    </p>
                  </div>
                  <div className='w-full'>
                    <span className='text-xs md:text-sm md:leading-[145%]'>
                      February A little about the project and the team that
                      you&apos;ll be working with. A little about the
                      specifications you&apos;ll be working with. This is where
                      the description goes little about the project and the team
                      that you&apos;ll be working with2, 2025
                    </span>
                  </div>
                </div>

                <div className='flex flex-col md:flex-row gap-2 justify-between'>
                  <div className='md:w-[20%]'>
                    <p className='text-auth-text text-xs leading-[16px]'>
                      Link
                    </p>
                  </div>
                  <div className='w-full flex items-center gap-2'>
                    <div className='rounded-[16px] bg-[#1A1A1A] px-3 py-1.5 flex items-center gap-2 w-fit cursor-pointer'>
                      <span className='text-sm leading-[145%] underline'>
                        https://www.github.co/homepagebugbj
                      </span>
                    </div>

                    <ExternalLink
                      width={20}
                      height={20}
                      className='inline-block'
                    />
                  </div>
                  {/* <ExternalLink
                    width={20}
                    height={20}
                    className='hidden md:inline-block'
                  /> */}
                </div>

                <div className='flex flex-col md:flex-row gap-2 justify-between'>
                  <div className='w-[20%]'>
                    <p className='text-auth-text text-xs leading-[16px]'>
                      Reward
                    </p>
                  </div>
                  <div className='w-full'>
                    <div className='flex items-center gap-2 w-fit cursor-pointer'>
                      <Image
                        src={cueCurrency}
                        alt='cue currency icon with gradient color'
                      />

                      <span className='text-xl md:text-2xl leading-[32px] font-semibold'>
                        18,400
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className='input-style'>
                    <Label htmlFor='email' className=''>
                      Submission URL
                    </Label>
                    <Input
                      type='text'
                      id='submission-url'
                      placeholder='https://www.'
                    />
                  </div>
                </div>

                <CustomTextareaToolbar />
              </div>

              {/* Buttons */}
              <div className='flex gap-4 justify-between items-center md:justify-end w-full mt-8'>
                <Button className='btn-secondary-p w-fit'>Cancel</Button>

                <Button
                  className='btn-main-p w-fit'
                  onClick={() => {
                    setOpenBountyDetails(false);
                    setOpenSuccess(true);
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent
          aria-describedby={undefined}
          className='bg-[#0A0A0A] p-[20px] rounded-[12px] max-h-[292px] w-[70%] md:w-[35%]! max-w-[318px]! border-0 shadow-2xl'
        >
          <VisuallyHidden>
            <DialogTitle>Bounty Submission Success</DialogTitle>
          </VisuallyHidden>

          <div className='text-center'>
            <div className='flex justify-center'>
              <Image
                src={successCheckmark}
                alt='Success checkmark'
                width={80}
                height={80}
                className='mb-4'
              />
            </div>
            <h1 className='text-white text-xl leading-[100%] font-semibold mb-2'>
              Submitted
            </h1>
            <p className='text-xs text-auth-text leading-[100%] '>
              Your bounty has been successfully submitted and you have been
              rewarded C18,400
            </p>

            <div className='w-full text-center'>
              <Button className='btn-main-p my-8'>Claim C 18400 Reward</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default BountyCard;
