import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { GeistMono } from "geist/font/mono";

const defaultOg = "https://panchamkhaitan.com/api/og?title=Pancham%20Khaitan";

const siteDescription =
    "Software engineer at SingleStore. Also sings Hindustani classical, plays keys, and clicks photos on evening walks.";

export const metadata: Metadata = {
    title: {
        default: "Pancham Khaitan",
        template: "%s | Pancham Khaitan",
    },
    description: siteDescription,
    alternates: {
        types: {
            "application/rss+xml": "https://panchamkhaitan.com/feed.xml",
        },
    },
    openGraph: {
        title: "Pancham Khaitan",
        description: siteDescription,
        url: "https://panchamkhaitan.com",
        siteName: "Pancham Khaitan",
        images: [
            {
                url: defaultOg,
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Pancham Khaitan",
        description: siteDescription,
        images: [defaultOg],
        creator: "@PanchamKhaitan",
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
            className={GeistMono.variable}
        >
            <head>
                <meta name="color-scheme" content="light" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: "(()=>{try{const r=document.documentElement,m=document.querySelector('meta[name=\"color-scheme\"]');const a=v=>{const t=v==='dark'?'dark':'light';r.classList.toggle('dark',t==='dark');r.setAttribute('data-theme',t);r.style.colorScheme=t;if(m)m.setAttribute('content',t);try{localStorage.setItem('theme',t)}catch(e){}};a(localStorage.getItem('theme')==='dark'?'dark':'light');window.__setTheme=a}catch(e){}})();",
                    }}
                />
            </head>
            <body>
                <SiteChrome>{children}</SiteChrome>
            </body>
        </html>
    );
}
