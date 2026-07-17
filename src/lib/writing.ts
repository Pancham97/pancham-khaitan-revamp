import { getAllBlogs } from "@/lib/server-queries";
import { fetchRss } from "@/lib/rss";

export type WritingSource = "site" | "substack";

export type WritingItem = {
    id: string;
    title: string;
    description: string;
    href: string;
    createdAt: string;
    source: WritingSource;
    external: boolean;
    tags?: string[];
    image?: string | null;
};

const DEFAULT_SUBSTACK_FEED = "https://panchamk.substack.com/feed";

function substackFeedUrl(): string {
    return (
        process.env.SUBSTACK_FEED_URL?.trim() ||
        process.env.NEXT_PUBLIC_SUBSTACK_FEED_URL?.trim() ||
        DEFAULT_SUBSTACK_FEED
    );
}

function stripComingSoon(title: string): boolean {
    const t = title.trim().toLowerCase();
    return t === "coming soon" || t.startsWith("coming soon");
}

async function getSubstackPosts(): Promise<WritingItem[]> {
    const items = await fetchRss(substackFeedUrl(), {
        next: { revalidate: 3600 },
    });

    return items
        .filter((item) => !stripComingSoon(item.title))
        .map((item) => {
            const created = item.pubDate
                ? new Date(item.pubDate).toISOString()
                : new Date().toISOString();
            return {
                id: `substack:${item.guid || item.link}`,
                title: item.title,
                description: item.description.slice(0, 280),
                href: item.link,
                createdAt: created,
                source: "substack" as const,
                external: true,
                tags: ["substack"],
                image: item.image ?? null,
            };
        });
}

async function getLocalPosts(): Promise<WritingItem[]> {
    const blogs = await getAllBlogs();
    return blogs.map((b) => ({
        id: `site:${b.slug}`,
        title: b.title,
        description: b.blogDescription,
        href: `/blog/${b.slug}`,
        createdAt: b.createdAt,
        source: "site" as const,
        external: false,
        tags: b.tags,
        image: null,
    }));
}

/**
 * Local markdown posts + Substack RSS, newest first.
 * Dedupe by normalized title when Substack mirrors a local post.
 */
export async function getAllWriting(): Promise<WritingItem[]> {
    const local = await getLocalPosts();

    let remote: WritingItem[] = [];
    try {
        remote = await getSubstackPosts();
    } catch (err) {
        console.warn("[writing] Substack RSS failed:", err);
    }

    const localTitles = new Set(
        local.map((p) => p.title.trim().toLowerCase()),
    );

    const remoteUnique = remote.filter(
        (p) => !localTitles.has(p.title.trim().toLowerCase()),
    );

    return [...local, ...remoteUnique].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
