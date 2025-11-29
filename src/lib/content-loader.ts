import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

type CollectionName = "blog" | "work" | "notes" | "updates";

interface MarkdownDocument<TFrontmatter extends Record<string, unknown>> {
    slug: string;
    frontmatter: TFrontmatter;
    content: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

async function collectMarkdownFiles(dir: string): Promise<string[]> {
    try {
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        const files: string[] = [];

        for (const dirent of dirents) {
            const fullPath = path.join(dir, dirent.name);
            if (dirent.isDirectory()) {
                const nested = await collectMarkdownFiles(fullPath);
                files.push(...nested);
            } else if (
                dirent.isFile() &&
                dirent.name.toLowerCase().endsWith(".md")
            ) {
                files.push(fullPath);
            }
        }

        return files;
    } catch (error) {
        console.error(`Failed to read content directory "${dir}":`, error);
        return [];
    }
}

async function readMarkdownFile<TFrontmatter extends Record<string, unknown>>(
    filePath: string,
): Promise<MarkdownDocument<TFrontmatter> | null> {
    try {
        const raw = await fs.readFile(filePath, "utf8");
        const { data, content } = matter(raw);
        const slug = path.basename(filePath, path.extname(filePath));

        return {
            slug,
            frontmatter: data as TFrontmatter,
            content: content.trim(),
        };
    } catch (error) {
        console.error(`Failed to read markdown file "${filePath}":`, error);
        return null;
    }
}

export async function loadCollection<
    TFrontmatter extends Record<string, unknown>,
>(collection: CollectionName): Promise<Array<MarkdownDocument<TFrontmatter>>> {
    const collectionRoot = path.join(CONTENT_ROOT, collection);
    const filePaths = await collectMarkdownFiles(collectionRoot);

    if (filePaths.length === 0) {
        return [];
    }

    const documents = await Promise.all(
        filePaths.map((filePath) => readMarkdownFile<TFrontmatter>(filePath)),
    );

    return documents.filter(
        (doc): doc is MarkdownDocument<TFrontmatter> => doc !== null,
    );
}

export async function loadDocumentBySlug<
    TFrontmatter extends Record<string, unknown>,
>(
    collection: CollectionName,
    slug: string,
): Promise<MarkdownDocument<TFrontmatter> | null> {
    const collectionRoot = path.join(CONTENT_ROOT, collection);
    const filePaths = await collectMarkdownFiles(collectionRoot);

    const targetPath = filePaths.find(
        (filePath) => path.basename(filePath, path.extname(filePath)) === slug,
    );

    if (!targetPath) {
        return null;
    }

    return readMarkdownFile<TFrontmatter>(targetPath);
}
