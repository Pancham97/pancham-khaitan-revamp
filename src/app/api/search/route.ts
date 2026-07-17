import { NextResponse } from "next/server";
import { getAllNotes, getAllWork, getAllUpdates } from "@/lib/server-queries";
import { getAllWriting } from "@/lib/writing";
import { PROJECTS, SEARCH_ALIASES } from "@/data/site";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();

    const [writing, notes, work, updates] = await Promise.all([
        getAllWriting(),
        getAllNotes(),
        getAllWork(),
        getAllUpdates(),
    ]);

    const toItem = (
        label: string,
        href: string,
        meta?: string,
        external?: boolean,
        keywords?: string[],
    ) => ({ label, href, meta, external, keywords });

    const aliasItems = SEARCH_ALIASES.map((a) =>
        toItem(
            a.label,
            a.href,
            a.meta,
            "external" in a ? !!a.external : false,
            [...a.keywords],
        ),
    );

    const projectItems = PROJECTS.map((p) =>
        toItem(
            p.title,
            p.href || "/projects",
            "Projects",
            !!p.href && p.href.startsWith("http"),
            [p.title, p.description, p.kind, p.status],
        ),
    );

    const blogItems = writing.map((b) =>
        toItem(
            b.title,
            b.href,
            b.source === "substack" ? "Substack" : "Blog",
            b.external,
            [b.title, b.description || ""],
        ),
    );
    const noteItems = notes.map((n) => {
        const href = n.isExternal
            ? n.externalUrl || `/notes/${n.slug}`
            : `/notes/${n.slug}`;
        const external =
            !!n.isExternal &&
            !!n.externalUrl &&
            n.externalUrl.startsWith("http");
        return toItem(n.title, href, "Notes", external, [n.title, n.excerpt]);
    });
    const workItems = work
        .filter((w) => !w.isHidden)
        .map((w) =>
            toItem(w.title, `/work/${w.slug}`, "Work", false, [
                w.title,
                w.shortDescription,
            ]),
        );
    const updateItems = updates.map((update) => {
        const href = update.linkUrl ?? "/now";
        const external = href.startsWith("http");
        const resolvedHref = external ? href : href || "/now";
        return toItem(update.title, resolvedHref, "Log", external, [
            update.title,
            update.snippet || "",
        ]);
    });

    let items = [
        ...aliasItems,
        ...workItems,
        ...projectItems,
        ...blogItems,
        ...noteItems,
        ...updateItems,
    ];

    if (q) {
        items = items.filter((i) => {
            const hay = [
                i.label,
                i.meta || "",
                ...(i.keywords || []),
            ]
                .join(" ")
                .toLowerCase();
            return hay.includes(q);
        });
    }

    // Deduplicate by href+label, prefer earlier (aliases first)
    const seen = new Set<string>();
    const unique = items.filter((i) => {
        const key = `${i.href}::${i.label}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });

    // limit to 12 to keep palette snappy
    const results = unique
        .slice(0, 12)
        .map(({ label, href, meta, external }) => ({
            label,
            href,
            meta,
            external,
        }));

    return NextResponse.json({ items: results });
}
