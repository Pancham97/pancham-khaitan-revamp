import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { INSTAGRAM, SITE, TRAVEL_PHOTOS } from "@/data/site";
import PageBridge from "@/components/PageBridge";

export const metadata: Metadata = {
    title: "About",
    description: `About ${SITE.name}. Software, classical music, photos, and whatever else I am into.`,
    openGraph: {
        title: "About",
        description: `About ${SITE.name}. Software, classical music, photos, and whatever else I am into.`,
        url: "/about",
    },
};

export default function AboutPage() {
    const [lead, ...rest] = TRAVEL_PHOTOS;

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">About</h1>
                <p className="page-lede">
                    A little more context — work, music, walks.
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
                    feel fast and simple — products people are glad to come back
                    to.
                </p>
                <p>
                    Since September 2026 I have been a Software Engineering
                    Manager at{" "}
                    <a href={SITE.orgHref} target="_blank" rel="noreferrer">
                        SingleStore
                    </a>
                    , where I joined as an engineer in 2023 and worked on{" "}
                    <a href={SITE.heliosHref} target="_blank" rel="noreferrer">
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
                    . Before that I spent two years at Peak AI (2021 to 2023),
                    and three at Cybage (2018 to 2021) building Google for
                    Startups and Glue with Google Brand Studio.
                </p>
                <p>
                    Outside work I am in year three of a seven-year Hindustani
                    classical bachelor&apos;s. I practice on a Casio CTK-850IN,
                    and take evening walks with a camera. I also make Sunchay
                    and Steno, two products I wanted for myself. If you want to
                    chat, <Link href="/contact">say hi</Link>.
                </p>
            </div>

            <section className="section" aria-labelledby="about-ig">
                <h2 id="about-ig" className="section-title">
                    Photos &amp; walks
                </h2>
                <p className="row-desc">
                    More walks and places on Instagram — no embed, just the
                    feed.{" "}
                    <a
                        href={INSTAGRAM.href}
                        target="_blank"
                        rel="noreferrer"
                        className="see-more-link"
                    >
                        {INSTAGRAM.handle} ↗
                    </a>
                </p>
            </section>

            <PageBridge
                links={[
                    { href: "/work", label: "Work" },
                    { href: "/notes", label: "Notes" },
                    { href: "/contact", label: "Contact" },
                ]}
            />
        </div>
    );
}
