import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={cn(props.className)}
  >
    <circle cx="12" cy="12" r="7.5" />
    <path d="M12 4.5a7.5 7.5 0 0 1 6.5 3.75" opacity="0.45" />
  </svg>
);

export default Logo;
