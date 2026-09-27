import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { SITE } from "@/data/site";

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
    display: "swap",
});

const commitMono = localFont({
    src: "../fonts/CommitMono-VF.woff2",
    variable: "--font-commit-mono",
    weight: "200 700",
    display: "swap",
});

const siteDescription = SITE.description;

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
            className={`
              ${geist.variable}
              ${commitMono.variable}
            `}
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
