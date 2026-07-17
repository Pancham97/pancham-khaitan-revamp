import { Metadata } from "next";
import Link from "next/link";
import { getAllWork } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";
import { CAREER, SITE } from "@/data/site";

export const metadata: Metadata = {
    title: "Work",
    description: "Work by Pancham Khaitan.",
    openGraph: {
        title: "Work",
        description: "Work by Pancham Khaitan.",
        url: "https://panchamkhaitan.com/work",
    },
};

export const revalidate = 3600;

/** Case studies already linked under Career — omit from Selected. */
function careerCaseSlugs(): Set<string> {
    const slugs = new Set<string>();
    for (const job of CAREER) {
        for (const h of job.highlights) {
            if (h.href.startsWith("/work/")) {
                slugs.add(h.href.replace(/^\/work\//, ""));
            }
        }
    }
    return slugs;
}

export default async function WorkPage() {
    const allWork = await getAllWork();
    const linkedFromCareer = careerCaseSlugs();
    const data = allWork.filter(
        (w) => !w.isHidden && !linkedFromCareer.has(w.slug),
    );
    const groups = data.reduce<Record<string, typeof data>>((acc, w) => {
        const year = w.createdAt
            ? new Date(w.createdAt).getFullYear().toString()
            : "Other";
        (acc[year] ||= []).push(w);
        return acc;
    }, {});
    const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a));

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Work</h1>
                <p className="page-lede">
                    Career first. Case studies sit under the job they belong to.
                </p>
            </header>

            <section
                className="career-section"
                aria-labelledby="career-heading"
            >
                <h2 id="career-heading" className="section-title">
                    Career
                </h2>
                {CAREER.map((job) => (
                    <article key={job.org} className="career-block">
                        <div className="row-top">
                            <h3 className="career-block__org">
                                {"orgHref" in job && job.orgHref ? (
                                    <a
                                        href={job.orgHref}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {job.org}
                                    </a>
                                ) : (
                                    job.org
                                )}
                            </h3>
                            <span className="row-meta">{job.period}</span>
                        </div>
                        <p className="career-block__role">{job.role}</p>
                        {job.org === "SingleStore" ? (
                            <p className="career-block__summary">
                                I build{" "}
                                <a
                                    href={SITE.heliosHref}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Helios
                                </a>{" "}
                                (managed SingleStore) and{" "}
                                <a
                                    href={SITE.auraAnalystHref}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Aura Analyst
                                </a>
                                . Data loading UI, making Command+K way faster,
                                tools that help people write SQL.
                            </p>
                        ) : (
                            <p className="career-block__summary">
                                {job.summary}
                            </p>
                        )}
                        {job.highlights.length > 0 && (
                            <ul className="career-block__list">
                                {job.highlights.map((h) => (
                                    <li key={h.href}>
                                        {h.href.startsWith("/") ? (
                                            <Link href={h.href}>
                                                {h.title} →
                                            </Link>
                                        ) : (
                                            <a
                                                href={h.href}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {h.title} ↗
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </article>
                ))}
            </section>

            <section className="section" aria-labelledby="cases-heading">
                <h2 id="cases-heading" className="section-title">
                    Selected
                </h2>
                {years.map((year) => (
                    <div key={year} className="section-block">
                        <div className="year-label">{year}</div>
                        <ul className="row-list">
                            {groups[year].map((w) => {
                                const dateLabel = w.createdAt
                                    ? getFormattedDate(w.createdAt)
                                    : "";
                                return (
                                    <li key={w.slug}>
                                        <Link
                                            href={`/work/${w.slug}`}
                                            className="row-link"
                                        >
                                            <div className="row-top">
                                                <span className="row-title">
                                                    {w.title}
                                                </span>
                                                <time className="row-meta">
                                                    {dateLabel}
                                                </time>
                                            </div>
                                            {w.shortDescription && (
                                                <p className="row-desc">
                                                    {w.shortDescription}
                                                </p>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
                {data.length === 0 && (
                    <p className="muted">Nothing here yet.</p>
                )}
            </section>
        </div>
    );
}
