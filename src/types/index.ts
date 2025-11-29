export interface CarouselContentItem {
    _id: string;
    title: string;
    heroImage: string;
    heroImageAlt: string;
    shortDescription: string;
    slug: string;
    buttonText: string;
    imageSource: string;
}

export interface WorkDataItem {
    _id: string;
    title: string;
    slug: string;
    heroImage: string;
    heroImageAlt: string;
    content: string;
    shortDescription: string;
    createdAt: string;
}
