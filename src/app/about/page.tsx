import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Pancham Khaitan",
    description:
        "About Pancham Khaitan — software engineer focused on simple, fast, human tools.",
};

export default function AboutPage() {
    return (
        <div>
            <header className="mb-8">
                <h1 className="big-headline-text">About</h1>
                <p
                    className={`
                      text-neutral-700
                      dark:text-neutral-600
                      max-w-2xl measure lede
                    `}
                >
                    I’m a software engineer who likes building clear, fast,
                    human tools — and I sing for joy. I care about simple
                    interfaces and thoughtful systems.
                </p>
            </header>

            <div className="space-y-5 max-w-2xl measure">
                <p>
                    I grew up in Surat, India and studied Information Technology
                    at Birla Vishvakarma Mahavidyalaya. Over the years I’ve
                    worked across product and platform work, with a bias toward
                    shipping and craftsmanship.
                </p>
                <p>
                    Highlights include leading and contributing to data products
                    at Peak AI, and now building at SingleStore. I enjoy the
                    quiet work of making complex things feel simple.
                </p>
                <p>
                    When I’m not at the editor, I’m usually singing, reading, or
                    hiking. I like conversations about design, engineering, and
                    the craft of building.
                </p>
                <p>
                    If you’re exploring something interesting, I’d love to hear
                    from you.
                </p>
            </div>

            <div className="mt-8">
                <a
                    href="mailto:hello@panchamkhaitan.com"
                    className="see-more-link"
                >
                    Email me →
                </a>
            </div>
        </div>
    );
}
