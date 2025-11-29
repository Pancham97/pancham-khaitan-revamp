import { NextResponse } from "next/server";
import {
    getAllBlogs,
    getAllNotes,
    getAllWork,
    getAllUpdates,
} from "@/lib/server-queries";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();

    const [blogs, notes, work, updates] = await Promise.all([
        getAllBlogs(),
        getAllNotes(),
        getAllWork(),
        getAllUpdates(),
    ]);

    const toItem = (
        label: string,
        href: string,
        meta?: string,
        external?: boolean,
    ) => ({ label, href, meta, external });

    const blogItems = blogs.map((b) =>
        toItem(b.title, `/blog/${b.slug}`, "Blog"),
    );
    const noteItems = notes.map((n) => {
        const href = n.isExternal
            ? n.externalUrl || `/notes/${n.slug}`
            : `/notes/${n.slug}`;
        const external =
            !!n.isExternal &&
            !!n.externalUrl &&
            n.externalUrl.startsWith("http");
        return toItem(n.title, href, "Notes", external);
    });
    const workItems = work
        .filter((w) => !w.isHidden)
        .map((w) => toItem(w.title, `/work/${w.slug}`, "Work"));
    const updateItems = updates.map((update) => {
        const href = update.linkUrl ?? "/updates";
        const external = href.startsWith("http");
        const resolvedHref = external ? href : href || "/updates";
        return toItem(update.title, resolvedHref, "Updates", external);
    });

    let items = [...workItems, ...blogItems, ...noteItems, ...updateItems];
    if (q) {
        items = items.filter((i) => i.label.toLowerCase().includes(q));
    }

    // limit to 12 to keep palette snappy
    items = items.slice(0, 12);

    return NextResponse.json({ items });
}
