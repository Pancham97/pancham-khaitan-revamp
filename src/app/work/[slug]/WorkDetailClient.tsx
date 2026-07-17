import type { IWorkDataPost } from "@/types/work";
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
        <section>
            {metadata.length > 0 && (
                <dl
                    className="row-list"
                    style={{ marginBottom: "1.75rem", marginTop: "0.5rem" }}
                >
                    {metadata.map((item) => (
                        <div key={item.label} className="row-top" style={{ padding: "0.65rem 0" }}>
                            <dt className="row-meta" style={{ margin: 0 }}>
                                {item.label}
                            </dt>
                            <dd className="row-title" style={{ margin: 0 }}>
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            )}

            <MarkdownRenderer content={work.content} className="prose" />
        </section>
    );
}
