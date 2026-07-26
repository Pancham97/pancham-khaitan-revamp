import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoteBySlug, getAllNotes } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";
import ExternalNoteRedirect from "@/components/ExternalNoteRedirect";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import PageBridge from "@/components/PageBridge";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export const revalidate = 3600;

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
        title: note.title,
        description: note.excerpt,
        openGraph: {
            title: note.title,
            description: note.excerpt,
            url: `https://panchamkhaitan.com/notes/${note.slug}`,
        },
        twitter: {
            title: note.title,
            description: note.excerpt,
            card: "summary",
        },
    };
}

export default async function NotePage({ params }: PageProps) {
    const { slug } = await params;
    const note = await getNoteBySlug(slug);

    if (!note) {
        notFound();
    }

    if (note.isExternal && note.externalUrl) {
        return (
            <ExternalNoteRedirect
                title={note.title}
                externalUrl={note.externalUrl}
            />
        );
    }

    return (
        <article>
            <header className="page-header">
                <h1 className="page-title">{note.title}</h1>
                <p className="page-lede">
                    {getFormattedDate(note.createdAt)}
                    {note.updatedAt !== note.createdAt && (
                        <> · Updated {getFormattedDate(note.updatedAt)}</>
                    )}
                </p>
            </header>

            <MarkdownRenderer
                content={note.content ?? ""}
                className="prose"
            />

            <PageBridge
                links={[
                    { href: "/notes", label: "Notes" },
                    { href: "/blog", label: "Blog" },
                    { href: "/about", label: "About" },
                ]}
            />
            <p className="row-extra">
                <Link href="/notes" className="see-more-link">
                    ← All notes
                </Link>
            </p>
        </article>
    );
}
