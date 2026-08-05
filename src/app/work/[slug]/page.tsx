import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkBySlug, getAllWork } from "@/lib/server-queries";
import WorkDetailClient from "./WorkDetailClient";

export const dynamicParams = false;

// Generate static params for all work posts
export async function generateStaticParams() {
    const workPosts = await getAllWork();

    return workPosts
        .filter((work) => !work.isHidden)
        .map((work) => ({
            slug: work.slug,
        }));
}

async function getWorkPost(slug: string) {
    try {
        const workPost = await getWorkBySlug(slug);
        return workPost;
    } catch (error) {
        console.error("Error fetching work post:", error);
        return null;
    }
}

async function getAllWorkData() {
    try {
        const allWork = await getAllWork();
        return allWork.filter((work) => !work.isHidden);
    } catch (error) {
        console.error("Error fetching all work data:", error);
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const work = await getWorkPost(slug);

    if (!work) {
        return {
            title: "Work Not Found",
        };
    }

    return {
        title: work.title,
        description: work.shortDescription,
        openGraph: {
            title: work.title,
            description: work.shortDescription,
            ...(work.heroImage ? { images: [work.heroImage] } : {}),
            url: `https://panchamkhaitan.com/work/${work.slug}`,
        },
        twitter: {
            card: work.heroImage ? "summary_large_image" : "summary",
            title: work.title,
            description: work.shortDescription,
            ...(work.heroImage ? { images: [work.heroImage] } : {}),
        },
    };
}

export default async function WorkDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const [work, allWork] = await Promise.all([
        getWorkPost(slug),
        getAllWorkData(),
    ]);

    if (!work) {
        notFound();
    }

    const currentIndex = allWork.findIndex((w) => w.slug === slug);
    const nextWork =
        currentIndex < allWork.length - 1 ? allWork[currentIndex + 1] : null;

    return (
        <article>
            <header className="page-header">
                <h1 className="page-title">{work.title}</h1>
                {work.shortDescription && (
                    <p className="page-lede">{work.shortDescription}</p>
                )}
            </header>

            {work.heroImage && (
                <figure className="detail-hero">
                    <div className="detail-hero__frame">
                        <Image
                            src={work.heroImage}
                            alt={work.heroImageAlt || work.title}
                            fill
                            className="detail-hero__img"
                            sizes="(min-width: 768px) 672px, calc(100vw - 2rem)"
                            priority
                        />
                    </div>
                    {(work.heroImageCaption || work.imageLink) && (
                        <figcaption className="row-desc detail-hero__cap">
                            {work.heroImageCaption && (
                                <span>{work.heroImageCaption}</span>
                            )}
                            {work.heroImageCaption && work.imageLink && (
                                <span aria-hidden="true"> · </span>
                            )}
                            {work.imageLink && (
                                <a
                                    href={work.imageLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {work.imageSource
                                        ? `Source: ${work.imageSource}`
                                        : "Image source"}
                                </a>
                            )}
                        </figcaption>
                    )}
                </figure>
            )}

            <WorkDetailClient work={work} />

            {nextWork && (
                <aside className="detail-next">
                    <Link href={`/work/${nextWork.slug}`} className="row-link">
                        <span className="section-title">Next</span>
                        <span className="row-title">{nextWork.title} →</span>
                    </Link>
                </aside>
            )}

            <p className="row-extra">
                <Link href="/work" className="see-more-link">
                    ← All work
                </Link>
                {" · "}
                <Link href="/projects" className="see-more-link">
                    Projects
                </Link>
            </p>
        </article>
    );
}
