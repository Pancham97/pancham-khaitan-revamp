import { Metadata } from "next";
import Link from "next/link";
import { getAllNotes } from "@/lib/server-queries";
import { Note } from "@/types/note";
import { getFormattedDate } from "@/lib/formatDate";

export const metadata: Metadata = {
    title: "Notes | Pancham Khaitan",
    description: "Quick thoughts and notes by Pancham Khaitan",
    openGraph: {
        title: "Pancham Khaitan's Notes",
        description: "Quick thoughts and notes by Pancham Khaitan",
        images: [
            "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
        ],
        url: "https://panchamkhaitan.com/notes",
    },
    twitter: {
        title: "Pancham Khaitan's Notes",
        description: "Quick thoughts and notes by Pancham Khaitan",
        images: [
            "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
        ],
        card: "summary_large_image",
    },
};

// Add revalidation for ISR
export const revalidate = 3600; // Cache for 1 hour

export default async function NotesPage() {
    const notes = await getAllNotes();
    const groups = notes.reduce<Record<string, Note[]>>((acc, n) => {
        const year = new Date(n.createdAt).getFullYear().toString();
        (acc[year] ||= []).push(n);
        return acc;
    }, {});
    const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a));

    return (
        <div>
            <header className="mb-8">
                <h1 className="big-headline-text">Notes</h1>
                <p
                    className={`
                      text-neutral-700
                      dark:text-neutral-300
                      max-w-2xl measure lede
                    `}
                >
                    Short thoughts, references, and experiments.
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
                        {groups[year].map((note) => (
                            <li key={note._id} className="py-4">
                                <Link
                                    href={
                                        note.isExternal
                                            ? (note.externalUrl ??
                                              `/notes/${note.slug}`)
                                            : `/notes/${note.slug}`
                                    }
                                    target={
                                        note.isExternal ? "_blank" : undefined
                                    }
                                    rel={
                                        note.isExternal
                                            ? "noreferrer"
                                            : undefined
                                    }
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
                                        <div
                                            className={`
                                              text-base font-semibold flex
                                              items-center gap-2
                                            `}
                                        >
                                            {note.title}
                                            {note.isExternal && (
                                                <span
                                                    className={`
                                                      text-xs text-neutral-500
                                                    `}
                                                >
                                                    ↗
                                                </span>
                                            )}
                                        </div>
                                        <time
                                            className={`
                                              text-sm text-neutral-500
                                              dark:text-neutral-600
                                              whitespace-nowrap
                                            `}
                                        >
                                            {getFormattedDate(note.createdAt)}
                                        </time>
                                    </div>
                                    {note.excerpt && (
                                        <p
                                            className={`
                                              text-sm text-neutral-600
                                              dark:text-neutral-600
                                              mt-1 measure
                                            `}
                                        >
                                            {note.excerpt}
                                        </p>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            {notes.length === 0 && (
                <p
                    className={`
                      text-neutral-600
                      dark:text-neutral-600
                    `}
                >
                    No notes yet.
                </p>
            )}
        </div>
    );
}
