import { Metadata } from "next";
import Link from "next/link";
import { getAllBlogs, getBlogsByTag } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";
import PageBridge from "@/components/PageBridge";

interface PageProps {
    params: Promise<{
        tag: string;
    }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    return {
        title: `Tag: ${decodedTag}`,
        description: `Blog posts tagged “${decodedTag}”.`,
    };
}

export const dynamicParams = false;

export async function generateStaticParams() {
    const posts = await getAllBlogs();
    const tags = new Set(posts.flatMap((post) => post.tags));

    return Array.from(tags).map((tag) => ({ tag }));
}

export default async function BlogTagPage({ params }: PageProps) {
    const { tag } = await params;
    const blogPosts = await getBlogsByTag(tag);
    const decodedTag = decodeURIComponent(tag);

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">#{decodedTag}</h1>
                <p className="page-lede">
                    {blogPosts.length > 0
                        ? `Posts tagged “${decodedTag}”.`
                        : `No posts with the tag “${decodedTag}” yet.`}
                </p>
            </header>

            {blogPosts.length > 0 ? (
                <ul className="row-list">
                    {blogPosts.map((post) => (
                        <li key={post._id}>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="row-link"
                            >
                                <div className="row-top">
                                    <span className="row-title">
                                        {post.title}
                                    </span>
                                    <time className="row-meta">
                                        {getFormattedDate(post.createdAt)}
                                    </time>
                                </div>
                                {post.blogDescription && (
                                    <p className="row-desc">
                                        {post.blogDescription}
                                    </p>
                                )}
                                {post.timeToRead && (
                                    <p className="row-extra muted">
                                        {post.timeToRead}
                                    </p>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="muted">
                    Try the{" "}
                    <Link href="/blog" className="see-more-link">
                        full blog archive →
                    </Link>
                </p>
            )}

            <PageBridge
                links={[
                    { href: "/blog", label: "All posts" },
                    { href: "/now", label: "Now" },
                    { href: "/", label: "Home" },
                ]}
            />
        </div>
    );
}
