/**
 * Central site content for the modern-minimal personal site.
 * Edit here to update career, projects, gear, tweets, and socials.
 */

export const SITE = {
    name: "Pancham Khaitan",
    handle: "@PanchamKhaitan",
    title: "Software engineer",
    org: "SingleStore",
    orgHref: "https://www.singlestore.com/",
    heliosHref: "https://www.singlestore.com/cloud/",
    auraAnalystHref: "https://www.singlestore.com/ai/aura-analyst/",
    email: "hello@panchamkhaitan.com",
    /** Human-first one-liner for social cards and meta */
    tagline:
        "I build software. I also sing Hindustani classical, play keys, and click photos on evening walks.",
    /** Product/context line used where a second sentence helps */
    workLine:
        "Right now I work on Helios and Aura Analyst at SingleStore.",
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
        label: "Substack",
        href: "https://panchamk.substack.com",
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
        hint: "Side stuff I built",
        key: "p",
    },
    {
        href: "/gear",
        label: "Gear",
        hint: "What I actually use",
        key: "e",
    },
    {
        href: "/tweets",
        label: "Tweets",
        hint: "Recent posts from X",
        key: "t",
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
        role: "Software Engineer",
        period: "2023 — present",
        summary:
            "I build Helios (managed SingleStore) and Aura Analyst. Things like data loading in the UI, making Command+K way faster, and tools that help people write SQL.",
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
        role: "Software Engineer",
        period: "2021 — 2023",
        summary: "Data products for decision intelligence.",
        highlights: [
            {
                title: "Peak interview",
                href: "https://peak.ai/hub/blog/pancham-khaitan-software-engineer-at-peak/",
            },
        ],
    },
    {
        org: "Google (contractor)",
        role: "Cybage / Google Brand Studio",
        period: "2018 — 2021",
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

export type ProjectStatus = "building" | "shipped" | "paused";

/** Side projects, creative work, experiments outside the main job. */
export const PROJECTS = [
    {
        title: "Sunchay",
        status: "building" as const,
        description:
            "A side product I am shaping in public. Early, private, and not ready for a landing page yet — progress lives on the X account.",
        href: "https://x.com/SunchayApp",
        kind: "product",
    },
    {
        title: "Steno",
        status: "shipped" as const,
        description:
            "Local Mac dictation. Hold to talk. It honestly made me more productive. Speech is fast, clarifies thought, and warms up the voice for music. All local, private.",
        href: "https://apps.apple.com/in/app/steno-dictation/id6762076728?mt=12",
        kind: "product",
    },
    {
        title: "Varta",
        status: "shipped" as const,
        description:
            "Excel sheet to WhatsApp messages. For when you live in spreadsheets and group chats.",
        href: "https://varta.work",
        kind: "product",
    },
    {
        title: "Jaipur wallpaper pack",
        status: "shipped" as const,
        description: "Photos from Jaipur. Hawa Mahal light and all that.",
        href: "https://panchamkhaitan.gumroad.com/l/hawa-mahal-wallpaper",
        kind: "photography",
    },
    {
        title: "Andaman wallpaper pack",
        status: "shipped" as const,
        description: "Photos from the Andaman Islands. Nice on a desktop.",
        href: "https://panchamkhaitan.gumroad.com/l/andaman-islands-wallpaper-pack",
        kind: "photography",
    },
    {
        title: "River Flows in You",
        status: "shipped" as const,
        description:
            "Piano cover. I recorded it because the melody would not leave my head.",
        href: "https://on.soundcloud.com/YSrZ6G6tOagHFqYLuc",
        kind: "music",
    },
] as const;

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
    building: "Building",
    shipped: "Shipped",
    paused: "Paused",
};

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
        label: "Varta",
        href: "https://varta.work",
        meta: "Projects",
        external: true,
        keywords: ["varta", "whatsapp"],
    },
    {
        label: "Sunchay",
        href: "https://x.com/SunchayApp",
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
    {
        label: "Substack",
        href: "https://panchamk.substack.com",
        meta: "Follow",
        external: true,
        keywords: ["substack", "newsletter", "subscribe", "writing"],
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
        name: "MacBook Pro 14\" M3 Pro",
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
        name: "iPad Pro 11\" M2",
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

export type TweetItem = {
    id: string;
    date: string;
    text: string;
    href: string;
    /** Optional image/video poster for the row media cell */
    image?: string | null;
};

/**
 * Curated fallback if live X/RSS is unavailable.
 * Prefer live via getTweets() (Nitter RSS or TWITTER_BEARER_TOKEN).
 */
export const TWEETS: TweetItem[] = [
    {
        id: "2077813873890202034",
        date: "2026-07-16",
        text: "Grok 4.5 is soooo fast and intelligent! I am rebuilding my personal site with it. So fun to prototype with it. Lovely!",
        href: "https://x.com/PanchamKhaitan/status/2077813873890202034",
    },
    {
        id: "2077410003405914232",
        date: "2026-07-15",
        text: "Clicked this today on my evening walk.",
        href: "https://x.com/PanchamKhaitan/status/2077410003405914232",
        image: "https://pbs.twimg.com/media/HNRxYiqaoAAFeFF.jpg",
    },
    {
        id: "2076236177594785808",
        date: "2026-07-12",
        text: "Calling them customers is so much better than calling them users. Makes you want to do more to give a good experience.",
        href: "https://x.com/PanchamKhaitan/status/2076236177594785808",
    },
    {
        id: "2075848891136983410",
        date: "2026-07-11",
        text: "I find myself brainstorming more with GPT 5.6 Sol. It's amazing how much clearer I feel because the model just gets me.",
        href: "https://x.com/PanchamKhaitan/status/2075848891136983410",
    },
    {
        id: "2075184898030350781",
        date: "2026-07-09",
        text: "Okay, I tried Cursor Cloud Agents today and my mind is blown.",
        href: "https://x.com/PanchamKhaitan/status/2075184898030350781",
    },
    {
        id: "2075127166162158075",
        date: "2026-07-09",
        text: "I have been using Steno to type and it honestly has made me so productive. Speech is fast, clarifies thought, and warms up the voice for music. All local, private.",
        href: "https://x.com/PanchamKhaitan/status/2075127166162158075",
    },
];

export const NOW = {
    updated: "2026-07-26",
    items: [
        "Helios and Aura Analyst at SingleStore.",
        "Shaping Sunchay in public (early).",
        "Hindustani classical, year 3 of 7.",
        "Steno for dictation. Evening walks. This site, redesigned toward modern minimal.",
    ],
} as const;

/** Primary follow paths — RSS + writing stream. */
export const FOLLOW = [
    { label: "RSS", href: "/feed.xml", external: false },
    {
        label: "Substack",
        href: "https://panchamk.substack.com",
        external: true,
    },
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

/** Featured side project callout on the homepage. */
export const FEATURED_PROJECT = {
    title: "Steno",
    blurb:
        "I have been using Steno to type and it honestly has made me so productive. Speech is fast, clarifies thought, and warms up the voice for music. All local, private.",
    href: "https://apps.apple.com/in/app/steno-dictation/id6762076728?mt=12",
    meta: "Shipped · Mac",
} as const;

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
