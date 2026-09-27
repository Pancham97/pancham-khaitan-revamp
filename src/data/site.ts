/**
 * Central site content for the modern-minimal personal site.
 * Edit here to update career, projects, gear, and socials.
 */

export const SITE = {
    name: "Pancham Khaitan",
    handle: "@PanchamKhaitan",
    title: "Software Engineering Manager",
    org: "SingleStore",
    /** Default meta description */
    description:
        "Software engineering manager at SingleStore. I make Steno and Sunchay, study Hindustani classical music, and take photos on evening walks.",
    orgHref: "https://www.singlestore.com/",
    heliosHref: "https://www.singlestore.com/cloud/",
    auraAnalystHref: "https://www.singlestore.com/ai/aura-analyst/",
    email: "hello@panchamkhaitan.com",
    location: "India",
} as const;

export const SOCIALS = [
    {
        label: "X",
        href: "https://x.com/PanchamKhaitan",
        external: true,
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/pancham.khaitan/",
        external: true,
    },
    {
        label: "GitHub",
        href: "https://github.com/Pancham97",
        external: true,
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/panchamkhaitan/",
        external: true,
    },
    {
        label: "Email",
        href: "mailto:hello@panchamkhaitan.com",
        external: false,
    },
] as const;

export const INSTAGRAM = {
    handle: "@pancham.khaitan",
    href: "https://www.instagram.com/pancham.khaitan/",
} as const;

export type SiteSection = {
    href: string;
    label: string;
    hint: string;
    key: string;
};

/**
 * Primary nav — only what belongs on every page.
 * Secondary routes stay reachable via Cmd+K, footer, and in-page links.
 */
export const SECTIONS: SiteSection[] = [
    {
        href: "/work",
        label: "Work",
        hint: "Jobs and case studies",
        key: "w",
    },
    {
        href: "/blog",
        label: "Blog",
        hint: "Writing archive",
        key: "b",
    },
    {
        href: "/notes",
        label: "Notes",
        hint: "Study notes and scraps",
        key: "n",
    },
    {
        href: "/about",
        label: "About",
        hint: "Bio and photos",
        key: "a",
    },
    {
        href: "/contact",
        label: "Contact",
        hint: "Say hi",
        key: "c",
    },
];

/** Still public; not in the top nav. Used by sitemap and Cmd+K. */
export const SECONDARY_SECTIONS: SiteSection[] = [
    {
        href: "/projects",
        label: "Projects",
        hint: "Products, photos, music",
        key: "p",
    },
    {
        href: "/gear",
        label: "Gear",
        hint: "What I actually use",
        key: "e",
    },
    {
        href: "/now",
        label: "Now",
        hint: "What I am focused on",
        key: "o",
    },
];

/** @deprecated Use SECTIONS — kept for any legacy imports */
export const NAV = SECTIONS;
export const INDEX_MAP = SECTIONS;

/** Primary career track. Case studies live in content/work. */
export const CAREER = [
    {
        org: "SingleStore",
        orgHref: "https://www.singlestore.com/",
        period: "Sep 2023 — now",
        roles: [
            { title: "Software Engineering Manager", period: "Sep 2026 — now" },
            { title: "Software Engineer", period: "Sep 2023 — Sep 2026" },
        ],
        summary:
            "Joined as an engineer on Helios (managed SingleStore) and Aura Analyst: data loading in the UI, a 5× faster Command+K, and tools that help people write SQL. Since September 2026 I manage a team of engineers.",
        highlights: [
            {
                title: "Helios",
                href: "/work/helios",
            },
            {
                title: "Aura Analyst",
                href: "/work/aura-analyst",
            },
            {
                title: "Data loading UI",
                href: "https://www.singlestore.com/blog/easy-data-loading-experience-through-ui-in-singlestore-helios-/",
            },
            {
                title: "Command+K, 5× faster",
                href: "https://www.singlestore.com/blog/enhancing-productivity-how-we-made-command-k-search-more-than-5x-faster/",
            },
            {
                title: "SQrL code generator",
                href: "https://www.singlestore.com/blog/introducing-sqrl-code-generator/",
            },
        ],
    },
    {
        org: "Peak AI",
        orgHref: "https://peak.ai/",
        period: "Sep 2021 — Sep 2023",
        roles: [{ title: "Software Engineer", period: "Sep 2021 — Sep 2023" }],
        summary: "Data products for decision intelligence.",
        highlights: [
            {
                title: "Peak interview",
                href: "https://peak.ai/hub/blog/pancham-khaitan-software-engineer-at-peak/",
            },
        ],
    },
    {
        org: "Cybage",
        orgHref: "https://www.cybage.com/",
        period: "Jul 2018 — Sep 2021",
        roles: [
            {
                title: "Software Engineer · Google Brand Studio",
                period: "Jul 2018 — Sep 2021",
            },
        ],
        summary:
            "Google for Startups platform and Glue, a TypeScript library used on a lot of marketing sites.",
        highlights: [
            {
                title: "Google for Startups",
                href: "/work/google-for-startups",
            },
            {
                title: "Glue library",
                href: "/work/google-at-cybage",
            },
        ],
    },
] as const;

