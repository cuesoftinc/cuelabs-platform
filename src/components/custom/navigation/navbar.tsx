import Image from 'next/image';

import { Button } from '@/components/ui/button';

import logo from '@/svgs/cuesoft-logo.svg';
import btnIcon from '@/svgs/cta-arrow.svg';

const navLinks = [
  {
    url: '/',
    name: 'Home',
  },
  {
    url: '/dashboard',
    name: 'Dashboard',
  },
  {
    url: '/projects',
    name: 'Projects',
  },
  {
    url: '/marketplace',
    name: 'Marketplace',
  },
];

function NavBar() {
  return (
    <nav className='mx-auto h-[82px] w-[87.2%] flex items-center justify-between'>
      <Image src={logo} alt='Cuesoft Logo' className='w-[213.7px] h-[42px]' />

      <ul className='text-16c font-semibold leading-[16px] flex items-center gap-8'>
        {navLinks.map((link, index) => (
          <li
            key={index}
            className='hover:border-b-[#CB39C1] pb-1.5 pt-1 border-2 border-transparent cursor-pointer'
          >
            {link.name}
          </li>
        ))}
      </ul>

      <Button variant={'default'} className='btn-main'>
        Get Started
        <Image src={btnIcon} alt='Arrow Icon' />
      </Button>
    </nav>
  );
}

export default NavBar;
