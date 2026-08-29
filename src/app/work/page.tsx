import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllWork } from "@/lib/server-queries";
import { getFormattedDate } from "@/lib/formatDate";
import { CAREER, SITE, WORK_PROOFS } from "@/data/site";
import PageBridge from "@/components/PageBridge";

export const metadata: Metadata = {
    title: "Work",
    description: "Work by Pancham Khaitan.",
    openGraph: {
        title: "Work",
        description: "Work by Pancham Khaitan.",
        url: "https://panchamkhaitan.com/work",
    },
};

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
                    Day job and the products I help ship. Side projects live on{" "}
                    <Link href="/projects">Projects</Link>.
                </p>
            </header>

            <section
                className="section-block"
                aria-labelledby="proofs-heading"
                style={{ marginBottom: "var(--space-7)" }}
            >
                <div className="section-head">
                    <p className="section-kicker" aria-hidden>
                        01
                    </p>
                    <h2 id="proofs-heading" className="section-title">
                        Recent
                    </h2>
                </div>
                <ul className="proof-grid">
                    {WORK_PROOFS.map((item) => {
                        const body = (
                            <>
                                <div className="proof-grid__media">
                                    <Image
                                        src={item.image}
                                        alt={item.imageAlt}
                                        width={640}
                                        height={400}
                                        className="proof-grid__img"
                                        sizes="(max-width: 639px) 100vw, 20rem"
                                    />
                                </div>
                                <div className="proof-grid__body">
                                    <span className="row-title">
                                        {item.title}
                                        {"external" in item && item.external
                                            ? " ↗"
                                            : ""}
                                    </span>
                                    <p className="row-desc">{item.blurb}</p>
                                </div>
                            </>
                        );
                        return (
                            <li key={item.title}>
                                {"external" in item && item.external ? (
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="proof-grid__link"
                                    >
                                        {body}
                                    </a>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="proof-grid__link"
                                    >
                                        {body}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </section>

            <section
                className="career-section section"
                aria-labelledby="career-heading"
            >
                <div className="section-head">
                    <p className="section-kicker" aria-hidden>
                        02
                    </p>
                    <h2 id="career-heading" className="section-title">
                        Career
                    </h2>
                </div>
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
                <div className="section-head">
                    <p className="section-kicker" aria-hidden>
                        03
                    </p>
                    <h2 id="cases-heading" className="section-title">
                        Selected
                    </h2>
                </div>
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

            <PageBridge
                links={[
                    { href: "/projects", label: "Projects" },
                    { href: "/about", label: "About" },
                    { href: "/now", label: "Now" },
                ]}
            />
        </div>
    );
}
