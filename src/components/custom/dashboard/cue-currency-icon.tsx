import React from 'react';

type CueCurrencyIconProps = {
  color?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
};

function CueCurrencyIcon({
  color = 'white',
  width = 24,
  height = 24,
  className = '',
  ...props
}: CueCurrencyIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 24 23'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      {...props}
    >
      <path
        d='M20.5303 6.24695C18.9722 3.42896 14.9276 0.633217 9.95461 3.42896C3.2909 7.17523 4.74967 21 13.8998 21C14.8613 21 18.8395 20.9668 20.5303 16.3254'
        stroke={color}
        strokeWidth='2.65222'
      />
      <path
        d='M0.453613 9.96291H23.4616'
        stroke={color}
        strokeWidth='1.65764'
      />
      <path
        d='M0.453491 13.3441H23.4615'
        stroke={color}
        strokeWidth='1.65764'
      />
    </svg>
  );
}

export default CueCurrencyIcon;
