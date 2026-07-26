import { Metadata } from "next";
import Link from "next/link";
import {
    PROJECTS,
    PROJECT_STATUS_LABEL,
    type ProjectStatus,
} from "@/data/site";
import PageBridge from "@/components/PageBridge";

export const metadata: Metadata = {
    title: "Projects",
    description: "Side projects by Pancham Khaitan.",
};

const KIND_ORDER = ["product", "photography", "music", "web"] as const;

const KIND_LABEL: Record<(typeof KIND_ORDER)[number], string> = {
    product: "Product",
    photography: "Photography",
    music: "Music",
    web: "Web",
};

const STATUS_RANK: Record<ProjectStatus, number> = {
    building: 0,
    shipped: 1,
    paused: 2,
};

export default function ProjectsPage() {
    const byKind = KIND_ORDER.map((kind) => ({
        kind,
        label: KIND_LABEL[kind],
        items: PROJECTS.filter((p) => p.kind === kind).slice().sort(
            (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status],
        ),
    })).filter((g) => g.items.length > 0);

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Projects</h1>
                <p className="page-lede">
                    Side products, photos, music. Stuff I wanted for myself or
                    could not stop thinking about.
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
                            const statusLabel = PROJECT_STATUS_LABEL[p.status];
                            const content = (
                                <>
                                    <div className="row-top">
                                        <span className="row-title">
                                            {p.title}
                                            {p.href?.startsWith("http")
                                                ? " ↗"
                                                : ""}
                                        </span>
                                        <span className="row-meta">
                                            {p.status === "building" && (
                                                <span
                                                    className={`
                                                      status-dot
                                                      status-dot--building
                                                    `}
                                                    aria-hidden
                                                />
                                            )}
                                            {statusLabel}
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
