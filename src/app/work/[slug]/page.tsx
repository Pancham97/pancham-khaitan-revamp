import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkBySlug, getAllWork } from "@/lib/server-queries";
import WorkDetailClient from "./WorkDetailClient";

// Add revalidation for ISR
export const revalidate = 3600; // Cache for 1 hour

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
                <figure style={{ margin: "0 0 1.75rem" }}>
                    <div
                        style={{
                            position: "relative",
                            aspectRatio: "16 / 9",
                            width: "100%",
                            overflow: "hidden",
                            border: "1px solid var(--line)",
                            background: "var(--hover)",
                        }}
                    >
                        <Image
                            src={work.heroImage}
                            alt={work.heroImageAlt || work.title}
                            fill
                            className="object-cover"
                            sizes="(min-width: 768px) 672px, calc(100vw - 2rem)"
                            priority
                        />
                    </div>
                    {(work.heroImageCaption || work.imageLink) && (
                        <figcaption className="row-desc">
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
                <aside style={{ marginTop: "2.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--line)" }}>
                    <Link href={`/work/${nextWork.slug}`} className="row-link">
                        <span className="section-title">Next</span>
                        <span className="row-title">{nextWork.title} →</span>
                    </Link>
                </aside>
            )}
        </article>
    );
}
