import React from 'react';

import { ChevronDown } from 'lucide-react';

import { ReactNode } from 'react';

interface CustomSelectFilterProps {
  children: ReactNode;
}

function CustomSelectFilter({ children }: CustomSelectFilterProps) {
  return (
    <div className='border border-[#1F1F1F] flex items-center gap-2 p-[9px] shadow-[1px_1px_1px_0px_#1F1F1F66] bg-darkmode-bg rounded-[4px] text-dashboard-nav text-[10px] font-medium'>
      {children}
      <ChevronDown className='w-3 h-3' />
    </div>
  );
}

export default CustomSelectFilter;
