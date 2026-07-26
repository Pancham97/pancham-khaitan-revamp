import { Metadata } from "next";
import { getAllUpdates } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";
import { NOW } from "@/data/site";
import PageBridge from "@/components/PageBridge";

export const metadata: Metadata = {
    title: "Now",
    description: "What Pancham is focused on.",
};

export const revalidate = 1800;

export default async function NowPage() {
    const updates = await getAllUpdates();
    const updatedLabel = getFormattedDate(NOW.updated);

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Now</h1>
                {updatedLabel && (
                    <p className="page-lede muted">Updated {updatedLabel}</p>
                )}
            </header>

            <ul className="row-list now-focus-list">
                {NOW.items.map((item) => (
                    <li key={item}>
                        <p className="row-desc" style={{ margin: 0 }}>
                            {item}
                        </p>
                    </li>
                ))}
            </ul>

            {updates.length > 0 && (
                <section className="section" aria-labelledby="now-log">
                    <h2 id="now-log" className="section-title">
                        Log
                    </h2>
                    <p className="page-lede" style={{ marginBottom: "1rem" }}>
                        What I shipped or noted. Newest first.
                    </p>
                    <ul className="row-list">
                        {updates.map((u) => (
                            <li key={u._id}>
                                <div className="row-top">
                                    <span className="row-title">{u.title}</span>
                                    <time className="row-meta">
                                        {getFormattedDate(u.createdAt)}
                                    </time>
                                </div>
                                {u.snippet && (
                                    <p className="row-desc">{u.snippet}</p>
                                )}
                                {u.linkUrl && (
                                    <div className="row-extra">
                                        <a
                                            href={u.linkUrl}
                                            target={
                                                u.linkUrl.startsWith("http")
                                                    ? "_blank"
                                                    : undefined
                                            }
                                            rel={
                                                u.linkUrl.startsWith("http")
                                                    ? "noreferrer"
                                                    : undefined
                                            }
                                            className="see-more-link"
                                        >
                                            {u.linkLabel || "Open"}
                                            {u.linkUrl.startsWith("http")
                                                ? " ↗"
                                                : " →"}
                                        </a>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <PageBridge
                links={[
                    { href: "/blog", label: "Blog" },
                    { href: "/tweets", label: "Tweets" },
                    { href: "/work", label: "Work" },
                ]}
            />
        </div>
    );
}
