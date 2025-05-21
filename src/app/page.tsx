import Image from 'next/image';

import NavBar from '@/components/custom/navigation/navbar';
import Footer from '@/components/custom/navigation/footer';

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
import shirt from '@/images/shirt.webp';
import iwatch from '@/images/iwatch.webp';
import ipad from '@/images/ipad.webp';
import airpods from '@/images/airpods.webp';
import macbook from '@/images/macbook.webp';
import flask from '@/images/flask.webp';
import collab from '@/images/collab.webp';
import projectImg from '@/images/projects.webp';

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

  const rewards = [
    {
      img: shirt,
      name: 'Branded T-shirt',
    },
    {
      img: iwatch,
      name: 'Apple Watch',
    },
    {
      img: ipad,
      name: 'iPad',
    },
    {
      img: airpods,
      name: 'AirPods',
    },
    {
      img: macbook,
      name: 'MacBook',
    },
    {
      img: flask,
      name: 'Flask',
    },
  ];

  return (
    <div className='w-full font-fustat'>
      <NavBar />

      <main className='w-full'>
        <section
          id='home'
          className='h-screen bg-[url("/svgs/hero-bg.svg")] flex items-center justify-center bg-cover bg-no-repeat md:my-0'
        >
          <div className='w-[90%] xl:w-[74.2%] py-[2rem] md:py-0 mx-auto flex flex-col gap-[4rem] md:gap-0 md:flex-row items-center justify-between'>
            <div className='w-full md:w-[53%] relative flex items-center justify-center lg:justify-end'>
              <Image
                src={heroImgFront}
                alt='Hero Image Front'
                className='w-[300px] h-[320px] lg:w-[500px] lg:h-[520px] absolute lg:-top-8 lg:left-0'
              />

              <Image
                src={heroImgBack}
                alt='Hero Image Back'
                className='w-[280px] h-[290px] lg:w-[440px] lg:h-[460px]'
              />

              <Image
                src={cueCurrency}
                alt='Cue Currency'
                className='absolute right-0 -bottom-[2rem] md:-bottom-1/3 md:right-1/3'
              />

              <div className='floating-badge left-0 lg:-left-1/12 lg:bottom-1/5'>
                Redeem Now
              </div>

              <div className='floating-badge right-0 lg:-right-1/12 lg:bottom-2/5 rotate-[18deg]'>
                Cool Gadgets
              </div>
            </div>

            <div className='w-full md:w-[55%] lg:w-[40%] text-center md:text-left'>
              <h1 className='capitalize text-4xl lg:text-5xl lg:text-[56px] lg:leading-[72.8px] font-extrabold'>
                Contribute to open-source AI
              </h1>

              <p className='text-2xl lg:text-[40px] lg:leading-[59.8px] font-extrabold capitalize gradient-bg mt-4'>
                earn cue points, And redeem awesome gadgets!
              </p>

              <div className='flex gap-6 justify-center md:justify-start items-center mt-6 w-full '>
                <Button className='btn-secondary'>Sign Up</Button>

                <Button variant={'default'} className='btn-main'>
                  Join Our Community
                  <Image src={btnIcon} alt='Arrow Icon' />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id='product' className='mt-10 lg:mt-32 w-full'>
          <div className='w-[90%] xl:w-[45%] mx-auto text-center'>
            <h2 className='text-3xl md:text-4xl lg:text-[56px] lg:leading-[72.8px] font-extrabold capitalize'>
              Product Walkthrough
            </h2>
            <p className='text-sm md:text-lg md:leading-[27px] w-[90%] mx-auto'>
              Explore a selection of top AI projects that showcase innovation,
              collaboration, and real-world impact.
            </p>
          </div>

          <div className='w-full bg-[url("/svgs/hero-bg.svg")] bg-contain pt-16 lg:pt-32'>
            <div className='w-full mx-auto bg-[url("/svgs/curly-vector.svg")] bg-no-repeat bg-position-[center_top_8rem] relative'>
              <Image
                src={trophy}
                alt='Trophy'
                className='absolute top-[6rem] left-0 md:top-[7rem] md:left-[2rem] xl:top-[8rem] xl:left-[14rem]'
              />
              <Image
                src={trophy}
                alt='Trophy'
                className='absolute bottom-[12rem] right-0 md:bottom-0 md:right-[1rem] lg:bottom-[18rem] xl:bottom-[24rem] xl:right-[10rem]'
              />

              <div className='floating-badge right-0 md:top-[18rem] md:right-[2rem] lg:top-[23rem]  xl:top-[19rem] xl:right-[4rem] rotate-[18deg]'>
                Rewards!
              </div>

              <div className='floating-badge bottom-[30rem] md:left-[2rem] md:bottom-[20rem] lg:bottom-[25rem] xl:left-[6rem] xl:bottom-[40rem] rotate-[-18deg]'>
                Redeem
              </div>

              <div className='bg-product-walkthrough-bg border border-product-walkthrough-border rounded-4xl w-[85%] xl:w-[65%] p-6 lg:p-14 mx-auto'>
                <div className='flex flex-col gap-5 md:gap-0 md:flex-row items-center justify-between border-b  border-b-product-item-border pb-14'>
                  <div className=' md:w-[42%]'>
                    <Image src={bounties} alt='Bounties' className='' />
                  </div>
                  <div className='md:w-[53%]'>
                    <h3 className='text-2xl md:text-3xl lg:text-[32px] lg:leading-[38.4px] font-extrabold '>
                      Check bounties to work
                    </h3>
                    <p className='text-sm lg:text-[16px] lg:leading-[28px] mt-2 md:mt-4'>
                      Explore a curated list of paid tasks, challenges, and gigs
                      tailored to your skills. Complete bounties, earn rewards,
                      and grow your reputation—all while contributing to
                      meaningful projects. Start claiming opportunities today!
                    </p>
                  </div>
                </div>

                <div className='flex flex-col-reverse gap-5 md:flex-row items-center justify-between border-b  border-b-product-item-border py-14'>
                  <div className='md:w-[53%]'>
                    <h3 className='text-2xl md:text-3xl lg:text-[32px] lg:leading-[38.4px] font-extrabold '>
                      Make contribution to be eligible for cues
                    </h3>
                    <p className='text-sm lg:text-[16px] lg:leading-[28px] mt-2 md:mt-4'>
                      Unlock exclusive opportunities by actively participating!
                      Contribute meaningfully to projects, demonstrate your
                      skills, and qualify for curated rewards, early access, and
                      special privileges in the community.
                    </p>
                  </div>

                  <div className=' md:w-[42%]'>
                    <Image
                      src={contributions}
                      alt='contributions'
                      className=''
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-5 md:flex-row items-center justify-between border-b  border-b-product-item-border py-14'>
                  <div className=' md:w-[42%]'>
                    <Image src={leaderboards} alt='leaderboards' className='' />
                  </div>
                  <div className='md:w-[53%]'>
                    <h3 className='text-2xl md:text-3xl lg:text-[32px] lg:leading-[38.4px] font-extrabold '>
                      Reign supreme on the leaderboard
                    </h3>
                    <p className='text-sm lg:text-[16px] lg:leading-[28px] mt-2 md:mt-4'>
                      Climb the ranks by completing high-value bounties,
                      showcasing elite skills, and outshining rivals. Top
                      performers earn exclusive rewards, recognition, and
                      authority—dominate the competition and etch your name at
                      the pinnacle.
                    </p>
                  </div>
                </div>

                <div className='flex flex-col-reverse gap-5 md:flex-row items-center justify-between pt-14'>
                  <div className='md:w-[53%]'>
                    <h3 className='text-2xl md:text-3xl lg:text-[32px] lg:leading-[38.4px] font-extrabold '>
                      Redeem cues and get awesome gadgets
                    </h3>
                    <p className='text-sm lg:text-[16px] lg:leading-[28px] mt-2 md:mt-4'>
                      Cash in your earned cues for exclusive tech, premium gear,
                      and must-have collectibles! From wireless earbuds to smart
                      watches - level up your rewards as you climb the tiers.
                      The more you participate, the hotter the gadgets get!
                    </p>
                  </div>

                  <div className=' md:w-[42%]'>
                    <Image src={cueRewards} alt='Rewards' className='' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id='projects' className='mt-10 lg:mt-32 py-[4rem] w-full'>
          <div className='w-[90%] xl:w-[45%] mx-auto text-center'>
            <h2 className='text-3xl md:text-4xl lg:text-[56px] lg:leading-[72.8px] font-extrabold capitalize'>
              Featured Projects
            </h2>
            <p className='text-sm md:text-lg lg:text-lg lg:leading-[27px] w-[90%] mx-auto'>
              Explore a selection of top AI projects that showcase innovation,
              collaboration, and real-world impact.
            </p>
          </div>

          <div className='w-[90%] xl:w-[87.2%] mx-auto flex flex-col lg:flex-row flex-wrap items-center justify-between gap-y-[3rem] mt-[3rem] lg:mt-[6rem]'>
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
                  <h3 className='text-2xl md:text-[32px] font-semibold md:leading-[48px] gradient-bg-text'>
                    {project.name}
                  </h3>

                  <p className='text-sm md:text-xl leading-5 mt-2'>
                    {project.description}
                  </p>
                </div>

                <div className='flex items-center justify-between mt-4'>
                  <div className='flex items-center gap-4'>
                    <div className='featured-tool'>Tensorflow</div>
                  </div>

                  <p className='text-[#6481F1] flex items-center gap-1 text-sm md:text-16c font-medium'>
                    Github <ArrowUpRight />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id='community' className='mt-10 lg:mt-32 w-full'>
          <div className='w-[90%] xl:w-[51%] mx-auto text-center'>
            <h2 className='text-3xl md:text-4xl lg:text-[56px] lg:leading-[72.8px] font-extrabold capitalize'>
              Community Benefits
            </h2>
            <p className='text-sm lg:text-lg lg:leading-[27px] w-full mx-auto'>
              Gain access to shared resources, mentorship, collaboration
              opportunities, and real-world experience by contributing to our
              open-source AI community.
            </p>
          </div>

          <div className='gradient-bg-benefits w-[90%] xl:w-[78%] p-4 md:p-6 mx-auto mt-12 lg:mt-24 border border-[#3A3A3A] rounded-[20px] bg-[url("/svgs/rewards-bg.svg")] '>
            <div className='flex justify-between'>
              <div className='w-[70%] md:w-[65%]'>
                <h3 className='text-3xl md:text-4xl lg:text-5xl lg:leading-[72.8px] font-extrabold'>
                  Earning Rewards
                </h3>

                <p className='text-sm lg:text-lg lg:leading-[27px] mt-2 lg:mt-0'>
                  Earn rewards like branded merchandise or tech gadgets by
                  completing tasks and contributing to AI projects through our
                  bounty system. Simply participate, earn cues, and redeem them
                  for exciting perks.
                </p>
              </div>

              <Image src={cueCurrency} alt='Cue Currency' className='' />
            </div>

            <div className='mt-14 flex justify-between lg:justify-start gap-5 gap-y-6 flex-wrap items-center'>
              {rewards.map((reward, index) => (
                <div
                  key={index}
                  className='bg-[#16151D] border border-[#444444] rounded-[20px] p-3 text-center w-[45%] md:w-[30%] lg:w-[23%] max-w-[256px]'
                >
                  <Image
                    src={reward.img}
                    alt={reward.name}
                    className='w-full h-full'
                  />
                  <p className='text-lg leading-[27px] mt-2'>{reward.name}</p>
                </div>
              ))}
            </div>

            <div className='flex items-center justify-center mt-5 md:mt-10'>
              <Button variant={'default'} className='btn-main'>
                Visit Marketplace
                <Image src={btnIcon} alt='Arrow Icon' />
              </Button>
            </div>
          </div>

          <div className='mt-12 w-[90%] xl:w-[78%] mx-auto flex flex-col gap-6 md:gap-0 md:flex-row justify-between'>
            <div className='w-full md:w-[48%] gradient-bg-benefits rounded-[20px] p-4 lg:p-6 border border-[#3A3A3A]'>
              <div className=''>
                <h4 className='text-2xl md:text-3xl lg:text-[32px] lg:leading-[40px] font-extrabold'>
                  Collaboration with like-minded developers
                </h4>

                <p className='text-sm md:text-16c md:leading-[24px] mt-2 md:mt-4'>
                  Collaborate with like-minded developers in an open-source
                  environment to share ideas and build meaningful AI solutions
                  together.
                </p>
              </div>

              <div className='bg-[#16151D] border border-[#444444] rounded-[20px] p-2 mt-6 md:mt-12'>
                <Image
                  src={collab}
                  alt='Collaboration'
                  className='w-full h-full'
                />
              </div>
            </div>

            <div className='w-full md:w-[48%] gradient-bg-benefits rounded-[20px] p-4 lg:p-6 border border-[#3A3A3A]'>
              <div className=''>
                <h4 className='text-2xl md:text-3xl lg:text-[32px] lg:leading-[40px] font-extrabold'>
                  Contribution to impactful AI projects
                </h4>

                <p className='text-sm md:text-16c md:leading-[24px] mt-2 md:mt-4'>
                  Contribute your skills to open-source AI projects focused on
                  solving real-world challenges, alongside a community of
                  passionate developers.
                </p>
              </div>

              <div className='bg-[#16151D] border border-[#444444] rounded-[20px] p-2 mt-6 md:mt-12'>
                <Image
                  src={projectImg}
                  alt='Projects'
                  className='w-full h-full'
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
