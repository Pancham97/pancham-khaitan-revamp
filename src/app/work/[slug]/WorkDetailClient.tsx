"use client";

import { IWorkDataPost } from "@/types/work";
import { getFormattedDate, parseDateInput } from "@/lib/formatDate";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface WorkDetailClientProps {
    work: IWorkDataPost;
}

function formatRange(start?: string | null, end?: string | null) {
    if (!start) {
        return null;
    }
    const parsedStart = parseDateInput(start);
    const parsedEnd = end ? parseDateInput(end) : null;

    const startLabel = parsedStart ? getFormattedDate(parsedStart) : start;
    const endLabel = end
        ? parsedEnd
            ? getFormattedDate(parsedEnd)
            : end
        : "Present";

    return `${startLabel} — ${endLabel}`;
}

export default function WorkDetailClient({ work }: WorkDetailClientProps) {
    const timelineRange = formatRange(work.startDateOfWork, work.endDateOfWork);

    const metadata = [
        timelineRange && {
            label: "Timeline",
            value: timelineRange,
        },
        work.context && {
            label: "Context",
            value: work.context,
        },
        work.skills && {
            label: "Skills",
            value: work.skills,
        },
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <section className="space-y-10">
            {metadata.length > 0 && (
                <dl
                    className={`
                      grid gap-4 rounded-xl border border-neutral-200/80
                      bg-white/70 p-4 text-sm mt-4 leading-relaxed
                      dark:border-white/10 dark:bg-white/5
                      sm:grid-cols-2
                    `}
                >
                    {metadata.map((item) => (
                        <div key={item.label} className="space-y-1">
                            <dt
                                className={`
                                  text-xs uppercase tracking-wide
                                  text-neutral-500
                                  dark:text-neutral-400
                                `}
                            >
                                {item.label}
                            </dt>
                            <dd
                                className={`
                                  font-medium text-neutral-800
                                  dark:text-neutral-100
                                `}
                            >
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            )}

            <MarkdownRenderer
                content={work.content}
                className={`
                  prose prose-neutral
                  dark:prose-invert
                  max-w-none
                  prose-headings:font-bold prose-headings:text-neutral-900
                  dark:prose-headings:text-white
                  prose-p:text-neutral-600
                  dark:prose-p:text-neutral-300
                  prose-a:no-underline
                  hover:prose-a:underline
                  prose-strong:text-neutral-900
                  dark:prose-strong:text-white
                  prose-blockquote:border-neutral-300
                  dark:prose-blockquote:border-neutral-700
                `}
            />

            {work.acknowledgements && (
                <section
                    className={`
                      border-t border-neutral-200
                      dark:border-neutral-800
                      pt-6
                    `}
                >
                    <h3
                        className={`
                          font-semibold text-neutral-900
                          dark:text-white
                          mb-4
                        `}
                    >
                        Acknowledgements
                    </h3>
                    <MarkdownRenderer
                        content={work.acknowledgements}
                        className={`
                          prose prose-sm prose-neutral
                          dark:prose-invert
                        `}
                    />
                </section>
            )}
        </section>
    );
}
