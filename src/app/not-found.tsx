import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Not found",
    description: "That page does not exist.",
};

export default function NotFound() {
    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Not found</h1>
                <p className="page-lede">
                    That page is gone, never was, or got renamed. Try home, use
                    the nav, or search (⌘K / Ctrl+K).
                </p>
            </header>
            <p className="row-extra">
                <Link href="/" className="see-more-link">
                    Home →
                </Link>
                {" · "}
                <Link href="/work" className="see-more-link">
                    Work →
                </Link>
                {" · "}
                <Link href="/blog" className="see-more-link">
                    Blog →
                </Link>
                {" · "}
                <Link href="/notes" className="see-more-link">
                    Notes →
                </Link>
                {" · "}
                <Link href="/contact" className="see-more-link">
                    Contact →
                </Link>
            </p>
        </div>
    );
}
