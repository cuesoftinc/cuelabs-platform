'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import logo from '@/svgs/cuesoft-logo.svg';

import { RiHomeFill } from 'react-icons/ri';
import { IoIosStar } from 'react-icons/io';
import { PiPuzzlePieceFill } from 'react-icons/pi';
import { FaUser } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { ArrowRight } from 'lucide-react';

function Sidebar() {
  const pathname = usePathname();

  const navLinks = [
    {
      name: 'Dashboard',
      icon: RiHomeFill,
      href: '/platform/dashboard',
    },
    {
      name: 'Projects',
      icon: IoIosStar,
      href: '/platform/dashboard/projects',
    },
    {
      name: 'Bounties',
      icon: PiPuzzlePieceFill,
      href: '/platform/dashboard/bounties',
    },
    {
      name: 'Leaderboard',
      icon: FaUser,
      href: '/platform/dashboard/leaderboard',
    },
    {
      name: 'Settings',
      icon: IoMdSettings,
      href: '/platform/dashboard/settings',
    },
  ];
  return (
    <div className='w-[300px] bg-darkmode-bg border-r border-auth-border p-6 flex flex-col'>
      {/* Logo */}
      <div className='mb-8'>
        <div className='text-white text-xl font-semibold flex items-center gap-2'>
          <div className=''>
            <Image
              src={logo}
              alt='Cuesoft Logo'
              width={127.2}
              height={25}
              className=''
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-3'>
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={`flex items-center gap-1 text-sm text-dashboard-nav font-medium hover:text-white transition-colors h-[42px]`}
          >
            <link.icon
              className='w-[14px] h-[14px]'
              style={{
                fill: pathname === link.href ? 'url(#activeGradient)' : '',
              }}
            />
            <span
              className={`${pathname === link.href ? 'gradient-bg-text' : ''}`}
            >
              {link.name}
            </span>
          </a>
        ))}

        <svg width='0' height='0' style={{ position: 'absolute' }}>
          <defs>
            <linearGradient
              id='iconGradient'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' style={{ stopColor: '#8b5cf6' }} />
              <stop offset='50%' style={{ stopColor: '#ec4899' }} />
              <stop offset='100%' style={{ stopColor: '#3b82f6' }} />
            </linearGradient>

            <linearGradient
              id='activeGradient'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <stop offset='0%' style={{ stopColor: '#cb39c1' }} />
              <stop offset='31%' style={{ stopColor: '#b91f7a' }} />
              <stop offset='78%' style={{ stopColor: '#3534ff' }} />
            </linearGradient>
          </defs>
        </svg>
      </nav>

      {/* User Profile */}
      <div className='border-t border-auth-border pt-4'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold'>
            O
          </div>
          <div>
            <div className='text-white text-sm font-medium'>Olaife Olawore</div>
            <div className='text-auth-text text-xs'>Account settings</div>
          </div>
        </div>
        <Button className='btn-main-p'>
          Sign Out <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
