import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkBySlug, getAllWork } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";
import WorkDetailClient from "./WorkDetailClient";
import BreadcrumbTitle from "@/components/BreadcrumbTitle";

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
            title: "Work Not Found | Pancham Khaitan",
        };
    }

    return {
        title: `${work.title} | Pancham Khaitan`,
        description: work.shortDescription,
        openGraph: {
            title: work.title,
            description: work.shortDescription,
            images: [work.heroImage],
            url: `https://panchamkhaitan.com/work/${work.slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: work.title,
            description: work.shortDescription,
            images: [work.heroImage],
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

    const metaSegments: string[] = [];
    if (work.createdAt) {
        metaSegments.push(getFormattedDate(work.createdAt));
    }
    if (work.context) {
        metaSegments.push(work.context);
    }
    if (work.skills) {
        metaSegments.push(work.skills);
    }

    return (
        <article>
            <BreadcrumbTitle title={work.title} />
            <h1 className="big-headline-text">{work.title}</h1>

            {work.shortDescription && (
                <p
                    className={`
                      text-neutral-700
                      dark:text-neutral-300
                      text-base max-w-2xl
                    `}
                >
                    {work.shortDescription}
                </p>
            )}

            {/* {work.heroImage && ( */}
            {/*     <figure className="space-y-3"> */}
            {/*         <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100 dark:border-neutral-800/60 dark:bg-neutral-900"> */}
            {/*             <Image */}
            {/*                 src={work.heroImage} */}
            {/*                 alt={work.heroImageAlt} */}
            {/*                 fill */}
            {/*                 className="object-cover" */}
            {/*                 sizes="(min-width: 768px) 720px, 100vw" */}
            {/*                 priority */}
            {/*             /> */}
            {/*         </div> */}
            {/*         {(work.heroImageCaption || work.imageLink) && ( */}
            {/*             <figcaption className="text-xs text-neutral-500 dark:text-neutral-500"> */}
            {/*                 {work.heroImageCaption || work.title} */}
            {/*                 {work.imageLink && ( */}
            {/*                     <span> */}
            {/*                         {" "} */}
            {/*                         ( */}
            {/*                         <a */}
            {/*                             target="_blank" */}
            {/*                             rel="noreferrer" */}
            {/*                             href={work.imageLink} */}
            {/*                             className="hover:underline" */}
            {/*                         > */}
            {/*                             {work.imageSource || "Source"} */}
            {/*                         </a> */}
            {/*                         ) */}
            {/*                     </span> */}
            {/*                 )} */}
            {/*             </figcaption> */}
            {/*         )} */}
            {/*     </figure> */}
            {/* )} */}
            {/**/}
            <WorkDetailClient work={work} />

            {nextWork && (
                <aside
                    className={`
                      border-t border-neutral-200
                      dark:border-neutral-800
                      pt-12
                    `}
                >
                    <Link
                        href={`/work/${nextWork.slug}`}
                        className={`
                          inline-flex flex-col gap-1 text-neutral-900
                          transition-opacity
                          hover:opacity-80
                          dark:text-white
                        `}
                    >
                        <span
                            className={`
                              text-xs uppercase tracking-wider text-neutral-500
                            `}
                        >
                            Next project
                        </span>
                        <span className="text-lg font-medium">
                            {nextWork.title} →
                        </span>
                    </Link>
                </aside>
            )}
        </article>
    );
}
