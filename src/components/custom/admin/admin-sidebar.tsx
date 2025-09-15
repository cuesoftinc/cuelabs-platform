'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PiPuzzlePieceFill, PiFileTextFill } from 'react-icons/pi';

interface AdminSidebarProps {
  className?: string;
}

function AdminSidebar({ className = '' }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Bounties',
      href: '/platform/admin/bounties',
      icon: PiPuzzlePieceFill,
    },
    {
      name: 'Submissions',
      href: '/platform/admin/submissions',
      icon: PiFileTextFill,
    },
  ];

  return (
    <div className={`bg-[#0A0A0A] border-r border-[#1F1F1F] w-64 min-h-screen ${className}`}>
      <div className='p-6'>
        <h2 className='text-white text-lg font-semibold mb-8'>Admin Panel</h2>
        
        <nav className='space-y-2'>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#575DFF] to-[#8B5CF6] text-white shadow-lg'
                    : 'text-auth-text hover:bg-[#1A1A1A] hover:text-white'
                }`}
              >
                <Icon className='w-5 h-5' />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default AdminSidebar;
