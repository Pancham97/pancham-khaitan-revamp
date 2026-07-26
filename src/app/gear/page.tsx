import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GEAR } from "@/data/site";
import PageBridge from "@/components/PageBridge";

export const metadata: Metadata = {
    title: "Gear",
    description: "Tools Pancham uses.",
};

export default function GearPage() {
    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Gear</h1>
                <p className="page-lede">
                    What I actually use. Desk, music, laptop, the usual. Not
                    sponsored.
                </p>
            </header>

            <div className="gear-grid">
                {GEAR.map((item) => {
                    const hasImage = Boolean(item.image);
                    const body = (
                        <>
                            <p className="gear-item__cat">{item.category}</p>
                            <h2 className="gear-item__name">{item.name}</h2>
                            <p className="gear-item__note">{item.note}</p>
                        </>
                    );

                    return (
                        <article
                            key={item.name}
                            className={
                                hasImage ? "gear-item has-image" : "gear-item"
                            }
                        >
                            {hasImage && item.image && (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={112}
                                    height={112}
                                    className="gear-item__image"
                                />
                            )}
                            {item.href ? (
                                item.href.startsWith("/") ? (
                                    <Link
                                        href={item.href}
                                        className="row-link"
                                    >
                                        {body}
                                    </Link>
                                ) : (
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="row-link"
                                    >
                                        {body}
                                    </a>
                                )
                            ) : (
                                <div>{body}</div>
                            )}
                        </article>
                    );
                })}
            </div>

            {GEAR.length === 0 && <p className="muted">Nothing listed yet.</p>}

            <PageBridge
                links={[
                    { href: "/projects", label: "Projects" },
                    { href: "/about", label: "About" },
                    { href: "/work", label: "Work" },
                ]}
            />
        </div>
    );
}
