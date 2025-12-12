import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={cn(props.className)}
  >
    <defs>
      <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#FF0000' }} />
        <stop offset="16.66%" style={{ stopColor: '#FF7F00' }} />
        <stop offset="33.33%" style={{ stopColor: '#FFFF00' }} />
        <stop offset="50%" style={{ stopColor: '#00FF00' }} />
        <stop offset="66.66%" style={{ stopColor: '#0000FF' }} />
        <stop offset="83.33%" style={{ stopColor: '#4B0082' }} />
        <stop offset="100%" style={{ stopColor: '#9400D3' }} />
      </linearGradient>
    </defs>
    <path d="M12 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" stroke="url(#rainbow)" />
    <path d="M12 2a10 10 0 0 0-4.472 18.156" stroke="url(#rainbow)" />
    <path d="M12 2a10 10 0 0 1 4.472 18.156" stroke="url(#rainbow)" />
    <path d="M2 12a10 10 0 0 1 15.528-8.32" stroke="url(#rainbow)" />
    <path d="M22 12a10 10 0 0 0-15.528-8.32" stroke="url(#rainbow)" />
  </svg>
);

export default Logo;
