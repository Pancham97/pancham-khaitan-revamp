export interface Note {
    _id: string;
    title: string;
    slug: string;
    content?: string;
    excerpt: string;
    externalUrl?: string | null;
    isExternal: boolean;
    createdAt: string;
    updatedAt: string;
}
