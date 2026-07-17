import { SITE, TWEETS, type TweetItem } from "@/data/site";
import { fetchRss } from "@/lib/rss";

const DEFAULT_HANDLE = "PanchamKhaitan";

function handle(): string {
    return (
        process.env.X_HANDLE?.replace(/^@/, "").trim() ||
        SITE.handle.replace(/^@/, "") ||
        DEFAULT_HANDLE
    );
}

function rssCandidates(): string[] {
    const custom = process.env.TWEETS_RSS_URL?.trim();
    if (custom) {
        return [custom];
    }
    const h = handle();
    // Public bridges (first success wins). Override with TWEETS_RSS_URL if needed.
    return [
        `https://nitter.net/${h}/rss`,
        `https://nitter.poast.org/${h}/rss`,
    ];
}

function toXStatusUrl(id: string): string {
    return `https://x.com/${handle()}/status/${id}`;
}

function extractStatusId(guid: string, link: string): string {
    const fromGuid = guid.match(/(\d{10,})/)?.[1];
    if (fromGuid) {
        return fromGuid;
    }
    const fromLink = link.match(/status\/(\d+)/)?.[1];
    return fromLink || guid;
}

function formatDate(pubDate: string): string {
    const d = new Date(pubDate);
    if (Number.isNaN(d.getTime())) {
        return pubDate.slice(0, 10);
    }
    return d.toISOString().slice(0, 10);
}

function mapRssItems(
    items: Awaited<ReturnType<typeof fetchRss>>,
): TweetItem[] {
    const out: TweetItem[] = [];
    for (const item of items) {
        const id = extractStatusId(item.guid, item.link);
        // Prefer full title (nitter puts tweet text there); skip pure "Image"
        let text =
            item.title && item.title !== "Image"
                ? item.title
                : item.description.replace(/\s+/g, " ").trim();
        // Image-only posts: keep a short label
        if (!text || text === "Image") {
            text = item.image ? "Photo" : "";
        }
        if (!text) {
            continue;
        }
        out.push({
            id,
            date: formatDate(item.pubDate),
            text,
            href: toXStatusUrl(id),
            image: item.image ?? null,
        });
        if (out.length >= 30) {
            break;
        }
    }
    return out;
}

async function fromRss(): Promise<TweetItem[]> {
    const errors: string[] = [];
    for (const url of rssCandidates()) {
        try {
            const items = await fetchRss(url, {
                next: { revalidate: 1800 },
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
            });
            const mapped = mapRssItems(items);
            if (mapped.length > 0) {
                return mapped;
            }
            errors.push(`${url}: empty`);
        } catch (err) {
            errors.push(
                `${url}: ${err instanceof Error ? err.message : String(err)}`,
            );
        }
    }
    throw new Error(`All tweet RSS sources failed: ${errors.join("; ")}`);
}

/**
 * Official X API v2 user timeline (optional).
 * Needs TWITTER_BEARER_TOKEN in env.
 * Note: media requires expansions; without them image is null.
 */
async function fromOfficialApi(): Promise<TweetItem[] | null> {
    const token = process.env.TWITTER_BEARER_TOKEN?.trim();
    if (!token) {
        return null;
    }

    const userRes = await fetch(
        `https://api.twitter.com/2/users/by/username/${handle()}?user.fields=id`,
        {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 3600 },
        },
    );
    if (!userRes.ok) {
        throw new Error(`X user lookup failed: ${userRes.status}`);
    }
    const userJson = (await userRes.json()) as { data?: { id: string } };
    const userId = userJson.data?.id;
    if (!userId) {
        throw new Error("X user id missing");
    }

    const tweetsRes = await fetch(
        `https://api.twitter.com/2/users/${userId}/tweets?max_results=20&tweet.fields=created_at,text,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url,type&exclude=replies,retweets`,
        {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 1800 },
        },
    );
    if (!tweetsRes.ok) {
        throw new Error(`X tweets failed: ${tweetsRes.status}`);
    }
    const tweetsJson = (await tweetsRes.json()) as {
        data?: {
            id: string;
            text: string;
            created_at?: string;
            attachments?: { media_keys?: string[] };
        }[];
        includes?: {
            media?: {
                media_key: string;
                type: string;
                url?: string;
                preview_image_url?: string;
            }[];
        };
    };

    const mediaByKey = new Map(
        (tweetsJson.includes?.media ?? []).map((m) => [m.media_key, m]),
    );

    return (tweetsJson.data ?? []).map((t) => {
        const key = t.attachments?.media_keys?.[0];
        const media = key ? mediaByKey.get(key) : undefined;
        const image =
            media?.url || media?.preview_image_url || null;
        return {
            id: t.id,
            date: t.created_at
                ? t.created_at.slice(0, 10)
                : new Date().toISOString().slice(0, 10),
            text: t.text,
            href: toXStatusUrl(t.id),
            image,
        };
    });
}

/**
 * Live tweets when possible; curated list as fallback.
 *
 * Reliability order:
 * 1. Official X API v2 — set TWITTER_BEARER_TOKEN (recommended for production)
 * 2. Public RSS bridges (Nitter) — fragile; override with TWEETS_RSS_URL
 * 3. Curated TWEETS in src/data/site.ts
 */
export async function getTweets(): Promise<{
    tweets: TweetItem[];
    source: "api" | "rss" | "curated";
}> {
    try {
        const api = await fromOfficialApi();
        if (api && api.length > 0) {
            return { tweets: api, source: "api" };
        }
    } catch (err) {
        console.warn("[tweets] official API failed:", err);
    }

    try {
        const rss = await fromRss();
        if (rss.length > 0) {
            return { tweets: rss, source: "rss" };
        }
    } catch (err) {
        console.warn("[tweets] RSS failed:", err);
    }

    return { tweets: [...TWEETS], source: "curated" };
}
