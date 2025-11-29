export default function MarkdownLink({
    href,
    children,
}: {
    href?: string;
    children?: React.ReactNode;
}) {
    if (!href) {
        return <a>{children}</a>;
    }

    // Check if the link is external
    const isExternal =
        href.startsWith("http://") || href.startsWith("https://");
    const isCurrentDomain =
        isExternal &&
        (href.includes("panchamkhaitan.com") || href.includes("localhost"));

    if (isExternal && !isCurrentDomain) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }

    return <a href={href}>{children}</a>;
}
