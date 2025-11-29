import Link from "next/link";

export default function MinimalFooter() {
    const year = new Date().getFullYear();
    return (
        <footer
            className={`
              border-t border-neutral-200
              dark:border-neutral-800
              mt-12
            `}
        >
            <div
                className={`
                  mx-auto w-full max-w-3xl py-8 text-sm text-neutral-600
                  dark:text-neutral-300
                  flex flex-col gap-2
                  md:flex-row md:items-center md:justify-between
                `}
            >
                <p>© {year} Pancham Khaitan</p>
                <nav aria-label="Footer" className="flex gap-4">
                    <Link
                        className={`
                          hover:underline
                          underline-offset-4
                        `}
                        href="/about"
                    >
                        About
                    </Link>
                    <a
                        className={`
                          hover:underline
                          underline-offset-4
                        `}
                        href="mailto:hello@panchamkhaitan.com"
                    >
                        Email
                    </a>
                    <a
                        className={`
                          hover:underline
                          underline-offset-4
                        `}
                        target="_blank"
                        rel="noreferrer"
                        href="https://github.com/Pancham97"
                    >
                        GitHub
                    </a>
                    <a
                        className={`
                          hover:underline
                          underline-offset-4
                        `}
                        target="_blank"
                        rel="noreferrer"
                        href="https://linkedin.com/in/panchamkhaitan/"
                    >
                        LinkedIn
                    </a>
                    <a
                        className={`
                          hover:underline
                          underline-offset-4
                        `}
                        target="_blank"
                        rel="noreferrer"
                        href="https://v0.panchamkhaitan.com"
                    >
                        Old site (v0)
                    </a>
                </nav>
            </div>
        </footer>
    );
}
