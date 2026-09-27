import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PHOTOS, SITE } from "@/data/site";

export const metadata: Metadata = {
    title: {
        absolute: SITE.name,
    },
    description: SITE.description,
    alternates: { canonical: "/" },
};

export default function Home() {
    return (
        <article className="home">
            <Image
                src={PHOTOS.cover.src}
                alt={PHOTOS.cover.alt}
                width={PHOTOS.cover.width}
                height={PHOTOS.cover.height}
                className="home__photo"
                sizes="6rem"
                priority
            />
            <h1 className="home__name">{SITE.name}</h1>
            <div className="home__prose">
                <p>
                    I am a software engineering manager at{" "}
                    <a
                        href={SITE.orgHref}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        SingleStore
                    </a>
                    . I joined as an engineer in 2023, working on Helios and
                    Aura Analyst. Before that I was at Peak AI and Cybage.
                </p>
                <p>
                    I also make{" "}
                    <a
                        href="https://sunchay.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Sunchay
                    </a>
                    , a memory you can text, and{" "}
                    <a
                        href="https://apps.apple.com/in/app/steno-dictation/id6762076728?mt=12"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Steno
                    </a>
                    , private dictation for the Mac.
                </p>
                <p>
                    Outside work I study Hindustani classical music, play the
                    keys, and take photos on evening walks. I write about some
                    of it on the <Link href="/blog">blog</Link>.
                </p>
                <p>
                    <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </p>
            </div>
        </article>
    );
}
