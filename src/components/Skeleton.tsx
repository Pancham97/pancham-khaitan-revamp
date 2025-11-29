import React from "react";

interface SkeletonProps {
    className?: string;
    variant?: "text" | "rectangular" | "circular";
    width?: string | number;
    height?: string | number;
    animation?: "pulse" | "wave";
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = "",
    variant = "text",
    width = "100%",
    height = "auto",
    animation = "pulse",
}) => {
    const baseClass = "skeleton";
    const variantClass = `skeleton-${variant}`;
    const animationClass = `skeleton-${animation}`;

    const style: React.CSSProperties = {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
    };

    return (
        <div
            className={`
              ${baseClass}
              ${variantClass}
              ${animationClass}
              ${className}
            `}
            style={style}
        />
    );
};

export const SkeletonCard: React.FC = () => {
    return (
        <div className="skeleton-card">
            <Skeleton
                variant="rectangular"
                height={250}
                className="skeleton-card-image"
            />
            <div className="skeleton-card-content">
                <Skeleton
                    variant="text"
                    height={24}
                    className="skeleton-card-title"
                />
                <Skeleton variant="text" height={16} />
                <Skeleton variant="text" height={16} width="80%" />
            </div>
        </div>
    );
};

export const HomepageSkeleton: React.FC = () => {
    return (
        <div className="homepage-skeleton">
            {/* Hero Section Skeleton */}
            <section className="hero">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <Skeleton
                                variant="text"
                                height={40}
                                className="mb-3"
                            />
                            <Skeleton
                                variant="text"
                                height={40}
                                width="90%"
                                className="mb-3"
                            />
                            <Skeleton variant="text" height={40} width="70%" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Carousel Section Skeleton */}
            <section className="carousel-skeleton">
                <Skeleton variant="rectangular" height={600} />
            </section>

            {/* Work Section Skeleton */}
            <section className="homepage-card">
                <div className="container">
                    <div className="row">
                        <Skeleton
                            variant="text"
                            height={32}
                            width={200}
                            className="section-title-skeleton"
                        />
                    </div>
                    <div className="work-grid">
                        {[1, 2, 3, 4].map((index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                    <div className="row justify-content-end mt-4">
                        <Skeleton variant="text" height={20} width={150} />
                    </div>
                </div>
            </section>
        </div>
    );
};
