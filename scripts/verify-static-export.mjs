import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve();
const outputRoot = path.join(projectRoot, "out");

async function exists(relativePath) {
    try {
        await access(path.join(outputRoot, relativePath));
        return true;
    } catch {
        return false;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

const requiredFiles = [
    "index.html",
    "404.html",
    "about.html",
    "blog.html",
    "contact.html",
    "gear.html",
    "notes.html",
    "now.html",
    "projects.html",
    "updates.html",
    "work.html",
    "feed.xml",
    "search-index.json",
    "sitemap.xml",
    "_headers",
];

for (const file of requiredFiles) {
    assert(await exists(file), `Missing static export file: out/${file}`);
}

assert(!(await exists("tweets.html")), "Removed Tweets page was exported");
assert(!(await exists("tweets")), "Removed Tweets directory was exported");
assert(!(await exists("api")), "Next.js API routes remain in static output");

const rootFiles = await readdir(outputRoot);
const openGraphImage = rootFiles.find((file) =>
    file.startsWith("opengraph-image"),
);
assert(openGraphImage, "Static Open Graph image was not exported");

const openGraphSignature = await readFile(
    path.join(outputRoot, openGraphImage),
);
assert(
    openGraphSignature
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "Static Open Graph image is not a PNG",
);

const searchIndex = JSON.parse(
    await readFile(path.join(outputRoot, "search-index.json"), "utf8"),
);
assert(Array.isArray(searchIndex.items), "Search index has no items array");
assert(searchIndex.items.length > 0, "Search index is empty");
for (const section of ["Blog", "Work", "Notes"]) {
    assert(
        searchIndex.items.some((item) => item.meta === section),
        `Search index has no ${section} items`,
    );
}
assert(
    !searchIndex.items.some(
        (item) =>
            item.label === "Substack" ||
            item.href === "/tweets" ||
            item.href?.startsWith("/api/"),
    ),
    "Search index still exposes a removed or dynamic route",
);

const feed = await readFile(path.join(outputRoot, "feed.xml"), "utf8");
assert(feed.includes("<item>"), "RSS feed contains no items");

const sitemap = await readFile(path.join(outputRoot, "sitemap.xml"), "utf8");
assert(sitemap.includes("/blog/"), "Sitemap contains no blog posts");

const blogFiles = await readdir(path.join(outputRoot, "blog"));
const blogPostFile = blogFiles.find((file) => file.endsWith(".html"));
assert(blogPostFile, "Static export contains no blog post pages");

const blogPostHtml = await readFile(
    path.join(outputRoot, "blog", blogPostFile),
    "utf8",
);
assert(
    blogPostHtml.includes('property="og:image"'),
    `${blogPostFile} has no Open Graph image metadata`,
);
assert(
    blogPostHtml.includes('name="twitter:image"'),
    `${blogPostFile} has no Twitter image metadata`,
);

const contactFormSource = await readFile(
    path.join(projectRoot, "src/app/contact/ContactForm.tsx"),
    "utf8",
);
assert(
    contactFormSource.includes('fetch("/api/contact"'),
    "Contact form is not connected to the Pages Function",
);

const contactFunctionSource = await readFile(
    path.join(projectRoot, "functions/api/contact.ts"),
    "utf8",
);
assert(
    contactFunctionSource.includes("export async function onRequestPost"),
    "Cloudflare contact function has no POST handler",
);

for (const page of ["index.html", "blog.html", "now.html"]) {
    const html = await readFile(path.join(outputRoot, page), "utf8");
    assert(!html.includes('href="/tweets"'), `${page} links to /tweets`);
    assert(
        !html.includes("panchamk.substack.com"),
        `${page} links to Substack`,
    );
}

process.stdout.write(
    `Static export verified: ${requiredFiles.length} required files, ${searchIndex.items.length} search items, feed, sitemap, social metadata, and contact bridge.\n`,
);
