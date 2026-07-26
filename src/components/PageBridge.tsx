import Link from "next/link";

export type BridgeLink = {
    href: string;
    label: string;
    external?: boolean;
};

/**
 * Recurring “Also · …” trailer so section pages feel like chapters of one person.
 */
export default function PageBridge({
    links,
    label = "Elsewhere",
}: {
    links: BridgeLink[];
    label?: string;
}) {
    if (links.length === 0) {
        return null;
    }

    return (
        <p className="page-bridge" role="navigation" aria-label="Related pages">
            <span className="page-bridge__label">{label}</span>
            {links.map((link, i) => (
                <span key={link.href} className="page-bridge__item">
                    {i > 0 && (
                        <span className="page-bridge__sep" aria-hidden>
                            {" · "}
                        </span>
                    )}
                    {link.external ? (
                        <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="see-more-link"
                        >
                            {link.label}
                            {link.label.endsWith("↗") ? "" : " ↗"}
                        </a>
                    ) : (
                        <Link href={link.href} className="see-more-link">
                            {link.label}
                        </Link>
                    )}
                </span>
            ))}
        </p>
    );
}
