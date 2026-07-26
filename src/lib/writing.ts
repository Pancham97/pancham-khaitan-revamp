import { marked } from "marked";
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
    /**
     * Full post HTML for RSS readers. Only set when
     * getAllWriting({ includeBody: true }) is requested.
     */
    bodyHtml?: string;
};

export type GetAllWritingOptions = {
    /**
     * When true, render full HTML bodies for feed consumers.
     * Default false — list pages and search only need title/description.
     */
    includeBody?: boolean;
};

const SITE_URL = "https://panchamkhaitan.com";
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

/** Make root-relative URLs absolute so feed readers can resolve media/links. */
function absolutizeHtml(html: string, base = SITE_URL): string {
    return html
        .replace(
            /(\s(?:href|src))="(\/[^"]*)"/gi,
            (_m, attr: string, path: string) => `${attr}="${base}${path}"`,
        )
        .replace(
            /(\s(?:href|src))='(\/[^']*)'/gi,
            (_m, attr: string, path: string) => `${attr}='${base}${path}'`,
        );
}

async function markdownToHtml(markdown: string): Promise<string> {
    const html = await marked.parse(markdown, {
        gfm: true,
        breaks: false,
    });
    return absolutizeHtml(typeof html === "string" ? html : String(html));
}

async function getSubstackPosts(
    includeBody: boolean,
): Promise<WritingItem[]> {
    const items = await fetchRss(substackFeedUrl(), {
        next: { revalidate: 3600 },
    });

    return items
        .filter((item) => !stripComingSoon(item.title))
        .map((item) => {
            const created = item.pubDate
                ? new Date(item.pubDate).toISOString()
                : new Date().toISOString();
            const bodyHtml = includeBody
                ? item.contentHtml || item.descriptionHtml || ""
                : "";
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
                bodyHtml: bodyHtml || undefined,
            };
        });
}

async function getLocalPosts(includeBody: boolean): Promise<WritingItem[]> {
    const blogs = await getAllBlogs();

    if (!includeBody) {
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

    return Promise.all(
        blogs.map(async (b) => ({
            id: `site:${b.slug}`,
            title: b.title,
            description: b.blogDescription,
            href: `/blog/${b.slug}`,
            createdAt: b.createdAt,
            source: "site" as const,
            external: false,
            tags: b.tags,
            image: null,
            bodyHtml: b.content
                ? await markdownToHtml(b.content)
                : undefined,
        })),
    );
}

/**
 * Local markdown posts + Substack RSS, newest first.
 * Dedupe by normalized title when Substack mirrors a local post.
 *
 * Pass `{ includeBody: true }` only for RSS (and similar) so list/search
 * do not pay for full markdown → HTML conversion.
 */
export async function getAllWriting(
    options: GetAllWritingOptions = {},
): Promise<WritingItem[]> {
    const includeBody = Boolean(options.includeBody);
    const local = await getLocalPosts(includeBody);

    let remote: WritingItem[] = [];
    try {
        remote = await getSubstackPosts(includeBody);
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
