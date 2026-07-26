import { Metadata } from "next";
import Link from "next/link";
import { getFormattedDate } from "@/lib/formatDate";
import { getAllWriting } from "@/lib/writing";
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

export const revalidate = 3600;

export default async function BlogPage() {
    const posts = await getAllWriting();
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
                <p className="page-lede">
                    Writing archive — newest first.
                </p>
            </header>

            {years.map((year) => (
                <section key={year} className="section-block">
                    <div className="year-label">{year}</div>
                    <ul className="row-list">
                        {groups[year].map((post) => {
                            const body = (
                                <div
                                    className={
                                        post.image
                                            ? `
                                              media-row media-row--in-list
                                              has-media
                                            `
                                            : "media-row media-row--in-list"
                                    }
                                >
                                    <div className="media-row__body">
                                        <div className="row-top">
                                            <span className="row-title">
                                                {post.title}
                                                {post.external ? " ↗" : ""}
                                            </span>
                                            <time className="row-meta">
                                                {getFormattedDate(
                                                    post.createdAt,
                                                )}
                                            </time>
                                        </div>
                                        {post.description && (
                                            <p className="row-desc">
                                                {post.description}
                                            </p>
                                        )}
                                    </div>
                                    {post.image && (
                                        <span
                                            className="media-row__media"
                                            aria-hidden
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={post.image}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </span>
                                    )}
                                </div>
                            );

                            return (
                                <li key={post.id}>
                                    {post.external ? (
                                        <a
                                            href={post.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="row-link"
                                        >
                                            {body}
                                        </a>
                                    ) : (
                                        <Link
                                            href={post.href}
                                            className="row-link"
                                            prefetch
                                        >
                                            {body}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}

            {posts.length === 0 && <p className="muted">No posts yet.</p>}

            <PageBridge
                links={[
                    { href: "/tweets", label: "Tweets" },
                    { href: "/now", label: "Now" },
                    { href: "/about", label: "About" },
                ]}
            />
        </div>
    );
}
