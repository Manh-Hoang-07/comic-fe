import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
    const currentDate = new Date();

    // Các trang tĩnh
    const routes = [
        '',
        '/about',
        '/comics',
        '/posts',
        '/projects',
        '/services',
        '/staff',
        '/contact',
        '/faqs',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return [...routes];
}


