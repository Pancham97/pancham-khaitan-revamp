// Server-side data fetching sourced from local Markdown content exports
import { loadCollection, loadDocumentBySlug } from "@/lib/content-loader";
import { parseDateInput } from "@/lib/formatDate";

type BlogFrontmatter = {
    title?: string;
    description?: string;
    tags?: unknown;
    createdAt?: string;
    updatedAt?: string;
};

type WorkFrontmatter = {
    title?: string;
    shortDescription?: string;
    startDate?: string;
    endDate?: string | null;
    heroImage?: string;
    heroImageAlt?: string;
    heroImageCaption?: string;
    imageLink?: string | null;
    imageSource?: string | null;
    isFeatured?: boolean;
    isHidden?: boolean;
    context?: string | null;
    skills?: string | null;
    acknowledgements?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

type NoteFrontmatter = {
    title?: string;
    excerpt?: string;
    isExternal?: boolean;
    externalUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

type UpdateFrontmatter = {
    title?: string;
    snippet?: string;
    linkUrl?: string | null;
    linkLabel?: string | null;
    kind?: string;
    createdAt?: string;
};

function ensureString(value: unknown, fallback = ""): string {
    return typeof value === "string" ? value : fallback;
}

function ensureStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }
    return value
        .map((item) => (typeof item === "string" ? item : null))
        .filter((item): item is string => item !== null);
}

function ensureBoolean(value: unknown, fallback = false): boolean {
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "string") {
        if (value.toLowerCase() === "true") {
            return true;
        }
        if (value.toLowerCase() === "false") {
            return false;
        }
    }
    return fallback;
}

function coerceDateInput(value: unknown): string | Date | null | undefined {
    if (value === null || value === undefined) {
        return null;
    }
    if (value instanceof Date) {
        return value;
    }
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number") {
        return new Date(value);
    }
    return String(value);
}

function normalizeDate(value: unknown, fallback?: string): string {
    const parsed = parseDateInput(coerceDateInput(value));
    if (parsed) {
        return parsed.toISOString();
    }
    if (fallback) {
        return normalizeDate(fallback);
    }
    return new Date().toISOString();
}

function normalizeNullableString(value: unknown): string | null {
    if (value === null || value === undefined) {
        return null;
    }
    return typeof value === "string" ? value : String(value);
}