/** Products and creative work outside the day job. */
export const PROJECTS = [
    {
        title: "Sunchay",
        description:
            "A memory you can text. Send links, screenshots, and notes from WhatsApp or the browser, then ask for them back in your own words.",
        href: "https://sunchay.com",
        kind: "product",
    },
    {
        title: "Steno",
        description:
            "Local Mac dictation. Hold to talk. It honestly made me more productive. Speech is fast, clarifies thought, and warms up the voice for music. All local, private.",
        href: "https://apps.apple.com/in/app/steno-dictation/id6762076728?mt=12",
        kind: "product",
    },
    {
        title: "Jaipur wallpaper pack",
        description: "Photos from Jaipur. Hawa Mahal light and all that.",
        href: "https://panchamkhaitan.gumroad.com/l/hawa-mahal-wallpaper",
        kind: "photography",
    },
    {
        title: "Andaman wallpaper pack",
        description: "Photos from the Andaman Islands. Nice on a desktop.",
        href: "https://panchamkhaitan.gumroad.com/l/andaman-islands-wallpaper-pack",
        kind: "photography",
    },
    {
        title: "River Flows in You",
        description:
            "Piano cover. I recorded it because the melody would not leave my head.",
        href: "https://on.soundcloud.com/YSrZ6G6tOagHFqYLuc",
        kind: "music",
    },
] as const;

/** Jump targets for ⌘K and search (product / org aliases). */
export const SEARCH_ALIASES = [
    {
        label: "Redesigning this site with Grok",
        href: "/blog/redesigning-this-site-with-grok",
        meta: "Blog",
        keywords: ["grok", "redesign", "hacker news", "dossier", "ai"],
    },
    {
        label: "Helios",
        href: "/work/helios",
        meta: "Work",
        keywords: ["helios", "managed service", "singlestore cloud"],
    },
    {
        label: "Aura Analyst",
        href: "/work/aura-analyst",
        meta: "Work",
        keywords: ["aura", "analyst", "agents", "intelligence"],
    },
    {
        label: "SingleStore",
        href: "https://www.singlestore.com/",
        meta: "External",
        external: true,
        keywords: ["singlestore", "s2"],
    },
    {
        label: "Steno",
        href: "https://apps.apple.com/in/app/steno-dictation/id6762076728?mt=12",
        meta: "Projects",
        external: true,
        keywords: ["steno", "dictation"],
    },
    {
        label: "Sunchay",
        href: "https://sunchay.com",
        meta: "Projects",
        external: true,
        keywords: ["sunchay"],
    },
    {
        label: "RSS",
        href: "/feed.xml",
        meta: "Follow",
        keywords: ["rss", "feed", "subscribe"],
    },
] as const;

export type GearItem = {
    name: string;
    category: string;
    note: string;
    href?: string | null;
    image?: string | null;
};

/**
 * Gear list. Images under /public/gear; product links when available.
 */
