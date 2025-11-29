import { Metadata } from "next";
import Link from "next/link";
import { getBlogsByTag } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";

interface PageProps {
    params: Promise<{
        tag: string;
    }>;
}

export const metadata: Metadata = {
    title: "Blog | Pancham Khaitan",
    description:
        "Pancham Khaitan is a software engineer who likes making things. He is also fond of music.",
    openGraph: {
        title: "Pancham Khaitan",
        description:
            "Pancham Khaitan is a software engineer who likes making things. He is also fond of music.",
        images: [
            "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
        ],
        url: "https://panchamkhaitan.com",
    },
    twitter: {
        title: "Pancham Khaitan",
        description:
            "Pancham Khaitan is a software engineer who likes making things. He is also fond of music.",
        images: [
            "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
        ],
        card: "summary_large_image",
    },
};

// Add revalidation for ISR
export const revalidate = 60; // Cache for 60 seconds

export default async function BlogTagPage({ params }: PageProps) {
    const { tag } = await params;
    const blogPosts = await getBlogsByTag(tag);
    const decodedTag = decodeURIComponent(tag);

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-20">
                {blogPosts.length > 0 ? (
                    <>
                        <h1 className="text-4xl font-bold mb-8">
                            Blog posts containing tag &ldquo;{decodedTag}&rdquo;
                        </h1>

                        {/* Blog Posts */}
                        <div className="space-y-12">
                            {blogPosts.map((post) => (
                                <article
                                    key={post._id}
                                    className={`
                                      border-b-1 border-gray-200 pb-12
                                      last:border-b-0
                                    `}
                                >
                                    <h2 className="text-3xl font-bold mb-3">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className={`
                                              text-gray-900
                                              hover:underline
                                              transition-colors
                                            `}
                                        >
                                            {post.title}
                                        </Link>
                                    </h2>

                                    <p className="text-gray-600 mb-4 text-lg">
                                        {post.blogDescription}
                                    </p>

                                    <div className="text-sm text-gray-500 mb-4">
                                        {getFormattedDate(post.createdAt)} •
                                        Time to read: {post.timeToRead}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">
                            No blog posts containing tag &ldquo;{decodedTag}
                            &rdquo; ☹️
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Adding a custom tag won&apos;t magically make posts
                            appear. Please go back to{" "}
                            <Link href="/blog" className="hover:underline">
                                blog
                            </Link>
                            .
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
