import { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
    title: "Contact Pancham Khaitan",
    description:
        "Pancham Khaitan is a software engineer who likes making things. He is also fond of music.",
    openGraph: {
        title: "Contact Pancham Khaitan",
        description:
            "Pancham Khaitan is a software engineer who likes making things. He is also fond of music.",
        images: [
            {
                url: "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
                width: 1200,
                height: 630,
            },
        ],
        url: "https://panchamkhaitan.com/contact",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Pancham Khaitan",
        description:
            "Pancham Khaitan is a software engineer who likes making things. He is also fond of music.",
        images: [
            "https://pancham-khaitan.s3.ap-south-1.amazonaws.com/portfolio/images/a57c22de-2b23-458f-8c9f-3d9514e87d93.jpg",
        ],
    },
};

export default function ContactPage() {
    return <ContactForm />;
}
