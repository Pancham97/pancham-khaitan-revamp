import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getAllBlogs } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";
import BreadcrumbTitle from "@/components/BreadcrumbTitle";
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
        title: `${post.title} | Blog`,
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
            <BreadcrumbTitle title={post.title} />
            <h1 className="big-headline-text">{post.title}</h1>
            <p
                className={`
                  text-neutral-600
                  dark:text-neutral-400
                  mb-6 text-sm
                `}
            >
                {getFormattedDate(post.createdAt)} • Time to read:{" "}
                {post.timeToRead}
            </p>

            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                        <a
                            key={index}
                            href={`/blog/tags/${tag}`}
                            className={`
                              inline-block px-2 py-0.5 text-xs border
                              border-neutral-200
                              dark:border-neutral-800
                              rounded text-neutral-600
                              dark:text-neutral-400
                              hover:bg-neutral-100
                              dark:hover:bg-white/10
                              transition-colors no-underline
                            `}
                        >
                            {tag}
                        </a>
                    ))}
                </div>
            )}

            <MarkdownRenderer
                content={post.content}
                className={`
                  prose max-w-none
                  dark:prose-invert
                  text-black
                  dark:text-white
                `}
            />
        </article>
    );
}
