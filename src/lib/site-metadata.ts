import type { Metadata } from 'next';

/**
 * The absolute origin used for canonical, Open Graph and sitemap URLs.
 *
 * 1. `SITE_URL`, when set, always wins (the approved public domain).
 * 2. On Vercel, production builds use the project's production domain and
 *    preview builds use their own deployment URL, so shared preview links
 *    unfurl with working images.
 * 3. Otherwise the legacy ChatGPT Sites preview address is used, which keeps
 *    that deployment working until hosting is cut over.
 */
function resolveSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  const vercelHost =
    process.env.VERCEL_ENV === 'production'
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL;
  if (vercelHost) return `https://${vercelHost}`;
  return 'https://lakshya-technology-preview.yoganathkopur.chatgpt.site';
}

export const siteUrl = new URL(resolveSiteUrl());
export const allowIndexing = process.env.SITE_INDEXABLE === 'true';

const previewHost = /\.(chatgpt\.site|vercel\.app|pages\.dev)$/;
if (
  allowIndexing &&
  (!process.env.SITE_URL || previewHost.test(siteUrl.hostname))
) {
  throw new Error(
    'Set SITE_URL to the approved public domain before enabling indexing.',
  );
}
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = new URL(path, siteUrl);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: 'Lakshya Software Technologies',
      title,
      description,
      url,
      images: [
        {
          url: new URL('/hero-connected-earth-v2.webp', siteUrl).href,
          width: 1672,
          height: 941,
          alt: 'Connected possibilities at Lakshya',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [new URL('/hero-connected-earth-v2.webp', siteUrl).href],
    },
  };
}
