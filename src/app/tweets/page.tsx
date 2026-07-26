import { Metadata } from "next";
import { SITE } from "@/data/site";
import { getTweets } from "@/lib/tweets";
import PageBridge from "@/components/PageBridge";

export const metadata: Metadata = {
    title: "Tweets",
    description: `Posts from ${SITE.handle}.`,
};

export const revalidate = 1800;

export default async function TweetsPage() {
    const { tweets } = await getTweets();

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Tweets</h1>
                <p className="page-lede">
                    Recent posts. Tools, walks, product thoughts, the
                    occasional mind-blown moment.
                </p>
            </header>

            {tweets.map((t) => (
                <article
                    key={t.id}
                    className={t.image ? "media-row has-media" : "media-row"}
                >
                    <div className="media-row__body">
                        <p className="media-row__text">{t.text}</p>
                        <div className="media-row__meta">
                            <time dateTime={t.date}>{t.date}</time>
                            <a href={t.href} target="_blank" rel="noreferrer">
                                Open ↗
                            </a>
                        </div>
                    </div>
                    {t.image && (
                        <a
                            href={t.href}
                            target="_blank"
                            rel="noreferrer"
                            className="media-row__media"
                            tabIndex={-1}
                            aria-hidden
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={t.image}
                                alt=""
                                loading="lazy"
                                decoding="async"
                            />
                        </a>
                    )}
                </article>
            ))}

            {tweets.length === 0 && <p className="muted">Nothing here yet.</p>}

            <PageBridge
                links={[
                    { href: "/blog", label: "Blog" },
                    { href: "/now", label: "Now" },
                    { href: "/about", label: "About" },
                ]}
            />
        </div>
    );
}
