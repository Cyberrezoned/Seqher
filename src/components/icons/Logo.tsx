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
    <ellipse cx="12" cy="12" rx="7.7" ry="7.3" />
    <path d="M12 4.7a7.5 7.2 0 0 1 6.55 3.65" opacity="0.45" />
  </svg>
);

export default Logo;
