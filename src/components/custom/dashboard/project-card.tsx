import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// import { FaCode } from 'react-icons/fa6';
// import { HiDotsHorizontal } from 'react-icons/hi';
import { PiPuzzlePieceFill } from 'react-icons/pi';

import { Card, CardContent } from '@/components/ui/card';
import { Project } from '@/types/projects';

import projectLogo from '@/svgs/project-logo.svg';

interface ProjectCardProps {
  project?: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (project) {
      router.push(`/platform/dashboard/projects/${project.id}`);
    }
  };

  return (
    <Card 
      className='card-container p-0 w-full h-full flex flex-col cursor-pointer hover:opacity-80 transition-opacity'
      onClick={handleCardClick}
    >
      <CardContent className='p-5 flex-1 flex flex-col'>
        <div className='flex items-center justify-between'>
          <div>
            <Image src={projectLogo} alt='project logo' />
          </div>

          <div className='flex gap-1 items-center font-medium text-dashboard-nav text-[10px] '>
            <PiPuzzlePieceFill className='w-3 h-3' />
            <span>
              {project?.fields.Bounties?.length || 0}{' '}
              {project?.fields.Bounties?.length === 1 ? 'Bounty' : 'Bounties'}
            </span>
          </div>
        </div>

        <div className='mt-4 flex-1 flex flex-col'>
          <h3 className='text-xs leading-[14px] mb-1 font-semibold text-white'>
            {project?.fields.Name || 'Project Name'}
          </h3>

          <p className='text-xs leading-[18px] font-medium text-dashboard-nav flex-1'>
            {project?.fields.Description || 'No description available'}
          </p>
        </div>
      </CardContent>

      {/* <CardFooter className='mt-0 py-4 border-t-[0.6px] border-[#1F1F1F] justify-between'>
        <div className='flex gap-2 items-center bg-[#0F0F0F] border-[0.6px] border-[#1F1F1F] p-2 text-white font-medium text-xs rounded-[2px]'>
          <FaCode className='text-[#545454] w-3 h-3' />
          <span>Development</span>
        </div>

        <HiDotsHorizontal className='text-white' />
      </CardFooter> */}
    </Card>
  );
}

export default ProjectCard;
