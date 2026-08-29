import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const sourceSerif = Source_Serif_4({
    subsets: ["latin"],
    variable: "--font-source-serif",
    display: "swap",
});

const siteDescription =
    "Software engineer at SingleStore. Also sings Hindustani classical, plays keys, and clicks photos on evening walks.";

export const metadata: Metadata = {
    metadataBase: new URL("https://panchamkhaitan.com"),
    title: {
        default: "Pancham Khaitan",
        template: "%s | Pancham Khaitan",
    },
    description: siteDescription,
    alternates: {
        canonical: "/",
        types: {
            "application/rss+xml": "/feed.xml",
        },
    },
    openGraph: {
        title: "Pancham Khaitan",
        description: siteDescription,
        url: "/",
        siteName: "Pancham Khaitan",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Pancham Khaitan",
        description: siteDescription,
        creator: "@PanchamKhaitan",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
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
            className={sourceSerif.variable}
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
