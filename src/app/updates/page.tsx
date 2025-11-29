import { Metadata } from "next";
import { getAllUpdates } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";

export const metadata: Metadata = {
    title: "Updates | Pancham Khaitan",
    description: "Personal updates and small snippets from Pancham.",
    openGraph: {
        title: "Updates | Pancham Khaitan",
        description: "Personal updates and small snippets from Pancham.",
        url: "https://panchamkhaitan.com/updates",
    },
};

export const revalidate = 1800;

export default async function UpdatesPage() {
    const updates = await getAllUpdates();

    return (
        <div>
            <header className="mb-8">
                <h1 className="big-headline-text">Updates</h1>
                <p
                    className={`
                      text-neutral-700
                      dark:text-neutral-600
                      max-w-2xl measure lede
                    `}
                >
                    Small, timely notes — new posts, life bits, photos, and
                    more.
                </p>
            </header>

            {updates.length > 0 ? (
                <ul
                    className={`
                      divide-y-1 divide-neutral-200/50
                      dark:divide-neutral-950/25
                    `}
                >
                    {updates.map((u) => (
                        <li key={u._id} className="py-4">
                            <div
                                className={`
                                  flex items-baseline justify-between gap-4
                                `}
                            >
                                <div
                                    className={`
                                      text-base font-semibold flex items-center
                                      gap-2
                                    `}
                                >
                                    {u.title}
                                </div>
                                <time
                                    className={`
                                      text-sm text-neutral-500
                                      dark:text-neutral-400
                                      whitespace-nowrap
                                    `}
                                >
                                    {getFormattedDate(u.createdAt)}
                                </time>
                            </div>
                            {u.snippet && (
                                <p
                                    className={`
                                      text-sm text-neutral-600
                                      dark:text-neutral-600
                                      mt-1 measure
                                    `}
                                >
                                    {u.snippet}
                                </p>
                            )}
                            {u.linkUrl && (
                                <div className="mt-1 text-sm">
                                    <a
                                        href={u.linkUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="see-more-link"
                                    >
                                        {u.linkLabel || "Open"} →
                                    </a>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p
                    className={`
                      text-neutral-600
                      dark:text-neutral-400
                    `}
                >
                    No updates yet.
                </p>
            )}
        </div>
    );
}
