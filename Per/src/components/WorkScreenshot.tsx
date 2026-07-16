import { useState } from 'react';
import { workScreenshotFallback, workScreenshotSrc } from '../data/works-clients';

interface WorkScreenshotProps {
  id: string;
  url: string;
  title: string;
  previewSrc?: string;
  priority?: boolean;
  className?: string;
}

export function WorkScreenshot({
  id,
  url,
  title,
  previewSrc,
  priority = false,
  className = '',
}: WorkScreenshotProps) {
  const [src, setSrc] = useState(previewSrc ?? workScreenshotSrc(id));
  const [loaded, setLoaded] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  return (
    <div className={`relative h-full w-full overflow-hidden bg-[#111] ${className}`}>
      {!loaded ? (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#141414] via-[#1c1c1c] to-[#111]"
          aria-hidden="true"
        />
      ) : null}
      <img
        src={src}
        alt={`${title} website preview`}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={`h-full w-full object-cover object-top transition-transform duration-image-slow group-hover:scale-[1.03] ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (previewSrc && src === previewSrc) {
            setUsedFallback(true);
            setLoaded(false);
            setSrc(workScreenshotSrc(id));
            return;
          }
          if (!usedFallback) {
            setUsedFallback(true);
            setLoaded(false);
            setSrc(workScreenshotFallback(url));
          }
        }}
      />
    </div>
  );
}