export const GEAR: GearItem[] = [
    {
        name: 'MacBook Pro 14" M3 Pro',
        category: "Computer",
        note: "Daily driver. Where almost everything gets done.",
        href: "https://www.apple.com/macbook-pro/",
        image: "/gear/mbp.jpg",
    },
    {
        name: "LG 27UP850K-W",
        category: "Display",
        note: "27-inch 4K. USB-C when I am at a real desk.",
        href: "https://www.lg.com/in/monitors/uhd-4k-5k/27up850k-w/",
        image: "/gear/lg.jpg",
    },
    {
        name: 'iPad Pro 11" M2',
        category: "Tablet",
        note: "Reading, notes, music PDFs.",
        href: "https://www.apple.com/ipad-pro/",
        image: "/gear/ipad.jpg",
    },
    {
        name: "iPhone 17 Pro",
        category: "Phone",
        note: "Phone. Also the camera for evening walks.",
        href: "https://www.apple.com/iphone/",
        image: "/gear/iphone.jpg",
    },
    {
        name: "Apple Watch",
        category: "Wearable",
        note: "Day to day. Walks and timers.",
        href: "https://www.apple.com/watch/",
        image: "/gear/watch.jpg",
    },
    {
        name: "Seiko 5 Sports SRPL79",
        category: "Watch",
        note: "Mechanical. Nice when I do not want another screen on my wrist.",
        href: "https://www.seikowatches.com/us-en/products/5sports/srpl79",
        image: "/gear/seiko.webp",
    },
    {
        name: "AirPods Pro",
        category: "Audio",
        note: "Wireless. Focus and commute.",
        href: "https://www.apple.com/airpods-pro/",
        image: "/gear/airpods.jpg",
    },
    {
        name: "EarPods",
        category: "Audio",
        note: "Wired. When I am done charging things.",
        href: "https://www.apple.com/shop/product/MNHF2AM/A/earpods-with-3-5-mm-headphone-plug",
        image: "/gear/earpods.jpg",
    },
    {
        name: "Magic Keyboard",
        category: "Input",
        note: "Desk keyboard. Touch ID is lovely.",
        href: "https://www.apple.com/shop/product/MK2A3LL/A/magic-keyboard-with-touch-id-and-numeric-keypad-for-mac-models-with-apple-silicon-us-english-black-keys",
        image: "/gear/magic-keyboard.jpg",
    },
    {
        name: "Magic Trackpad",
        category: "Input",
        note: "Desk. Gestures > mouse for me.",
        href: "https://www.apple.com/shop/product/MK2D3AM/A/magic-trackpad-black-multi-touch-surface",
        image: "/gear/trackpad.jpg",
    },
    {
        name: "BenQ ScreenBar",
        category: "Light",
        note: "Monitor light bar. Better than a harsh room light at night.",
        href: "https://www.benq.com/en-us/lighting/monitor-light/screenbar.html",
        image: "/gear/benq.jpg",
    },
    {
        name: "DailyObjects desk mat",
        category: "Desk",
        note: "Tan turf mat. Soft, and hides the mess under it.",
        href: "https://www.dailyobjects.com/turf-vegan-leather-desk-mat-tan/dp?f=pid~TURF-LETHER-DESK-MAT-TAN",
        image: "/gear/deskmat.webp",
    },
    {
        name: "Casio CTK-850IN",
        category: "Music",
        note: "61-key. Indian tones. Practice and covers.",
        href: "http://arch.casio-intl.com/asia-mea/en/emi/localized/ctk850in/spec/",
        image: "/gear/casio.jpg",
    },
    {
        name: "macOS",
        category: "OS",
        note: "Primary OS on the MacBook.",
        href: "https://www.apple.com/macos/",
        image: null,
    },
    {
        name: "Omarchy",
        category: "OS",
        note: "Linux on an external SSD. Fun to tinker without dual-boot drama.",
        href: "/blog/install-omarchy-on-ssd",
        image: null,
    },
    {
        name: "Ubuntu",
        category: "OS",
        note: "Boring reliable Linux when I need it.",
        href: "https://ubuntu.com/",
        image: null,
    },
    {
        name: "tmux",
        category: "Software",
        note: "Terminal sessions that survive me closing things by accident.",
        href: "https://github.com/tmux/tmux",
        image: null,
    },
    {
        name: "Cursor",
        category: "Software",
        note: "Editor. Agents in the loop. My mind is still a bit blown.",
        href: "https://cursor.com",
        image: "/gear/cursor.jpg",
    },
    {
        name: "Steno",
        category: "Software",
        note: "My dictation app. Local, private, hold-to-talk.",
        href: "https://apps.apple.com/in/app/steno-dictation/id6762076728?mt=12",
        image: null,
    },
];

