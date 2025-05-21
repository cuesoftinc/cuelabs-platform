import Image from 'next/image';

import logo from '@/svgs/cuesoft-logo.svg';
import fb from '@/svgs/fb-full.svg';
import x from '@/svgs/x-full.svg';
import ig from '@/svgs/ig-full.svg';
import Link from 'next/link';

function Footer() {
  return (
    <footer className=' bg-[#050505] py-[4rem] mt-[5rem]'>
      <div className='w-[80%] mx-auto flex flex-col gap-14 lg:gap-0 lg:flex-row justify-between'>
        <div className='flex flex-col gap-5'>
          <Image src={logo} alt='cuesoft logo' width={149} height={32} />

          <p className='text-lg leading-[27px] text-[#555555]'>
            Ai innovation for global impact
          </p>

          <div className='flex gap-4 items-center'>
            <Link href='https://facebook.com/cuesoft' target='_blank'>
              <Image src={fb} alt='facebook logo' className='' />
            </Link>

            <Link href='https://x.com/cuesoftinc' target='_blank'>
              <Image src={x} alt='x logo' className='' />
            </Link>

            <Link href='https://instagram.com/cuesoftinc' target='_blank'>
              <Image src={ig} alt='instagram logo' className='' />
            </Link>
          </div>
        </div>

        <div className='flex justify-between md:w-[60%] lg:w-[40%] xl:w-[30%]'>
          <ul className='flex flex-col gap-5 text-[#555555] text-lg leading-[27px]'>
            <li className='text-[19.53px] text-white leading-[27px] font-bold'>
              Pages
            </li>
            <li className=''>
              <a href='#home'>Home</a>
            </li>
            <li className=''>Dashboard</li>
            <li className=''>
              <a href='#projects'>Projects</a>
            </li>
            <li className=''>Marketplace</li>
          </ul>

          <ul className='flex flex-col gap-5 text-[#555555] text-lg leading-[27px]'>
            <li className='text-[19.53px] text-white leading-[27px] font-bold'>
              Other
            </li>
            <li className=''>
              <a href='https://privacy.cuesoft.io' target='_blank'>
                Privacy Policy
              </a>
            </li>
            <li className=''>
              <a href='https://terms.cuesoft.io' target='_blank'>
                Terms of service
              </a>
            </li>
            <li className=''>Contact</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
