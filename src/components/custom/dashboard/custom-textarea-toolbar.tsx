import React, { useRef } from 'react';
// If shadcn/ui is installed, import Button and other primitives from it
// import { Button } from "@/components/ui/button";

import { FaBold } from 'react-icons/fa';
import { FaItalic } from 'react-icons/fa';
import { FaHeading } from 'react-icons/fa';
import { FaQuoteRight } from 'react-icons/fa';
import { MdLink } from 'react-icons/md';
import { IoMdImage } from 'react-icons/io';
import { MdFormatListBulleted } from 'react-icons/md';
import { MdOutlineFormatListNumbered } from 'react-icons/md';

const toolbarIcons = [
  { label: 'Bold', icon: <FaBold />, action: 'bold' },
  { label: 'Italic', icon: <FaItalic />, action: 'italic' },
  {
    label: 'Heading',
    icon: <FaHeading />,
    action: 'heading',
  },
  {
    label: 'Subheading',
    icon: <span className='font-extrabold text-sm'>H</span>,
    action: 'subheading',
  },
  { label: 'Quote', icon: <FaQuoteRight />, action: 'quote' },
  { label: 'Link', icon: <MdLink />, action: 'link' },
  { label: 'Image', icon: <IoMdImage />, action: 'image' },
  {
    label: 'Bulleted List',
    icon: <MdFormatListBulleted />,
    action: 'bulleted',
  },
  {
    label: 'Numbered List',
    icon: <MdOutlineFormatListNumbered />,
    action: 'numbered',
  },
];

function formatText(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  action: string,
): { text: string; newStart: number; newEnd: number } {
  const selected = value.slice(selectionStart, selectionEnd);
  const before = value.slice(0, selectionStart);
  const after = value.slice(selectionEnd);
  let text = value;
  let newStart = selectionStart;
  let newEnd = selectionEnd;

  switch (action) {
    case 'bold':
      text = `${before}**${selected || 'bold text'}**${after}`;
      newStart += 2;
      newEnd = newStart + (selected ? selected.length : 9);
      break;
    case 'italic':
      text = `${before}*${selected || 'italic text'}*${after}`;
      newStart += 1;
      newEnd = newStart + (selected ? selected.length : 11);
      break;
    case 'heading':
      text = `${before}# ${selected || 'Heading'}${after}`;
      newStart += 2;
      newEnd = newStart + (selected ? selected.length : 7);
      break;
    case 'subheading':
      text = `${before}## ${selected || 'Subheading'}${after}`;
      newStart += 3;
      newEnd = newStart + (selected ? selected.length : 10);
      break;
    case 'quote':
      text = `${before}> ${selected || 'Quote'}${after}`;
      newStart += 2;
      newEnd = newStart + (selected ? selected.length : 5);
      break;
    case 'link':
      text = `${before}[${selected || 'link text'}](url)${after}`;
      newStart += 1;
      newEnd = newStart + (selected ? selected.length : 8);
      break;
    case 'image':
      text = `${before}![${selected || 'alt text'}](url)${after}`;
      newStart += 2;
      newEnd = newStart + (selected ? selected.length : 8);
      break;
    case 'bulleted':
      text = `${before}- ${selected || 'List item'}${after}`;
      newStart += 2;
      newEnd = newStart + (selected ? selected.length : 9);
      break;
    case 'numbered':
      text = `${before}1. ${selected || 'List item'}${after}`;
      newStart += 3;
      newEnd = newStart + (selected ? selected.length : 9);
      break;
    default:
      break;
  }
  return { text, newStart, newEnd };
}

interface CustomTextareaToolbarProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

function CustomTextareaToolbar({
  value = '',
  onChange,
  disabled = false,
}: CustomTextareaToolbarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = (action: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const { text, newStart, newEnd } = formatText(
      value,
      selectionStart,
      selectionEnd,
      action,
    );
    onChange?.(text);
    // Set selection after update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  return (
    <div className='input-style'>
      <label className='text-sm font-medium text-auth-text leading-5'>
        Enter Comments
      </label>
      <div className='border border-auth-text! text-16c text-[#454545] rounded-[8px] min-h-[80px] p-4'>
        <textarea
          ref={textareaRef}
          className='h-full w-full focus-visible:border-0 focus-visible:ring-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed'
          placeholder="A little about the specifications you'll be working with."
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
        />
        <div className='flex items-center pt-2'>
          {toolbarIcons.map((item) => (
            <button
              key={item.label}
              type='button'
              className={`text-[#98A2B3] hover:text-white p-1 rounded cursor-pointer w-[32px] h-[32px] flex items-center justify-center ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label={item.label}
              onClick={() => !disabled && handleFormat(item.action)}
              disabled={disabled}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomTextareaToolbar;
