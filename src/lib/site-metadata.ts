import type { Metadata } from 'next';
export const siteUrl = new URL(
  process.env.SITE_URL ||
    'https://lakshya-technology-preview.loyalkite22.chatgpt.site',
);
export const allowIndexing = process.env.SITE_INDEXABLE === 'true';
if (
  allowIndexing &&
  (!process.env.SITE_URL || siteUrl.hostname.endsWith('.chatgpt.site'))
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
