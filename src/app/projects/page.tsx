import { Metadata } from "next";
import Link from "next/link";
import { PROJECTS } from "@/data/site";
import PageBridge from "@/components/PageBridge";

export const metadata: Metadata = {
    title: "Projects",
    description: "Products, photos, and music by Pancham Khaitan.",
};

const KIND_ORDER = ["product", "photography", "music", "web"] as const;

const KIND_LABEL: Record<(typeof KIND_ORDER)[number], string> = {
    product: "Product",
    photography: "Photography",
    music: "Music",
    web: "Web",
};

export default function ProjectsPage() {
    const byKind = KIND_ORDER.map((kind) => ({
        kind,
        label: KIND_LABEL[kind],
        items: PROJECTS.filter((p) => p.kind === kind),
    })).filter((g) => g.items.length > 0);

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Projects</h1>
                <p className="page-lede">
                    Products I have shipped, plus photos and music.
                </p>
            </header>

            {byKind.map((group) => (
                <section
                    key={group.kind}
                    className="section-block"
                    aria-labelledby={`kind-${group.kind}`}
                >
                    <h2 id={`kind-${group.kind}`} className="section-title">
                        {group.label}
                    </h2>
                    <ul className="row-list">
                        {group.items.map((p) => {
                            const content = (
                                <>
                                    <div className="row-top">
                                        <span className="row-title">
                                            {p.title}
                                            {p.href?.startsWith("http")
                                                ? " ↗"
                                                : ""}
                                        </span>
                                    </div>
                                    <p className="row-desc">{p.description}</p>
                                </>
                            );

                            return (
                                <li key={p.title}>
                                    {p.href ? (
                                        p.href.startsWith("/") ? (
                                            <Link
                                                href={p.href}
                                                className="row-link"
                                            >
                                                {content}
                                            </Link>
                                        ) : (
                                            <a
                                                href={p.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="row-link"
                                            >
                                                {content}
                                            </a>
                                        )
                                    ) : (
                                        content
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}

            <PageBridge
                links={[
                    { href: "/work", label: "Work" },
                    { href: "/gear", label: "Gear" },
                    { href: "/about", label: "About" },
                ]}
            />
        </div>
    );
}
