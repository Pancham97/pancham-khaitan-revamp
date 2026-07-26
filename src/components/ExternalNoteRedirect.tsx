import Link from "next/link";

interface ExternalNoteRedirectProps {
    title: string;
    externalUrl: string;
}

/**
 * External notes live on Notion. Do not auto-open a tab — popup blockers
 * and unexpected navigation are worse UX than a clear manual link.
 */
export default function ExternalNoteRedirect({
    title,
    externalUrl,
}: ExternalNoteRedirectProps) {
    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">{title}</h1>
                <p className="page-lede">
                    This note lives on Notion. Open it there to read the full
                    write-up.
                </p>
            </header>

            <div className="prose-block">
                <p>
                    <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="see-more-link"
                    >
                        Open on Notion ↗
                    </a>
                </p>
            </div>

            <p className="row-extra">
                <Link href="/notes" className="see-more-link">
                    ← All notes
                </Link>
            </p>
        </div>
    );
}
