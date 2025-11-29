export interface SiteUpdate {
    _id: string;
    title: string;
    snippet?: string;
    linkUrl?: string;
    linkLabel?: string;
    kind?: "blog" | "life" | "photo" | "work" | "misc";
    isHidden?: boolean;
    createdAt: string;
    updatedAt: string;
}