function calculateReadingTime(content: string): string {
    if (!content) {
        return "Under a minute";
    }

    const words = content
        .replace(/[#_*>\[\]()\-`]/g, " ")
        .split(/\s+/)
        .filter(Boolean).length;

    if (words === 0) {
        return "Under a minute";
    }

    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
}

export async function getCarouselContent() {
    const featured = await getFeaturedWork();

    return featured.slice(0, 5).map((item) => ({
        _id: item._id,
        title: item.title,
        heroImage: item.heroImage,
        heroImageAlt: item.heroImageAlt,
        shortDescription: item.shortDescription,
        slug: item.slug,
        buttonText: "View project",
        imageSource: item.imageSource ?? "",
        createdAt: item.createdAt,
    }));
}

export async function getFeaturedWork() {
    const all = await getAllWork();
    return all
        .filter((work) => work.isFeatured && !work.isHidden)
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        )
        .slice(0, 4);
}

export async function getAllWork() {
    const documents = await loadCollection<WorkFrontmatter>("work");

    return documents
        .map(({ slug, frontmatter, content }) => {
            const createdAt = normalizeDate(frontmatter.createdAt);
            const startDate = frontmatter.startDate
                ? normalizeDate(frontmatter.startDate, createdAt)
                : null;
            const endDate = frontmatter.endDate
                ? normalizeNullableString(frontmatter.endDate)
                : null;

            return {
                _id: slug,
                title: ensureString(frontmatter.title, slug),
                slug,
                heroImage: ensureString(frontmatter.heroImage),
                heroImageAlt: ensureString(frontmatter.heroImageAlt),
                heroImageCaption: ensureString(frontmatter.heroImageCaption),
                content,
                shortDescription: ensureString(frontmatter.shortDescription),
                skills: normalizeNullableString(frontmatter.skills),
                context: normalizeNullableString(frontmatter.context),
                acknowledgements: normalizeNullableString(
                    frontmatter.acknowledgements,
                ),
                imageLink: normalizeNullableString(frontmatter.imageLink),
                imageSource: normalizeNullableString(frontmatter.imageSource),
                isFeatured: ensureBoolean(frontmatter.isFeatured),
                isHidden: ensureBoolean(frontmatter.isHidden),
                createdAt,
                startDateOfWork: startDate,
                endDateOfWork: endDate,
            };
        })
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
}

export async function getWorkBySlug(slug: string) {
    const document = await loadDocumentBySlug<WorkFrontmatter>("work", slug);
    if (!document) {
        return null;
    }

    const { frontmatter, content } = document;
    const createdAt = normalizeDate(frontmatter.createdAt);

    return {
        _id: slug,
        title: ensureString(frontmatter.title, slug),
        slug,
        heroImage: ensureString(frontmatter.heroImage),
        heroImageAlt: ensureString(frontmatter.heroImageAlt),
        heroImageCaption: ensureString(frontmatter.heroImageCaption),
        content,
        shortDescription: ensureString(frontmatter.shortDescription),
        skills: normalizeNullableString(frontmatter.skills),
        context: normalizeNullableString(frontmatter.context),
        acknowledgements: normalizeNullableString(frontmatter.acknowledgements),
        imageLink: normalizeNullableString(frontmatter.imageLink),
        imageSource: normalizeNullableString(frontmatter.imageSource),
        isFeatured: ensureBoolean(frontmatter.isFeatured),
        isHidden: ensureBoolean(frontmatter.isHidden),
        createdAt,
        startDateOfWork: frontmatter.startDate
            ? normalizeDate(frontmatter.startDate, createdAt)
            : null,
        endDateOfWork: frontmatter.endDate
            ? normalizeNullableString(frontmatter.endDate)
            : null,
    };
}

export async function getAllBlogs() {
    const documents = await loadCollection<BlogFrontmatter>("blog");

    return documents
        .map(({ slug, frontmatter }) => ({
            _id: slug,
            title: ensureString(frontmatter.title, slug),
            slug,
            blogDescription: ensureString(frontmatter.description),
            tags: ensureStringArray(frontmatter.tags),
            createdAt: normalizeDate(frontmatter.createdAt),
            updatedAt: frontmatter.updatedAt
                ? normalizeDate(frontmatter.updatedAt, frontmatter.createdAt)
                : undefined,
        }))
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
}

export async function getBlogsByTag(tag: string) {
    const documents = await loadCollection<BlogFrontmatter>("blog");

    return documents
        .map(({ slug, frontmatter, content }) => ({
            _id: slug,
            title: ensureString(frontmatter.title, slug),
            slug,
            content,
            blogDescription: ensureString(frontmatter.description),
            tags: ensureStringArray(frontmatter.tags),
            timeToRead: calculateReadingTime(content),
            createdAt: normalizeDate(frontmatter.createdAt),
            updatedAt: frontmatter.updatedAt
                ? normalizeDate(frontmatter.updatedAt, frontmatter.createdAt)
                : undefined,
        }))
        .filter((blog) => blog.tags.includes(tag))
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
}

export async function getBlogBySlug(slug: string) {
    const document = await loadDocumentBySlug<BlogFrontmatter>("blog", slug);
    if (!document) {
        return null;
    }

    const { frontmatter, content } = document;

    return {
        _id: slug,
        title: ensureString(frontmatter.title, slug),
        slug,
        content,
        blogDescription: ensureString(frontmatter.description),
        tags: ensureStringArray(frontmatter.tags),
        timeToRead: calculateReadingTime(content),
        createdAt: normalizeDate(frontmatter.createdAt),
        updatedAt: frontmatter.updatedAt
            ? normalizeDate(frontmatter.updatedAt, frontmatter.createdAt)
            : undefined,
    };
}

export async function getAllNotes() {
    const documents = await loadCollection<NoteFrontmatter>("notes");

    return documents
        .map(({ slug, frontmatter, content }) => ({
            _id: slug,
            title: ensureString(frontmatter.title, slug),
            slug,
            content,
            excerpt: ensureString(frontmatter.excerpt),
            externalUrl: normalizeNullableString(frontmatter.externalUrl),
            isExternal: ensureBoolean(frontmatter.isExternal),
            createdAt: normalizeDate(frontmatter.createdAt),
            updatedAt: normalizeDate(
                frontmatter.updatedAt,
                frontmatter.createdAt,
            ),
        }))
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
}

export async function getNoteBySlug(slug: string) {
    const document = await loadDocumentBySlug<NoteFrontmatter>("notes", slug);
    if (!document) {
        return null;
    }

    const { frontmatter, content } = document;

    return {
        _id: slug,
        title: ensureString(frontmatter.title, slug),
        slug,
        content,
        excerpt: ensureString(frontmatter.excerpt),
        externalUrl: normalizeNullableString(frontmatter.externalUrl),
        isExternal: ensureBoolean(frontmatter.isExternal),
        createdAt: normalizeDate(frontmatter.createdAt),
        updatedAt: normalizeDate(frontmatter.updatedAt, frontmatter.createdAt),
    };
}

export async function getAllUpdates() {
    const documents = await loadCollection<UpdateFrontmatter>("updates");

    return documents
        .map(({ slug, frontmatter }) => ({
            _id: slug,
            title: ensureString(frontmatter.title, slug),
            slug,
            snippet: ensureString(frontmatter.snippet),
            linkUrl: normalizeNullableString(frontmatter.linkUrl),
            linkLabel: normalizeNullableString(frontmatter.linkLabel),
            kind: ensureString(frontmatter.kind, "general"),
            createdAt: normalizeDate(frontmatter.createdAt),
            updatedAt: normalizeDate(frontmatter.createdAt), // Use createdAt as updatedAt for updates
        }))
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
}

export async function getLatestUpdates(limit = 5) {
    const all = await getAllUpdates();
    return all.slice(0, limit);
}
