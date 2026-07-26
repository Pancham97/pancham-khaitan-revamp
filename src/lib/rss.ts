/**
 * Minimal RSS 2.0 helpers. No extra dependency.
 * Good enough for Substack + Nitter-style feeds.
 */

export type RssItem = {
    title: string;
    link: string;
    description: string;
    descriptionHtml: string;
    /** Full post HTML when the source feed provides content:encoded */
    contentHtml: string;
    pubDate: string;
    guid: string;
    image?: string | null;
};

function decodeEntities(input: string): string {
    return input
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, "&");
}

function stripHtml(input: string): string {
    return decodeEntities(input)
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function tagContent(block: string, tag: string): string {
    const cdata = block.match(
        new RegExp(
            `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`,
            "i",
        ),
    );
    if (cdata?.[1] !== undefined) {
        return cdata[1].trim();
    }
    const plain = block.match(
        new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
    );
    return plain?.[1]?.trim() ?? "";
}

/** Prefer real media hosts over flaky proxy URLs when possible. */
export function normalizeMediaUrl(src: string): string {
    const raw = decodeEntities(src).trim();
    if (!raw) {
        return raw;
    }

    // nitter.net/pic/media%2FNAME.ext → pbs.twimg.com/media/NAME.ext
    const nitterMedia = raw.match(
        /nitter\.[^/]+\/pic\/(?:orig\/)?media%2F([^?\s"']+)/i,
    );
    if (nitterMedia?.[1]) {
        const file = decodeURIComponent(nitterMedia[1]);
        return `https://pbs.twimg.com/media/${file}`;
    }

    // nitter path form without encoding
    const nitterPlain = raw.match(
        /nitter\.[^/]+\/pic\/(?:orig\/)?media\/([^?\s"']+)/i,
    );
    if (nitterPlain?.[1]) {
        return `https://pbs.twimg.com/media/${nitterPlain[1]}`;
    }

    return raw;
}

function extractImageFromHtml(html: string): string | null {
    const decoded = decodeEntities(html);
    const img = decoded.match(
        /<img[^>]+src=["']([^"']+)["'][^>]*>/i,
    );
    if (img?.[1]) {
        return normalizeMediaUrl(img[1]);
    }
    return null;
}

function extractEnclosure(block: string): string | null {
    const enc = block.match(
        /<enclosure[^>]+url=["']([^"']+)["'][^>]*>/i,
    );
    if (!enc?.[1]) {
        return null;
    }
    const url = decodeEntities(enc[1]);
    // Images only; skip audio/video enclosures for the row thumb
    if (/\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(url) || url.includes("image")) {
        return normalizeMediaUrl(url);
    }
    if (/type=["']image\//i.test(enc[0])) {
        return normalizeMediaUrl(url);
    }
    return null;
}

export function parseRssItems(xml: string): RssItem[] {
    const items: RssItem[] = [];
    const re = /<item>([\s\S]*?)<\/item>/gi;
    let match: RegExpExecArray | null;
    while ((match = re.exec(xml)) !== null) {
        const block = match[1];
        const title = decodeEntities(tagContent(block, "title"));
        const link = decodeEntities(tagContent(block, "link"));
        const descriptionHtml = tagContent(block, "description");
        const contentEncoded = tagContent(block, "content:encoded");
        const description = stripHtml(descriptionHtml || contentEncoded);
        const pubDate = tagContent(block, "pubDate");
        const guidRaw = tagContent(block, "guid") || link;
        const guid = decodeEntities(guidRaw);
        if (!title && !description) {
            continue;
        }

        const image =
            extractEnclosure(block) ||
            extractImageFromHtml(descriptionHtml) ||
            extractImageFromHtml(contentEncoded);

        items.push({
            title: title || description.slice(0, 120),
            link,
            description: description || title,
            descriptionHtml,
            contentHtml: contentEncoded || descriptionHtml,
            pubDate,
            guid,
            image,
        });
    }
    return items;
}

export async function fetchRss(
    url: string,
    init?: RequestInit,
): Promise<RssItem[]> {
    const response = await fetch(url, {
        ...init,
        headers: {
            // Browser-like UA: some RSS bridges (Nitter) return empty bodies otherwise
            Accept: "application/rss+xml, application/xml, text/xml, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent":
                "Mozilla/5.0 (compatible; panchamkhaitan.com/1.0; +https://panchamkhaitan.com)",
            ...init?.headers,
        },
        redirect: "follow",
        // Next.js fetch cache; callers can pass next: { revalidate }
        next: init?.next ?? { revalidate: 3600 },
    });

    if (!response.ok) {
        throw new Error(`RSS fetch failed (${response.status}) for ${url}`);
    }

    const xml = await response.text();
    return parseRssItems(xml);
}
