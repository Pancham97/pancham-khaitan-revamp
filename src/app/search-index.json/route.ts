import { getAllNotes, getAllUpdates, getAllWork } from "@/lib/server-queries";
import { getAllWriting } from "@/lib/writing";
import { PROJECTS, SEARCH_ALIASES } from "@/data/site";

export const dynamic = "force-static";

type SearchItem = {
    label: string;
    href: string;
    meta?: string;
    external?: boolean;
    keywords?: string[];
};

export async function GET() {
    const [writing, notes, work, updates] = await Promise.all([
        getAllWriting(),
        getAllNotes(),
        getAllWork(),
        getAllUpdates(),
    ]);

    const aliasItems: SearchItem[] = SEARCH_ALIASES.map((alias) => ({
        label: alias.label,
        href: alias.href,
        meta: alias.meta,
        external: "external" in alias ? Boolean(alias.external) : false,
        keywords: [...alias.keywords],
    }));
    const projectItems: SearchItem[] = PROJECTS.map((project) => ({
        label: project.title,
        href: project.href || "/projects",
        meta: "Projects",
        external: Boolean(project.href?.startsWith("http")),
        keywords: [
            project.title,
            project.description,
            project.kind,
            project.status,
        ],
    }));
    const blogItems: SearchItem[] = writing.map((post) => ({
        label: post.title,
        href: post.href,
        meta: "Blog",
        external: false,
        keywords: [post.title, post.description, ...post.tags],
    }));
    const noteItems: SearchItem[] = notes.map((note) => {
        const href = note.isExternal
            ? note.externalUrl || `/notes/${note.slug}`
            : `/notes/${note.slug}`;
        const external = Boolean(
            note.isExternal &&
                note.externalUrl &&
                note.externalUrl.startsWith("http"),
        );
        return {
            label: note.title,
            href,
            meta: "Notes",
            external,
            keywords: [note.title, note.excerpt],
        };
    });
    const workItems: SearchItem[] = work
        .filter((item) => !item.isHidden)
        .map((item) => ({
            label: item.title,
            href: `/work/${item.slug}`,
            meta: "Work",
            external: false,
            keywords: [item.title, item.shortDescription],
        }));
    const updateItems: SearchItem[] = updates.map((update) => {
        const href = update.linkUrl || "/now";
        return {
            label: update.title,
            href,
            meta: "Log",
            external: href.startsWith("http"),
            keywords: [update.title, update.snippet || ""],
        };
    });

    const seen = new Set<string>();
    const items = [
        ...aliasItems,
        ...workItems,
        ...projectItems,
        ...blogItems,
        ...noteItems,
        ...updateItems,
    ].filter((item) => {
        const key = `${item.href}::${item.label}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });

    return Response.json({ items });
}
