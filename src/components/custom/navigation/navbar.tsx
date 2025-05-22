'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import logo from '@/svgs/cuesoft-logo.svg';
import btnIcon from '@/svgs/cta-arrow.svg';

import { Menu } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  {
    url: '#home',
    name: 'Home',
  },
  {
    url: '#platform',
    name: 'Platform',
  },
  {
    url: '#projects',
    name: 'Projects',
  },
  {
    url: '#marketplace',
    name: 'Marketplace',
  },
];

function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // const handleClick = () => {
  //   alert('clicked');
  //   setOpenMenu((prev) => !prev);
  // };

  return (
    <nav className='mx-auto h-[82px] w-[90%] lg:w-[87.2%] flex items-center justify-between relative'>
      <Image src={logo} alt='Cuesoft Logo' className='w-[213.7px] h-[42px]' />

      <ul className='text-16c font-semibold leading-[16px] hidden lg:flex items-center gap-8'>
        {navLinks.map((link, index) => (
          <Link href={link.url} key={index}>
            <li
              // key={index}
              className='hover:border-b-[#CB39C1] pb-1.5 pt-1 border-2 border-transparent cursor-pointer'
            >
              {link.name}
            </li>
          </Link>
        ))}
      </ul>

      <Button variant={'default'} className='btn-main hidden lg:flex'>
        Get Started
        <Image src={btnIcon} alt='Arrow Icon' />
      </Button>

      <Menu
        className='block lg:hidden cursor-pointer'
        onClick={() => setOpenMenu((prev) => !prev)}
      />

      {openMenu === true && (
        <div
          ref={menuRef}
          className='flex flex-col items-center gap-8 p-6 bg-[#16151d] rounded-lg shadow-lg absolute w-full text-center z-10 top-20'
          onClick={() => setOpenMenu(false)}
        >
          <ul className='flex flex-col items-center gap-6'>
            {navLinks.map((link, index) => (
              <Link href={link.url} key={index}>
                <li
                  // key={index}
                  className='hover:border-b-[#CB39C1] pb-1.5 pt-1 border-2 border-transparent cursor-pointer'
                >
                  {link.name}
                </li>
              </Link>
            ))}
          </ul>

          <Button variant={'default'} className='btn-main w-full'>
            Get Started
            <Image src={btnIcon} alt='Arrow Icon' />
          </Button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
