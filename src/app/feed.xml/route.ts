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

/** CDATA must not contain an unescaped `]]>` sequence. */
function cdata(value: string): string {
    return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

export const dynamic = "force-static";

export async function GET() {
    const posts = await getAllWriting({ includeBody: true });

    const items = posts
        .slice(0, 40)
        .map((post) => {
            const link = `${SITE_URL}${post.href.startsWith("/") ? post.href : `/${post.href}`}`;
            const pub = new Date(post.createdAt).toUTCString();
            const summary = post.description || post.title;
            const body = post.bodyHtml?.trim();

            // Fall back to the summary if a local post has no body.
            const htmlBody = body ? body : `<p>${escapeXml(summary)}</p>`;
            const contentBlock = `      <content:encoded>${cdata(htmlBody)}</content:encoded>`;

            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pub}</pubDate>
      <description>${escapeXml(summary)}</description>
${contentBlock}
      <category>Blog</category>
    </item>`;
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Pancham Khaitan</title>
    <link>${SITE_URL}</link>
    <description>Writing on engineering, tools, craft, and life.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
        },
    });
}
