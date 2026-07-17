import Image from "next/image";
import Link from "next/link";
import {
    FEATURED_MUSIC,
    FEATURED_PROJECT,
    NOW,
    PHOTOS,
    SITE,
} from "@/data/site";
import { getFormattedDate } from "@/lib/formatDate";

export const revalidate = 1800;

export default async function Home() {
    const nowUpdated = getFormattedDate(NOW.updated);

    return (
        <div className="index">
            <header className="page-header index-hero">
                <div className="index-hero__grid">
                    <div className="index-hero__copy">
                        <h1 className="index-title">
                            <span className="index-title__line">
                                {SITE.name}
                            </span>
                        </h1>
                        <p className="index-meta">
                            <span>{SITE.title}</span>
                            <span>
                                at{" "}
                                <a
                                    href={SITE.orgHref}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {SITE.org}
                                </a>
                            </span>
                            <span>{SITE.location}</span>
                        </p>
                        <p className="index-lede">{SITE.tagline}</p>
                        <p className="index-lede index-lede--secondary">
                            {SITE.workLine}
                        </p>
                    </div>
                    <figure className="index-hero__photo">
                        <Image
                            src={PHOTOS.cover.src}
                            alt={PHOTOS.cover.alt}
                            width={PHOTOS.cover.width}
                            height={PHOTOS.cover.height}
                            className="index-hero__img"
                            sizes="(max-width: 639px) 13.5rem, 13.5rem"
                            priority
                        />
                    </figure>
                </div>
            </header>

            <section
                className="index-focus"
                aria-labelledby="index-focus-label"
            >
                <h2 id="index-focus-label" className="section-title">
                    Now
                </h2>
                {nowUpdated && (
                    <p className="index-focus__updated muted">
                        Updated {nowUpdated}
                    </p>
                )}
                <ul className="row-list now-focus-list">
                    {NOW.items.map((item) => (
                        <li key={item}>
                            <p
                                className="index-focus__text"
                                style={{ margin: 0 }}
                            >
                                {item}
                            </p>
                        </li>
                    ))}
                </ul>
                <p className="row-extra">
                    <Link href="/now" className="see-more-link">
                        Log →
                    </Link>
                </p>
            </section>

            <section
                className="section"
                aria-labelledby="index-pick-label"
            >
                <h2 id="index-pick-label" className="section-title">
                    A few things
                </h2>
                <ul className="row-list">
                    <li>
                        <Link href="/work/helios" className="row-link">
                            <div className="row-top">
                                <span className="row-title">Helios</span>
                                <span className="row-meta">Work</span>
                            </div>
                            <p className="row-desc">
                                Managed SingleStore — data loading, Command+K,
                                the product customers live in.
                            </p>
                        </Link>
                    </li>
                    <li>
                        <a
                            href={FEATURED_PROJECT.href}
                            target="_blank"
                            rel="noreferrer"
                            className="row-link"
                        >
                            <div className="row-top">
                                <span className="row-title">Steno ↗</span>
                                <span className="row-meta">Side project</span>
                            </div>
                            <p className="row-desc">
                                Local Mac dictation. Honestly made me more
                                productive. Private, hold-to-talk.
                            </p>
                        </a>
                    </li>
                    <li>
                        <a
                            href={FEATURED_MUSIC.href}
                            target="_blank"
                            rel="noreferrer"
                            className="row-link"
                        >
                            <div className="row-top">
                                <span className="row-title">
                                    {FEATURED_MUSIC.title} ↗
                                </span>
                                <span className="row-meta">Music</span>
                            </div>
                            <p className="row-desc">{FEATURED_MUSIC.blurb}</p>
                        </a>
                    </li>
                </ul>
                <p className="row-extra" style={{ marginTop: "0.75rem" }}>
                    <Link href="/work" className="see-more-link">
                        Work →
                    </Link>
                    {" · "}
                    <Link href="/projects" className="see-more-link">
                        Projects →
                    </Link>
                    {" · "}
                    <Link href="/blog" className="see-more-link">
                        Blog →
                    </Link>
                </p>
            </section>

            <section
                className="section index-hello"
                aria-labelledby="index-hello-label"
            >
                <h2 id="index-hello-label" className="section-title">
                    Say hi
                </h2>
                <p className="index-hello__text">
                    Software, music, photos, random ideas —{" "}
                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                    {" · "}
                    <Link href="/contact">Contact</Link>
                </p>
            </section>
        </div>
    );
}
