'use client';

import { useEffect, useRef, useState } from 'react';

export function IndustryVideo({ asset }: { asset: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMotion(!media.matches);
    update();
    media.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (container.current) observer.observe(container.current);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', update);
    };
  }, []);

  return (
    <div className="industry-video" ref={container} aria-hidden="true">
      {visible && motion ? (
        <video
          src={asset + '.mp4'}
          poster={asset + '.webp'}
          muted
          autoPlay
          loop
          playsInline
        />
      ) : (
        <img
          src={asset + '.webp'}
          alt=""
          width={640}
          height={360}
          loading="lazy"
        />
      )}
    </div>
  );
}
