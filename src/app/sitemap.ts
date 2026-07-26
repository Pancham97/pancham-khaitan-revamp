import type { MetadataRoute } from "next";
import { getAllBlogs, getAllNotes, getAllWork } from "@/lib/server-queries";
import { SECONDARY_SECTIONS, SECTIONS } from "@/data/site";

const SITE_URL = "https://panchamkhaitan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [blogs, work, notes] = await Promise.all([
        getAllBlogs(),
        getAllWork(),
        getAllNotes(),
    ]);

    const allSections = [...SECTIONS, ...SECONDARY_SECTIONS];

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        ...allSections.map((section) => ({
            url: `${SITE_URL}${section.href}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority:
                section.href === "/work" || section.href === "/blog"
                    ? 0.9
                    : 0.7,
        })),
    ];

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt
            ? new Date(post.updatedAt)
            : new Date(post.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    const workRoutes: MetadataRoute.Sitemap = work
        .filter((w) => !w.isHidden)
        .map((item) => ({
            url: `${SITE_URL}/work/${item.slug}`,
            lastModified: item.createdAt
                ? new Date(item.createdAt)
                : new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.75,
        }));

    const noteRoutes: MetadataRoute.Sitemap = notes
        .filter((n) => !n.isExternal)
        .map((note) => ({
            url: `${SITE_URL}/notes/${note.slug}`,
            lastModified: note.updatedAt
                ? new Date(note.updatedAt)
                : new Date(note.createdAt),
            changeFrequency: "monthly" as const,
            priority: 0.5,
        }));

    return [...staticRoutes, ...blogRoutes, ...workRoutes, ...noteRoutes];
}
