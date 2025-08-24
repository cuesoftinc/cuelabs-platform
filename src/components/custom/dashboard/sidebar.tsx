'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import logo from '@/svgs/cuesoft-logo.svg';
import cueIcon from '@/svgs/cuesoft-icon.svg';
import { useAuth } from '@/hooks/queries/useAuth';

import { RiHomeFill } from 'react-icons/ri';
import { IoIosStar } from 'react-icons/io';
import { PiPuzzlePieceFill } from 'react-icons/pi';
import { FaUser } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { ArrowRight, Menu, X } from 'lucide-react';

function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true); // collapsed by default on mobile
  const { user } = useAuth();

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to get user avatar
  const getUserAvatar = () => {
    if (user?.fields.Attachments && user.fields.Attachments.length > 0) {
      return user.fields.Attachments[0].url;
    }
    return null;
  };

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
      name: 'Marketplace',
      icon: PiPuzzlePieceFill,
      href: '/platform/dashboard/marketplace',
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

  // Sidebar width and overlay for mobile
  // On md+ screens: always expanded, no overlay
  // On mobile: overlay and collapsed/expanded
  return (
    <>
      {/* Overlay for mobile when expanded */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity ${collapsed ? 'pointer-events-none opacity-0 hidden' : 'pointer-events-auto opacity-100'}`}
        onClick={() => setCollapsed(true)}
        aria-hidden={collapsed}
      />
      <div
        className={` z-40 top-0 left-0 h-full bg-darkmode-bg border-r border-auth-border p-6 flex flex-col transition-all duration-300 lg:w-[250px] xl:w-[300px]
          ${collapsed ? 'w-[72px] -translate-x-0' : 'w-[220px] translate-x-0 fixed'}
        `}
        style={{ minWidth: collapsed ? 72 : 220 }}
      >
        {/* Toggle button - only on mobile */}
        <button
          className='lg:hidden mb-8 text-white focus:outline-none self-end'
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu size={24} /> : <X size={24} />}
        </button>

        {/* Logo */}
        <div
          className={`mb-8 flex items-center ${collapsed ? 'justify-center' : ''}`}
        >
          <div className='w-full'>
            {collapsed ? (
              <>
                <Image
                  src={cueIcon}
                  alt='Cuesoft Logo'
                  width={35}
                  height={22}
                  className='lg:hidden'
                />
                <Image
                  src={logo}
                  alt='Cuesoft Logo'
                  width={127.2}
                  height={25}
                  className='hidden lg:block'
                />
              </>
            ) : (
              <div className='flex items-center justify-between'>
                <Image
                  src={logo}
                  alt='Cuesoft Logo'
                  width={127.2}
                  height={25}
                />
                {/* <Code width={12} height={22} className='text-[#AEB9E1]' /> */}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 space-y-3'>
          {navLinks.map((link) => {
            const isDashboard = link.href === '/platform/dashboard';
            const isActive = isDashboard
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1 text-sm text-dashboard-nav font-medium hover:text-white transition-colors h-[42px] ${collapsed ? 'justify-center lg:justify-start' : ''}`}
              >
                <link.icon
                  className='w-[20px] h-[20px]'
                  style={{
                    fill: isActive ? 'url(#activeGradient)' : '',
                  }}
                />
                {/* Hide text on mobile when collapsed, show on md+ or when expanded */}
                <span
                  className={`ml-2 transition-all duration-200 ${collapsed ? 'hidden lg:inline' : 'inline'}`}
                >
                  {link.name}
                </span>
              </Link>
            );
          })}

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
        <div
          className={`border-t border-auth-border pt-4 w-full ${collapsed ? 'items-center flex flex-col' : ''}`}
        >
          <div
            className={`flex items-center gap-3 mb-4 w-full ${collapsed ? 'flex-col gap-1 lg:flex-row' : 'flex-row'} `}
          >
            {getUserAvatar() ? (
              <Image
                src={getUserAvatar()!}
                alt={`${user?.fields.Name || 'User'} avatar`}
                width={40}
                height={40}
                className='w-10 h-10 md:w-[32px] md:h-[32px] rounded-full object-cover'
              />
            ) : (
              <div className='w-10 h-10 md:w-[32px] md:h-[32px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                {user?.fields.Name ? getUserInitials(user.fields.Name) : 'U'}
              </div>
            )}
            <div
              className={`${collapsed ? 'hidden lg:block text-center lg:text-left' : ''} `}
            >
              <div className='text-white text-sm font-medium'>
                {user?.fields.Name || 'User'}
              </div>
              <div className='text-auth-text text-xs'>
                {user?.fields.Email || 'Account settings'}
              </div>
            </div>
          </div>
          <Button
            className={`btn-main-p w-full ${collapsed ? 'hidden lg:flex' : 'flex'}`}
          >
            Sign Out <ArrowRight />
          </Button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
