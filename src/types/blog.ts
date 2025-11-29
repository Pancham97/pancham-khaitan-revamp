export interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    content?: string;
    blogDescription: string;
    timeToRead?: string;
    tags: string[];
    createdAt: string;
    updatedAt?: string;
}

export interface BlogInput {
    title: string;
    content: string;
    blogDescription: string;
    tags?: string[];
}

export interface UpdateBlogInput {
    slug?: string;
    title?: string;
    content?: string;
    blogDescription?: string;
    tags?: string[];
}
