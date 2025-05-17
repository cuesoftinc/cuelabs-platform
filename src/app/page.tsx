import Image from 'next/image';

import NavBar from '@/components/custom/navigation/navbar';

import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

import btnIcon from '@/svgs/cta-arrow.svg';
import cueCurrency from '@/svgs/cue-currency.svg';
import trophy from '@/svgs/bounty-trophy.svg';

import heroImgFront from '@/images/hero-img-front.webp';
import heroImgBack from '@/images/hero-img-back.webp';
import bounties from '@/images/bounties.webp';
import contributions from '@/images/contributions.webp';
import cueRewards from '@/images/cue-rewards.webp';
import leaderboards from '@/images/leaderboards.webp';
import apparule from '@/images/apparule.webp';
import storefront from '@/images/storefront.webp';
import upstat from '@/images/upstat.webp';
import expendit from '@/images/upstat-e.webp';

export default function Home() {
  const projects = [
    {
      img: apparule,
      name: 'Apparule',
      description:
        'Elevate your Fashion Design with Augmented Reality. Unlock the future of fashion measurement with Apparule and get the perfect fit every time.',
    },
    {
      img: upstat,
      name: 'Upstat',
      description:
        'Elevate your Fashion Design with Augmented Reality. Unlock the future of fashion measurement with Apparule and get the perfect fit every time.',
    },
    {
      img: storefront,
      name: 'Storefront',
      description:
        'Elevate your Fashion Design with Augmented Reality. Unlock the future of fashion measurement with Apparule and get the perfect fit every time.',
    },
    {
      img: expendit,
      name: 'Expendit',
      description:
        'Elevate your Fashion Design with Augmented Reality. Unlock the future of fashion measurement with Apparule and get the perfect fit every time.',
    },
  ];

  return (
    <div className='w-full font-fustat'>
      <NavBar />

      <main className='w-full'>
        <section className='h-screen bg-[url("/svgs/hero-bg.svg")] flex items-center justify-center bg-cover bg-no-repeat'>
          <div className='w-[74.2%] mx-auto flex items-center justify-between'>
            <div className='w-[53%] relative flex items-center justify-end'>
              <Image
                src={heroImgFront}
                alt='Hero Image Front'
                className='w-[500px] h-[520px] absolute -top-8 left-0'
              />

              <Image
                src={heroImgBack}
                alt='Hero Image Back'
                className='w-[440px] h-[460px]'
              />

              <Image
                src={cueCurrency}
                alt='Cue Currency'
                className='absolute -bottom-1/3 right-1/3'
              />

              <div className='floating-badge -left-1/12 bottom-1/5'>
                Redeem Now
              </div>

              <div className='floating-badge -right-1/12 bottom-2/5 rotate-[18deg]'>
                Cool Gadgets
              </div>
            </div>

            <div className='w-[40%]'>
              <h1 className='capitalize text-[56px] leading-[72.8px] font-extrabold'>
                Contribute to open-source AI
              </h1>

              <p className='text-[40px] leading-[59.8px] font-extrabold capitalize gradient-bg mt-4'>
                earn cue points, And redeem awesome gadgets!
              </p>

              <div className='flex gap-6 items-center mt-6 w-full'>
                <Button className='btn-secondary'>Sign Up</Button>

                <Button variant={'default'} className='btn-main'>
                  Join Our Community
                  <Image src={btnIcon} alt='Arrow Icon' />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className='mt-32 w-full'>
          <div className='w-[45%] mx-auto text-center'>
            <h2 className='text-[56px] leading-[72.8px] font-extrabold capitalize'>
              Product Walkthrough
            </h2>
            <p className='text-lg leading-[27px] w-[90%] mx-auto'>
              Explore a selection of top AI projects that showcase innovation,
              collaboration, and real-world impact.
            </p>
          </div>

          <div className='w-full bg-[url("/svgs/hero-bg.svg")] bg-no-repeat pt-32'>
            <div className='w-[86%] mx-auto bg-[url("/svgs/curly-vector.svg")] bg-no-repeat bg-position-[center_top_8rem] relative'>
              <Image
                src={trophy}
                alt='Trophy'
                className='absolute top-[8rem] left-[8rem]'
              />
              <Image
                src={trophy}
                alt='Trophy'
                className='absolute bottom-[23.5rem] right-[3rem]'
              />

              <div className='bg-product-walkthrough-bg border border-product-walkthrough-border rounded-4xl w-[75%] p-14 mx-auto'>
                <div className='flex items-center justify-between border-b  border-b-product-item-border pb-14'>
                  <div className=' w-[42%]'>
                    <Image src={bounties} alt='Bounties' className='' />
                  </div>
                  <div className=' w-[53%]'>
                    <h3 className='text-[32px] leading-[38.4px] font-extrabold '>
                      Check bounties to work
                    </h3>
                    <p className='text-[16px] leading-[28px] mt-4'>
                      Explore a curated list of paid tasks, challenges, and gigs
                      tailored to your skills. Complete bounties, earn rewards,
                      and grow your reputation—all while contributing to
                      meaningful projects. Start claiming opportunities today!
                    </p>
                  </div>
                </div>

                <div className='flex items-center justify-between border-b  border-b-product-item-border py-14'>
                  <div className=' w-[53%]'>
                    <h3 className='text-[32px] leading-[38.4px] font-extrabold '>
                      Make contribution to be eligible for cues
                    </h3>
                    <p className='text-[16px] leading-[28px] mt-4'>
                      Unlock exclusive opportunities by actively participating!
                      Contribute meaningfully to projects, demonstrate your
                      skills, and qualify for curated rewards, early access, and
                      special privileges in the community.
                    </p>
                  </div>

                  <div className=' w-[42%]'>
                    <Image
                      src={contributions}
                      alt='contributions'
                      className=''
                    />
                  </div>
                </div>

                <div className='flex items-center justify-between border-b  border-b-product-item-border py-14'>
                  <div className=' w-[42%]'>
                    <Image src={leaderboards} alt='leaderboards' className='' />
                  </div>
                  <div className=' w-[53%]'>
                    <h3 className='text-[32px] leading-[38.4px] font-extrabold '>
                      Reign supreme on the leaderboard
                    </h3>
                    <p className='text-[16px] leading-[28px] mt-4'>
                      Climb the ranks by completing high-value bounties,
                      showcasing elite skills, and outshining rivals. Top
                      performers earn exclusive rewards, recognition, and
                      authority—dominate the competition and etch your name at
                      the pinnacle.
                    </p>
                  </div>
                </div>

                <div className='flex items-center justify-between pt-14'>
                  <div className=' w-[53%]'>
                    <h3 className='text-[32px] leading-[38.4px] font-extrabold '>
                      Redeem cues and get awesome gadgets
                    </h3>
                    <p className='text-[16px] leading-[28px] mt-4'>
                      Cash in your earned cues for exclusive tech, premium gear,
                      and must-have collectibles! From wireless earbuds to smart
                      watches - level up your rewards as you climb the tiers.
                      The more you participate, the hotter the gadgets get!
                    </p>
                  </div>

                  <div className=' w-[42%]'>
                    <Image src={cueRewards} alt='Rewards' className='' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='mt-32 w-full'>
          <div className='w-[45%] mx-auto text-center'>
            <h2 className='text-[56px] leading-[72.8px] font-extrabold capitalize'>
              Featured Projects
            </h2>
            <p className='text-lg leading-[27px] w-[90%] mx-auto'>
              Explore a selection of top AI projects that showcase innovation,
              collaboration, and real-world impact.
            </p>
          </div>

          <div className='w-[87.2%] mx-auto flex flex-wrap items-center justify-between gap-y-[3rem] mt-[6rem]'>
            {projects.map((project, index) => (
              <div key={index} className='featured-project'>
                <div className='h-[222px] rounded-[10px]'>
                  <Image
                    src={project.img}
                    alt={project.name}
                    className='w-full h-full'
                  />
                </div>

                <div className='mt-4'>
                  <h3 className='text-[32px] font-semibold leading-[48px] gradient-bg-text'>
                    {project.name}
                  </h3>

                  <p className='text-xl leading-5 mt-2'>
                    {project.description}
                  </p>
                </div>

                <div className='flex items-center justify-between mt-4'>
                  <div className='flex items-center gap-4'>
                    <div className='featured-tool'>Tensorflow</div>
                  </div>

                  <p className='text-[#6481F1] flex items-center gap-1 text-16c font-medium'>
                    Github <ArrowUpRight />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
