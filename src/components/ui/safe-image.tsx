'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

type Props = Omit<ImageProps, 'src'> & {
  src: string;
  fallbackSrc?: string;
};

function isSvgSource(url: string) {
  const normalized = url.trim().toLowerCase();
  return normalized.endsWith('.svg') || normalized.startsWith('data:image/svg+xml');
}

function shouldBypassNextImageOptimization(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'seqher.org' || parsed.hostname === 'www.seqher.org';
  } catch {
    return false;
  }
}

export default function SafeImage({ src, fallbackSrc = '/images/placeholder-teal.svg', onError, alt, unoptimized, ...props }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  useEffect(() => {
    let cancelled = false;
    try {
      const probe = new window.Image();
      probe.onload = () => {};
      probe.onerror = () => {
        if (cancelled) return;
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      };
      probe.src = currentSrc;
    } catch {}

    return () => {
      cancelled = true;
    };
  }, [currentSrc, fallbackSrc]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      unoptimized={unoptimized || isSvgSource(currentSrc) || shouldBypassNextImageOptimization(currentSrc)}
      onError={(event) => {
        onError?.(event);
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
