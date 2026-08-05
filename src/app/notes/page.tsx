import { Metadata } from "next";
import Link from "next/link";
import { getAllNotes } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";
import PageBridge from "@/components/PageBridge";

export const metadata: Metadata = {
    title: "Notes",
    description: "Study notes and short scraps by Pancham Khaitan.",
    openGraph: {
        title: "Notes",
        description: "Study notes and short scraps by Pancham Khaitan.",
        url: "/notes",
    },
};

export default async function NotesPage() {
    const notes = await getAllNotes();

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Notes</h1>
                <p className="page-lede">
                    Things I wrote down to remember — mostly study notes, kept
                    light.
                </p>
            </header>

            {notes.length === 0 ? (
                <p className="muted">No notes yet.</p>
            ) : (
                <ul className="row-list">
                    {notes.map((note) => {
                        const body = (
                            <>
                                <div className="row-top">
                                    <span className="row-title">
                                        {note.title}
                                        {note.isExternal ? " ↗" : ""}
                                    </span>
                                    <time className="row-meta">
                                        {getFormattedDate(note.createdAt)}
                                    </time>
                                </div>
                                {note.excerpt ? (
                                    <p className="row-desc">{note.excerpt}</p>
                                ) : null}
                            </>
                        );

                        return (
                            <li key={note.slug}>
                                {note.isExternal && note.externalUrl ? (
                                    <a
                                        href={note.externalUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="row-link"
                                    >
                                        {body}
                                    </a>
                                ) : (
                                    <Link
                                        href={`/notes/${note.slug}`}
                                        className="row-link"
                                    >
                                        {body}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            <PageBridge
                links={[
                    { href: "/blog", label: "Blog" },
                    { href: "/about", label: "About" },
                    { href: "/work", label: "Work" },
                ]}
            />
        </div>
    );
}
