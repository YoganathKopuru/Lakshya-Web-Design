import type { MetadataRoute } from 'next';
import { services } from '@/data/content';
import { siteUrl, allowIndexing } from '@/lib/site-metadata';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  if (!allowIndexing) return [];
  return [
    '/',
    '/services/',
    '/work/',
    '/industries/',
    '/company/',
    '/careers/',
    '/contact/',
    ...services.map((s) => `/services/${s.slug}/`),
  ].map((path) => ({ url: new URL(path, siteUrl).href }));
}
