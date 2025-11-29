import { Metadata } from "next";
import { getAllWork } from "@/lib/server-queries";
import Link from "next/link";
import { getFormattedDate } from "@/lib/formatDate";

export const metadata: Metadata = {
    title: "Work | Pancham Khaitan",
    description:
        "Pancham Khaitan is a software engineer who likes building things. He is also fond of music.",
    openGraph: {
        title: "Pancham Khaitan's work",
        description:
            "Pancham Khaitan is a software engineer who likes building things. He is also fond of music.",
        images: [
            "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
        ],
        url: "https://panchamkhaitan.com/work",
    },
    twitter: {
        card: "summary_large_image",
        title: "Pancham Khaitan's work",
        description:
            "Pancham Khaitan is a software engineer who likes building things. He is also fond of music.",
        images: [
            "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
        ],
    },
};

// Add revalidation for ISR
export const revalidate = 3600; // Cache for 1 hour

export default async function WorkPage() {
    const allWork = await getAllWork();
    const data = allWork.filter((w) => !w.isHidden);
    const groups = data.reduce<Record<string, typeof data>>((acc, w) => {
        const year = w.createdAt
            ? new Date(w.createdAt).getFullYear().toString()
            : "Other";
        (acc[year] ||= []).push(w);
        return acc;
    }, {});
    const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a));

    return (
        <div>
            <header className="mb-8">
                <h1 className="big-headline-text">Work</h1>
                <p
                    className={`
                      text-neutral-700
                      dark:text-neutral-300
                      max-w-2xl measure lede
                    `}
                >
                    “The reward for good work is more work.”
                </p>
            </header>

            {years.map((year) => (
                <section key={year} className="mb-6">
                    <div
                        className={`
                          sticky top-0 z-10 backdrop-blur
                          supports-[backdrop-filter]:border-b-1
                          border-neutral-200/50
                          dark:border-neutral-950/25
                          py-1 -mx-4 px-4
                          md:mx-0 md:px-0
                        `}
                    >
                        <h2 className="text-sm font-medium text-neutral-500">
                            {year}
                        </h2>
                    </div>
                    <ul
                        className={`
                          divide-y-1 divide-neutral-200/50
                          dark:divide-neutral-950/25
                        `}
                    >
                        {groups[year].map((w) => (
                            <li key={w.slug} className="py-4">
                                <Link
                                    href={`/work/${w.slug}`}
                                    className={`
                                      no-underline
                                      hover:underline
                                    `}
                                >
                                    <div
                                        className={`
                                          flex items-baseline justify-between
                                          gap-4
                                        `}
                                    >
                                        <div className="text-base font-semibold">
                                            {w.title}
                                        </div>
                                        <time
                                            className={`
                                              text-sm text-neutral-500
                                              dark:text-neutral-400
                                              whitespace-nowrap
                                            `}
                                        >
                                            {w.createdAt
                                                ? getFormattedDate(w.createdAt)
                                                : ""}
                                        </time>
                                    </div>
                                    {w.shortDescription && (
                                        <p
                                            className={`
                                              text-sm text-neutral-600
                                              dark:text-neutral-600
                                              mt-1 measure
                                            `}
                                        >
                                            {w.shortDescription}
                                        </p>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            {data.length === 0 && (
                <p
                    className={`
                      text-neutral-600
                      dark:text-neutral-400
                    `}
                >
                    No projects to share just yet.
                </p>
            )}
        </div>
    );
}
