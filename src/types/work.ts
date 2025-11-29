export interface IWorkDataPost {
    _id?: string;
    title: string;
    content: string;
    heroImage: string;
    heroImageAlt: string;
    heroImageCaption: string;
    shortDescription: string;
    imageLink?: string | null;
    imageSource?: string | null;
    slug: string;
    context?: string | null;
    skills?: string | null;
    startDateOfWork?: string | null;
    endDateOfWork?: string | null;
    acknowledgements?: string | null;
    isFeatured: boolean;
    createdAt: string;
    isHidden: boolean;
}

export interface IWorkData {
    getOneWorkDataPost: IWorkDataPost;
}

export interface IAllWork {
    slug: string;
    title: string;
}

export interface IAllWorkData {
    getAllWorkData: IWorkDataPost[];
}
