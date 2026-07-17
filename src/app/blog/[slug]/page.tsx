import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getAllBlogs } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Add revalidation for ISR
export const revalidate = 3600; // Cache for 1 hour

// Generate static params for all blog posts
export async function generateStaticParams() {
    const posts = await getAllBlogs();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);

    if (!post) {
        return {
            title: "Blog Post Not Found",
        };
    }

    const ogImageUrl = `https://panchamkhaitan.com/api/og?title=${encodeURIComponent(post.title)}`;

    return {
        title: post.title,
        description: `${post.blogDescription} | Pancham Khaitan's work`,
        openGraph: {
            title: post.title,
            description: `${post.blogDescription} | Pancham Khaitan's work`,
            images: [ogImageUrl],
            url: `https://panchamkhaitan.com/blog/${post.slug}`,
        },
        twitter: {
            title: post.title,
            description: `${post.blogDescription} | Pancham Khaitan's work`,
            images: [ogImageUrl],
            card: "summary_large_image",
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <article>
            <header className="page-header">
                <h1 className="page-title">{post.title}</h1>
                <p className="page-lede">
                    {getFormattedDate(post.createdAt)} · {post.timeToRead}
                </p>
                {post.tags && post.tags.length > 0 && (
                    <p className="row-extra muted" style={{ marginTop: "0.75rem" }}>
                        {post.tags.map((tag, index) => (
                            <span key={tag}>
                                {index > 0 ? " · " : ""}
                                <a href={`/blog/tags/${tag}`}>{tag}</a>
                            </span>
                        ))}
                    </p>
                )}
            </header>

            <MarkdownRenderer content={post.content} className="prose" />
        </article>
    );
}
