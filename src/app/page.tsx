import Link from "next/link";
import {
    getFeaturedWork,
    getAllBlogs,
    getLatestUpdates,
} from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";

export const revalidate = 1800;

export default async function Home() {
    const [featured, blogs, updates] = await Promise.all([
        getFeaturedWork(),
        getAllBlogs(),
        getLatestUpdates(3),
    ]);

    const latestBlogs = blogs.slice(0, 5);

    return (
        <div className="home">
            <section className="hero">
                <div className="mx-auto max-w-3xl">
                    <h1 className="big-headline-text">Hello, I’m Pancham.</h1>
                    <p
                        className={`
                          max-w-2xl text-neutral-700
                          dark:text-neutral-600
                          measure lede
                        `}
                    >
                        I design and build software. I enjoy systems that feel
                        fast, simple, and thoughtfully made — and I sing for
                        joy. Below is a quick selection of my work and recent
                        writing.
                    </p>
                </div>
            </section>

            {updates.length > 0 && (
                <section className="mt-10">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="headline-text mb-4">Latest</h2>
                        <ul className="space-y-3">
                            {updates.map((u) => (
                                <li
                                    key={u._id}
                                    className={`
                                      border-b-1 border-neutral-200/50
                                      dark:border-neutral-950/25
                                      pb-3
                                    `}
                                >
                                    <div
                                        className={`
                                          flex items-baseline justify-between
                                          gap-4
                                        `}
                                    >
                                        <div
                                            className={`
                                              text-base font-semibold flex
                                              items-center gap-2
                                            `}
                                        >
                                            {u.title}
                                        </div>
                                        <time
                                            className={`
                                              text-sm text-neutral-500
                                              dark:text-neutral-400
                                              whitespace-nowrap
                                            `}
                                        >
                                            {getFormattedDate(u.createdAt)}
                                        </time>
                                    </div>
                                    {u.snippet && (
                                        <p
                                            className={`
                                              text-sm text-neutral-600
                                              dark:text-neutral-600
                                              mt-1 measure
                                            `}
                                        >
                                            {u.snippet}
                                        </p>
                                    )}
                                    {u.linkUrl && (
                                        <div className="mt-1 text-sm">
                                            <a
                                                href={u.linkUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="see-more-link"
                                            >
                                                {u.linkLabel || "Open"} →
                                            </a>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4">
                            <Link href="/updates" className="see-more-link">
                                All updates →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            <section className="mt-10">
                <div
                    className={`
                      mx-auto max-w-3xl grid gap-12
                      md:grid-cols-2
                    `}
                >
                    <div>
                        <h2 className="headline-text mb-4">Work</h2>
                        <ul className="space-y-3">
                            {featured.map((w) => (
                                <li
                                    key={w.slug}
                                    className={`
                                      border-b-1 border-neutral-200/50
                                      dark:border-neutral-950/25
                                      pb-3
                                    `}
                                >
                                    <Link
                                        href={`/work/${w.slug}`}
                                        className={`
                                          no-underline
                                          hover:underline
                                        `}
                                    >
                                        <div className="text-base font-semibold">
                                            {w.title}
                                        </div>
                                        {w.shortDescription && (
                                            <div
                                                className={`
                                                  text-sm text-neutral-600
                                                  dark:text-neutral-600
                                                `}
                                            >
                                                {w.shortDescription}
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4">
                            <Link href="/work" className="see-more-link">
                                All work →
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h2 className="headline-text mb-4">Blog</h2>
                        <ul className="space-y-3">
                            {latestBlogs.map((b) => (
                                <li
                                    key={b.slug}
                                    className={`
                                      border-b-1 border-neutral-200/50
                                      dark:border-neutral-950/25
                                      pb-3
                                    `}
                                >
                                    <Link
                                        href={`/blog/${b.slug}`}
                                        className={`
                                          no-underline
                                          hover:underline
                                        `}
                                    >
                                        <div className="text-base font-semibold">
                                            {b.title}
                                        </div>
                                        <div
                                            className={`
                                              text-sm text-neutral-600
                                              dark:text-neutral-600
                                            `}
                                        >
                                            {getFormattedDate(b.createdAt)}
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4">
                            <Link href="/blog" className="see-more-link">
                                All posts →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
