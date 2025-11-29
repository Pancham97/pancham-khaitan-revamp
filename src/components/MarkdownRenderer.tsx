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

export default function MarkdownRenderer({
    content,
    className = "",
}: MarkdownRendererProps) {
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, iframeSchema]]}
                components={{
                    // Custom image renderer with zoom functionality
                    img: ({ src, alt }) => {
                        if (!src) {
                            return null;
                        }
                        return <ImageZoom src={src} alt={alt || ""} />;
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
