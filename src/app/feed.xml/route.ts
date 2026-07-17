import { getAllWriting } from "@/lib/writing";

const SITE_URL = "https://panchamkhaitan.com";

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export const revalidate = 3600;

export async function GET() {
    const posts = await getAllWriting();

    const items = posts
        .slice(0, 40)
        .map((post) => {
            const link = post.external
                ? post.href
                : `${SITE_URL}${post.href.startsWith("/") ? post.href : `/${post.href}`}`;
            const pub = new Date(post.createdAt).toUTCString();
            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pub}</pubDate>
      <description>${escapeXml(post.description || post.title)}</description>
      <category>${post.source === "substack" ? "Substack" : "Blog"}</category>
    </item>`;
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pancham Khaitan</title>
    <link>${SITE_URL}</link>
    <description>Writing on engineering, tools, craft, and life — including The Curious Coder on Substack.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        },
    });
}
