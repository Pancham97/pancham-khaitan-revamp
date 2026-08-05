import { marked } from "marked";
import { getAllBlogs } from "@/lib/server-queries";

export type WritingItem = {
    id: string;
    title: string;
    description: string;
    href: string;
    createdAt: string;
    tags: string[];
    bodyHtml?: string;
};

export type GetAllWritingOptions = {
    /** Render full HTML bodies for feed consumers. */
    includeBody?: boolean;
};

const SITE_URL = "https://panchamkhaitan.com";

/** Make root-relative URLs absolute so feed readers can resolve media/links. */
function absolutizeHtml(html: string): string {
    return html
        .replace(
            /(\s(?:href|src))="(\/[^"]*)"/gi,
            (_match, attribute: string, path: string) =>
                `${attribute}="${SITE_URL}${path}"`,
        )
        .replace(
            /(\s(?:href|src))='(\/[^']*)'/gi,
            (_match, attribute: string, path: string) =>
                `${attribute}='${SITE_URL}${path}'`,
        );
}

async function markdownToHtml(markdown: string): Promise<string> {
    const html = await marked.parse(markdown, {
        gfm: true,
        breaks: false,
    });

    return absolutizeHtml(typeof html === "string" ? html : String(html));
}

/** Local Markdown posts, newest first. */
export async function getAllWriting(
    options: GetAllWritingOptions = {},
): Promise<WritingItem[]> {
    const includeBody = Boolean(options.includeBody);
    const blogs = await getAllBlogs();

    return Promise.all(
        blogs.map(async (blog) => ({
            id: `site:${blog.slug}`,
            title: blog.title,
            description: blog.blogDescription,
            href: `/blog/${blog.slug}`,
            createdAt: blog.createdAt,
            tags: blog.tags,
            bodyHtml:
                includeBody && blog.content
                    ? await markdownToHtml(blog.content)
                    : undefined,
        })),
    );
}
