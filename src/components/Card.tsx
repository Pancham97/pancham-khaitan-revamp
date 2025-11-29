import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CardProps {
    imagePath?: string;
    altText?: string;
    title: string;
    description: string;
    url: string;
}

const Card: React.FC<CardProps> = ({
    imagePath,
    altText,
    title,
    description,
    url,
}) => {
    return (
        <div className="card">
            <Link href={url} className="block h-full no-underline group">
                <div className="relative h-full">
                    {imagePath && (
                        <>
                            <div className="absolute inset-0">
                                <Image
                                    src={imagePath}
                                    alt={altText || title}
                                    fill
                                    className="card-image"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{
                                        objectFit: "cover",
                                        objectPosition: "center",
                                    }}
                                />
                            </div>
                            <div className="card-overlay" />
                        </>
                    )}
                    <div className="card-content">
                        <h2 className="card-main-title">{title}</h2>
                        <p className="card-description">{description}</p>
                        <div className="card-link">View Project</div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Card;
