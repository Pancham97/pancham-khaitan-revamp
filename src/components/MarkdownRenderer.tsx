import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import ImageZoom from "./ImageZoom";
import MarkdownLink from "./MarkdownLink";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

type MarkdownAstNode = {
    type?: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    children?: MarkdownAstNode[];
};

function isElementNode(node: unknown): node is MarkdownAstNode {
    return Boolean(
        node &&
            typeof node === "object" &&
            "type" in node &&
            (node as MarkdownAstNode).type === "element",
    );
}

const iframeSchema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || []), "iframe"],
    attributes: {
        ...(defaultSchema.attributes || {}),
        iframe: [
            "src",
            "width",
            "height",
            "title",
            "allow",
            "allowfullscreen",
            "frameborder",
            "referrerpolicy",
            "loading",
        ],
    },
};

function markImagesInsideLinks() {
    return (tree: MarkdownAstNode) => {
        const visit = (node: MarkdownAstNode, insideLink: boolean) => {
            const nodeIsLink = node.type === "element" && node.tagName === "a";
            if (
                insideLink &&
                node.type === "element" &&
                node.tagName === "img"
            ) {
                node.properties = {
                    ...(node.properties || {}),
                    dataLinkedImage: "true",
                };
            }

            node.children?.forEach((child) => {
                visit(child, insideLink || nodeIsLink);
            });
        };

        visit(tree, false);
    };
}

function isLinkedImageNode(node: unknown) {
    if (!isElementNode(node)) {
        return false;
    }

    return node.properties?.dataLinkedImage === "true";
}

export default function MarkdownRenderer({
    content,
    className = "",
}: MarkdownRendererProps) {
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                    rehypeRaw,
                    [rehypeSanitize, iframeSchema],
                    markImagesInsideLinks,
                ]}
                components={{
                    // Custom image renderer with zoom functionality
                    img: ({ src, alt, node }) => {
                        if (typeof src !== "string") {
                            return null;
                        }

                        const imageSrc = src.trim();
                        if (!imageSrc) {
                            return null;
                        }

                        return (
                            <ImageZoom
                                src={imageSrc}
                                alt={typeof alt === "string" ? alt : ""}
                                sizes="(min-width: 768px) 720px, calc(100vw - 2rem)"
                                zoomable={!isLinkedImageNode(node)}
                            />
                        );
                    },
                    // Custom link renderer (external links open in new tab)
                    a: ({ href, children }) => {
                        if (!href) {
                            return <span>{children}</span>;
                        }

                        return (
                            <MarkdownLink href={href}>{children}</MarkdownLink>
                        );
                    },
                    iframe: (props) => (
                        <div
                            style={{
                                position: "relative",
                                paddingBottom: "56.25%",
                                height: 0,
                            }}
                        >
                            <iframe
                                {...props}
                                loading="lazy"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: 0,
                                }}
                            />
                        </div>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
