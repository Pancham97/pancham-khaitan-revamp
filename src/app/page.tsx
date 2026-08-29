import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FEATURED_PROJECT, PHOTOS, SITE } from "@/data/site";

export const metadata: Metadata = {
    title: {
        absolute: SITE.name,
    },
    description:
        "Software engineer at SingleStore. Also sings Hindustani classical, plays keys, and clicks photos on evening walks.",
    alternates: { canonical: "/" },
};

/**
 * Home stays light: photo + short prose, with projects named in a sentence.
 * Everything else is one link away.
 */
export default function Home() {
    return (
        <article className="home">
            <h1 className="home-name">{SITE.name}</h1>

            <div className="home-body">
                <figure className="home-photo">
                    <Image
                        src={PHOTOS.cover.src}
                        alt={PHOTOS.cover.alt}
                        width={PHOTOS.cover.width}
                        height={PHOTOS.cover.height}
                        className="home-photo__img"
                        sizes="(max-width: 639px) 10.5rem, 13rem"
                        priority
                    />
                </figure>

                <div className="home-prose">
                    <p>
                        I build software at{" "}
                        <a
                            href={SITE.orgHref}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {SITE.org}
                        </a>
                        . I also sing Hindustani classical, play keys, and take
                        photos on evening walks.
                    </p>
                    <p>
                        Outside work I ship small products when I need them —
                        like{" "}
                        <a
                            href={FEATURED_PROJECT.href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Steno
                        </a>
                        , local Mac dictation that made me more productive, and{" "}
                        <a
                            href="https://varta.work"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Varta
                        </a>
                        , for turning spreadsheets into WhatsApp messages. I am
                        also shaping{" "}
                        <a
                            href="https://x.com/SunchayApp"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Sunchay
                        </a>{" "}
                        in public. More on the{" "}
                        <Link href="/projects">projects</Link> page.
                    </p>
                    <p>
                        Here you can read about my{" "}
                        <Link href="/work">work</Link>, browse the{" "}
                        <Link href="/blog">blog</Link>, flip through a few{" "}
                        <Link href="/notes">notes</Link>, or learn more{" "}
                        <Link href="/about">about me</Link>. If you want to
                        talk, <Link href="/contact">say hello</Link>.
                    </p>
                </div>
            </div>
        </article>
    );
}
