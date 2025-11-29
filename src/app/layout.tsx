import type { Metadata } from "next";
import "./globals.css";
import MinimalLayout from "@/components/MinimalLayout";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
    title: "Pancham Khaitan",
    description:
        "Pancham Khaitan is a software engineer who likes making things. He is also fond of music.",
    openGraph: {
        title: "Pancham Khaitan",
        description:
            "Pancham Khaitan is a software engineer who likes making things. He is also fond of music.",
        url: "https://panchamkhaitan.com",
        images: [
            {
                url: "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Pancham Khaitan",
        description:
            "Pancham Khaitan is a software engineer who likes making things. He is also fond of music.",
        images: [
            "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
        ],
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            data-theme="light"
            style={{ colorScheme: "light" }}
            className={`
              ${GeistSans.variable}
              ${GeistMono.variable}
            `}
        >
            <head>
                <meta name="color-scheme" content="light" />
                {/* Prevent theme flash: set initial theme before hydration */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: "(() => { try { const root = document.documentElement; const meta = document.querySelector('meta[name=\"color-scheme\"]'); const apply = (value) => { const theme = value === 'dark' ? 'dark' : 'light'; root.classList.toggle('dark', theme === 'dark'); root.setAttribute('data-theme', theme); root.style.colorScheme = theme; if (meta) { meta.setAttribute('content', theme); } try { localStorage.setItem('theme', theme); } catch(_) {} }; const stored = localStorage.getItem('theme'); apply(stored === 'dark' ? 'dark' : 'light'); window.__setTheme = apply; } catch(_) {} })();",
                    }}
                />
            </head>
            <body className="antialiased">
                <MinimalLayout>{children}</MinimalLayout>
            </body>
        </html>
    );
}