export const NOW = {
    updated: "2026-09-27",
    items: [
        "New role: Software Engineering Manager at SingleStore, since early September.",
        "Sunchay and Steno, both shipped and in daily use.",
        "Hindustani classical, year 3 of 7.",
        "Evening walks with a camera. A quieter version of this site.",
    ],
} as const;

/** Primary follow path for local writing. */
export const FOLLOW = [
    { label: "RSS", href: "/feed.xml", external: false },
] as const;

/** Portrait / life photos used on index and about. Prefer compressed WebP. */
export const PHOTOS = {
    cover: {
        src: "/images/pancham-cover.webp",
        /** JPEG fallback for environments without WebP (rare) */
        srcJpg: "/images/pancham-cover.jpg",
        alt: "Pancham Khaitan smiling in warm light",
        width: 960,
        height: 1200,
    },
    swiss: {
        src: "/images/pancham-khaitan-about-swiss.webp",
        alt: "Pancham overlooking a Swiss lakeside town and mountains",
    },
    jaipur: {
        src: "/images/pancham-in-jaipur.webp",
        alt: "Pancham at Hawa Mahal in Jaipur at golden hour",
    },
    peak: {
        src: "/images/pancham-at-peak3000.webp",
        alt: "Pancham at Peak",
    },
} as const;

/** Travel / life photos for About (not the cover). */
export const TRAVEL_PHOTOS = [
    PHOTOS.swiss,
    PHOTOS.jaipur,
    PHOTOS.peak,
] as const;

/** Music callout + SoundCloud player on homepage. */
export const FEATURED_MUSIC = {
    title: "River Flows in You",
    blurb: "Piano cover. The melody stuck in my head so I just recorded it.",
    href: "https://soundcloud.com/pancham-khaitan/river-flows-in-you-yiruma-cover",
    meta: "Piano · SoundCloud",
    /** Compact player — hit play right on the site */
    embedSrc:
        "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/pancham-khaitan/river-flows-in-you-yiruma-cover&color=%23a86b3c&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
} as const;

/**
 * Visual work proof on homepage + case study heroes.
 * Local assets under public/work (from SingleStore product write-ups).
 */
export const WORK_PROOFS = [
    {
        title: "Helios · data loading",
        blurb: "UI to get data into SingleStore without the pain.",
        href: "/work/helios",
        image: "/work/helios-data-loading.jpg",
        imageAlt: "SingleStore Helios data loading UI",
    },
    {
        title: "Command+K · 5× faster",
        blurb: "Search that keeps up when you are in flow.",
        href: "https://www.singlestore.com/blog/enhancing-productivity-how-we-made-command-k-search-more-than-5x-faster/",
        image: "/work/command-k.jpg",
        imageAlt: "Command+K search performance work",
        external: true,
    },
    {
        title: "Aura Analyst",
        blurb: "Natural language in, insight you can trust out.",
        href: "/work/aura-analyst",
        image: "/work/aura-analyst.jpg",
        imageAlt: "Aura Analyst product",
    },
] as const;

/** Study notes / credentials (also in content/notes). */
export const CREDENTIALS = [
    {
        title: "AWS Solutions Architect — Associate",
        note: "Notes",
        href: "https://panchamkhaitan.notion.site/AWS-Solutions-Architect-Associate-a0db360592a941b9902598ed90573ac2?pvs=4",
    },
    {
        title: "Snowflake SnowPro Core",
        note: "Notes",
        href: "https://panchamkhaitan.notion.site/Snowflake-SnowPro-Core-Certification-7cd68dbf98b141149301fcb1032e2b23?pvs=4",
    },
] as const;
