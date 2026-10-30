import type { MetadataRoute } from 'next';
import { allowIndexing, siteUrl } from '@/lib/site-metadata';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  return allowIndexing
    ? {
        rules: { userAgent: '*', allow: '/' },
        sitemap: new URL('/sitemap.xml', siteUrl).href,
      }
    : { rules: { userAgent: '*', disallow: '/' } };
}
