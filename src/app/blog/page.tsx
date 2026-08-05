import { Metadata } from "next";
import Link from "next/link";
import { getFormattedDate } from "@/lib/formatDate";
import { getAllBlogs } from "@/lib/server-queries";
import PageBridge from "@/components/PageBridge";

export const metadata: Metadata = {
    title: "Blog",
    description: "Writing by Pancham Khaitan.",
    openGraph: {
        title: "Blog",
        description: "Writing by Pancham Khaitan.",
        url: "https://panchamkhaitan.com/blog",
    },
};

export default async function BlogPage() {
    const posts = await getAllBlogs();
    const groups = posts.reduce<Record<string, typeof posts>>((acc, p) => {
        const year = new Date(p.createdAt).getFullYear().toString();
        (acc[year] ||= []).push(p);
        return acc;
    }, {});
    const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a));

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Blog</h1>
                <p className="page-lede">Writing archive — newest first.</p>
            </header>

            {years.map((year) => (
                <section key={year} className="section-block">
                    <div className="year-label">{year}</div>
                    <ul className="row-list">
                        {groups[year].map((post) => {
                            const body = (
                                <div className="media-row media-row--in-list">
                                    <div className="media-row__body">
                                        <div className="row-top">
                                            <span className="row-title">
                                                {post.title}
                                            </span>
                                            <time className="row-meta">
                                                {getFormattedDate(
                                                    post.createdAt,
                                                )}
                                            </time>
                                        </div>
                                        {post.blogDescription && (
                                            <p className="row-desc">
                                                {post.blogDescription}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );

                            return (
                                <li key={post._id}>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="row-link"
                                        prefetch
                                    >
                                        {body}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}

            {posts.length === 0 && <p className="muted">No posts yet.</p>}

            <PageBridge
                links={[
                    { href: "/now", label: "Now" },
                    { href: "/notes", label: "Notes" },
                    { href: "/about", label: "About" },
                ]}
            />
        </div>
    );
}
