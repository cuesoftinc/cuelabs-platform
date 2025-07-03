import React from 'react';
import Image from 'next/image';

import { ArrowDown, ArrowUpRight, ChevronDown } from 'lucide-react';

import { PiTimerFill } from 'react-icons/pi';
import { PiCalendarBlankFill } from 'react-icons/pi';
import { IoIosStar } from 'react-icons/io';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import ProjectCard from '@/components/custom/dashboard/project-card';

import cueCurrency from '@/svgs/cue-currency-dashboard.svg';
import chart from '@/svgs/overview-chart.svg';

function DashboardPage() {
  return (
    <div className='p-12 w-full'>
      {/* Heading */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-white'>Welcome Olaife!</h1>
          <p className='text-auth-text mt-1'>General overview and activity</p>
        </div>

        <div className='flex items-center gap-4'>
          <Button className='btn-secondary-p'>
            Export data <ArrowDown />
          </Button>

          <Button className='btn-main-p w-fit'>Create report</Button>
        </div>
      </div>

      {/* Overview cards */}
      <div className='flex justify-between'>
        <Card className='card-container p-6 w-[62%] max-w-[647px]'>
          <CardHeader className='p-0'>
            <CardTitle className='text-dashboard-nav flex gap-1 items-center font-medium text-xs'>
              <PiTimerFill className='w-3 h-3' />
              <span className=''>Total Earnings</span>
            </CardTitle>
            <CardDescription className='flex items-center gap-1'>
              <Image
                src={cueCurrency}
                alt='Cue Currency'
                className='w-[23.1px] h-[18.73px]'
              />
              <span className='text-white text-2xl font-semibold'>18,400</span>

              <div className='border-[0.6px] border-[#05C16833] rounded-[4px] px-1 py-0.5 text-[10px] text-[#14CA74] flex items-center bg-[#05C16833]'>
                <span>16.8%</span>
                <ArrowUpRight className='w-3 h-3' />
              </div>
            </CardDescription>
            <CardAction className=''>
              <div className='border border-[#1F1F1F] flex items-center gap-2 p-[9px] shadow-[1px_1px_1px_0px_#1F1F1F66] bg-darkmode-bg rounded-[4px] text-dashboard-nav text-[10px] font-medium'>
                <div className='flex items-center gap-0.5'>
                  <PiCalendarBlankFill className='w-[10px] h-[10px]' />
                  <span>This week</span>
                </div>
                <ChevronDown className='w-3 h-3' />
              </div>
            </CardAction>
          </CardHeader>

          <CardContent className='p-0'>
            <Image src={chart} alt='Earnings Chart' className='w-full h-auto' />
          </CardContent>
        </Card>

        <div className='flex flex-col gap-6 w-[36%] max-w-[375px]'>
          <Card className='card-container p-6 h-[115px]'>
            <CardContent className='p-0'>
              <div className='text-dashboard-nav flex gap-1 items-center font-medium text-xs'>
                <IoIosStar className='w-3 h-3' />
                <span className=''>Wallet Balance</span>
              </div>

              {/* <div> */}
              <div className='flex items-center gap-1  mt-4'>
                <Image
                  src={cueCurrency}
                  alt='Cue Currency'
                  className='w-[23.1px] h-[18.73px]'
                />
                <span className='text-white text-[40px] leading-[32px] font-semibold'>
                  100,400
                </span>
              </div>
              {/* </div> */}
            </CardContent>
          </Card>

          <Card className='card-container p-6 h-[115px]'>
            <CardContent className='p-0'>
              <div className='flex items-center justify-between'>
                <div className='text-dashboard-nav flex gap-1 items-center font-medium text-xs'>
                  <IoIosStar className='w-3 h-3' />
                  <span className=''>Rank</span>
                </div>

                <div className='flex items-center gap-1'>
                  <span className='text-[#7E89AC] text-sm'>
                    You&apos;re in{' '}
                  </span>
                  <div className='border-[0.6px] border-[#05C16833] rounded-[4px] px-1 py-0.5 text-[10px] text-[#14CA74] flex items-center bg-[#05C16833]'>
                    <span>Top 3%</span>
                  </div>
                </div>
              </div>

              {/* <div> */}
              <div className='mt-4'>
                <span className='text-white text-[40px] leading-[32px] font-semibold'>
                  13th
                </span>
              </div>
              {/* </div> */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended projects */}
      <div className='my-12'>
        <h2 className='text-2xl leading-[32px] font-semibold'>
          Recommended Projects
        </h2>

        <div className='mt-4 flex items-center justify-between'>
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
      </div>

      <div></div>
    </div>
  );
}

export default DashboardPage;
