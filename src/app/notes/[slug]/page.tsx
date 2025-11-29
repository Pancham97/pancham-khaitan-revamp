import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoteBySlug, getAllNotes } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";
import ExternalNoteRedirect from "@/components/ExternalNoteRedirect";
import BreadcrumbTitle from "@/components/BreadcrumbTitle";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Add revalidation for ISR
export const revalidate = 3600; // Cache for 1 hour

// Generate static params for all notes
export async function generateStaticParams() {
    const notes = await getAllNotes();

    return notes.map((note) => ({
        slug: note.slug,
    }));
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const note = await getNoteBySlug(slug);

    if (!note) {
        return {
            title: "Note Not Found",
        };
    }

    return {
        title: `${note.title} | Notes`,
        description: note.excerpt,
        openGraph: {
            title: note.title,
            description: note.excerpt,
            images: [
                "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
            ],
            url: `https://panchamkhaitan.com/notes/${note.slug}`,
        },
        twitter: {
            title: note.title,
            description: note.excerpt,
            images: [
                "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
            ],
            card: "summary_large_image",
        },
    };
}

export default async function NotePage({ params }: PageProps) {
    const { slug } = await params;
    const note = await getNoteBySlug(slug);

    if (!note) {
        notFound();
    }

    // If it's an external note, render the redirect component
    if (note.isExternal && note.externalUrl) {
        return (
            <ExternalNoteRedirect
                title={note.title}
                externalUrl={note.externalUrl}
            />
        );
    }

    return (
        <article className="space-y-10">
            <BreadcrumbTitle title={note.title} />
            <header className="space-y-3">
                <h1
                    className={`
                      big-headline-text text-black
                      dark:text-white
                    `}
                >
                    {note.title}
                </h1>
                <div
                    className={`
                      flex flex-wrap items-center gap-2 text-sm text-custom-grey
                    `}
                >
                    <time dateTime={note.createdAt}>
                        {getFormattedDate(note.createdAt)}
                    </time>
                    {note.updatedAt !== note.createdAt && (
                        <span>Updated {getFormattedDate(note.updatedAt)}</span>
                    )}
                </div>
            </header>

            <MarkdownRenderer
                content={note.content ?? ""}
                className={`
                  prose prose-lg max-w-none text-black
                  dark:text-white
                `}
            />

            <footer
                className={`
                  flex flex-wrap items-center justify-between gap-4 border-t
                  border-neutral-200 pt-6
                  dark:border-neutral-800
                `}
            >
                <Link
                    href="/notes"
                    className={`
                      inline-flex items-center transition-colors duration-300
                      group
                    `}
                >
                    <span
                        className={`
                          mr-2 transform transition-transform duration-300
                          group-hover:-translate-x-2
                        `}
                    >
                        ←
                    </span>
                    <span>Back to Notes</span>
                </Link>

                <Link
                    href="/blog"
                    className={`
                      inline-flex items-center text-black transition-colors
                      duration-300 group
                      hover:opacity-80
                      dark:text-white
                    `}
                >
                    <span>Read Blog Posts</span>
                    <span
                        className={`
                          ml-2 transform transition-transform duration-300
                          group-hover:translate-x-2
                        `}
                    >
                        →
                    </span>
                </Link>
            </footer>
        </article>
    );
}
