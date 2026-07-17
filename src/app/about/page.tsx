import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
    CREDENTIALS,
    INSTAGRAM,
    SITE,
    TRAVEL_PHOTOS,
} from "@/data/site";

export const metadata: Metadata = {
    title: "About",
    description: `About ${SITE.name}. Software, classical music, photos, and whatever else I am into.`,
};

export default function AboutPage() {
    const [lead, ...rest] = TRAVEL_PHOTOS;

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">About</h1>
                <p className="page-lede">
                    Dog petter, cat chaser, code breaker. Also: singer, keys,
                    camera on walks.
                </p>
            </header>

            {/* Travel / life first — not the same cover as home */}
            <div className="about-photo-grid about-photo-grid--travel">
                <figure className="about-photo about-photo--lead">
                    <Image
                        src={lead.src}
                        alt={lead.alt}
                        width={960}
                        height={640}
                        className="about-photo__img about-photo__img--portrait"
                        sizes="(max-width: 640px) 100vw, 42rem"
                        priority
                    />
                </figure>
                {rest.map((photo) => (
                    <figure key={photo.src} className="about-photo">
                        <Image
                            src={photo.src}
                            alt={photo.alt}
                            width={960}
                            height={540}
                            className="about-photo__img"
                            sizes="(max-width: 640px) 100vw, 20rem"
                        />
                    </figure>
                ))}
            </div>

            <div className="prose-block">
                <p>
                    I grew up in Surat and studied Information Technology at
                    Birla Vishvakarma Mahavidyalaya. I like building things that
                    feel fast and simple. Calling people customers instead of
                    users actually changes how hard I try to make the experience
                    good.
                </p>
                <p>
                    These days I work at{" "}
                    <a
                        href={SITE.orgHref}
                        target="_blank"
                        rel="noreferrer"
                    >
                        SingleStore
                    </a>{" "}
                    on{" "}
                    <a
                        href={SITE.heliosHref}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Helios
                    </a>{" "}
                    and{" "}
                    <a
                        href={SITE.auraAnalystHref}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Aura Analyst
                    </a>
                    . Before that I was at Peak AI, and earlier I worked on
                    Google stuff through Cybage (Google for Startups, Glue).
                </p>
                <p>
                    Outside work I am in year three of a seven-year Hindustani
                    classical bachelor&apos;s. I practice on a Casio CTK-850IN,
                    take evening walks with a camera, and sometimes ship side
                    products like Steno because I wanted them myself. If you
                    want to chat,{" "}
                    <Link href="/contact">say hi</Link>.
                </p>
            </div>

            <section className="section" aria-labelledby="about-ig">
                <h2 id="about-ig" className="section-title">
                    Instagram
                </h2>
                <p className="row-desc" style={{ marginBottom: "0.75rem" }}>
                    More walks and places.{" "}
                    <a
                        href={INSTAGRAM.href}
                        target="_blank"
                        rel="noreferrer"
                        className="see-more-link"
                    >
                        {INSTAGRAM.handle} ↗
                    </a>
                </p>
                <div className="ig-embed">
                    <iframe
                        title="Instagram profile"
                        src="https://www.instagram.com/pancham.khaitan/embed"
                        loading="lazy"
                        className="ig-embed__frame"
                        allow="encrypted-media"
                    />
                </div>
            </section>

            <section className="section" aria-labelledby="about-creds">
                <h2 id="about-creds" className="section-title">
                    Study notes
                </h2>
                <p className="page-lede" style={{ marginBottom: "1rem" }}>
                    I took the certs seriously enough to write notes down.
                </p>
                <ul className="row-list">
                    {CREDENTIALS.map((c) => (
                        <li key={c.title}>
                            <a
                                href={c.href}
                                target="_blank"
                                rel="noreferrer"
                                className="row-link"
                            >
                                <span className="row-title">{c.title} ↗</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
