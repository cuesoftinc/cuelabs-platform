'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface StatusFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'New', label: 'New' },
  { value: 'Todo', label: 'Todo' },
  { value: 'In progress', label: 'In Progress' },
  { value: 'Done', label: 'Completed' },
];

function StatusFilter({ value, onValueChange }: StatusFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedOption =
    statusOptions.find((option) => option.value === value) || statusOptions[0];

  return (
    <div className='relative'>
      <button
        onClick={() => setOpen(!open)}
        className='border border-[#1F1F1F] flex items-center md:gap-2 p-1 md:p-[9px] shadow-[1px_1px_1px_0px_#1F1F1F66] bg-darkmode-bg rounded-[4px] text-dashboard-nav text-[10px] font-medium hover:bg-[#1f1f1f]'
      >
        <span>{selectedOption.label}</span>
        <ChevronDown className='w-3 h-3' />
      </button>

      {open && (
        <div className='absolute top-full left-0 mt-1 bg-darkmode-bg border border-auth-border rounded-[4px] shadow-lg z-10 min-w-[150px]'>
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onValueChange(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-[10px] hover:bg-[#1f1f1f] ${
                value === option.value ? 'text-white' : 'text-auth-text'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusFilter;
