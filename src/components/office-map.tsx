'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

/**
 * The office map loads on demand behind a branded placeholder. The Google
 * iframe is only mounted as the panel approaches the viewport, so its load
 * event always reaches React and the rest of the page stays light. A pulse
 * marks the office while the tiles arrive, then the map opens outward from
 * that point. If the load event never arrives (blocked or slow third-party
 * content), the map is shown anyway after a short wait.
 */
export function OfficeMap({ src, title }: { src: string; title: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setNear(true);
      },
      { rootMargin: '300px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!near || loaded) return;
    const timer = window.setTimeout(() => setLoaded(true), 8000);
    return () => window.clearTimeout(timer);
  }, [near, loaded]);

  return (
    <div
      ref={frame}
      className="office-map-frame"
      data-loaded={loaded ? '' : undefined}
      aria-busy={!loaded}
    >
      {near ? (
        <iframe
          className="office-map"
          title={title}
          src={src}
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div className="office-map" />
      )}
      <div className="map-loader" aria-hidden="true">
        <span className="map-loader-grid" />
        <span className="map-loader-sweep" />
        <span className="map-loader-pin">
          <span className="map-loader-ring" />
          <span className="map-loader-ring" />
          <MapPin size={22} />
        </span>
        <span className="map-loader-label">Locating Madhapur office</span>
      </div>
    </div>
  );
}
