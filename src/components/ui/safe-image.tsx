'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

type Props = Omit<ImageProps, 'src'> & {
  src: string;
  fallbackSrc?: string;
};

export default function SafeImage({ src, fallbackSrc = 'https://source.unsplash.com/random/800x600?gray', onError, alt, ...props }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        onError?.(event);
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
