import { Metadata } from "next";
import ContactForm from "./ContactForm";
import { SITE, SOCIALS } from "@/data/site";

export const metadata: Metadata = {
    title: "Contact",
    description: `Say hi to ${SITE.name}.`,
};

export default function ContactPage() {
    const socials = SOCIALS.filter((s) => s.label !== "Email");

    return (
        <div>
            <header className="page-header">
                <h1 className="page-title">Contact</h1>
                <p className="page-lede">
                    Say hi. Software, music, photos, weird ideas. I actually
                    read these.
                </p>
            </header>

            <ul className="row-list contact-primary">
                <li>
                    <a href={`mailto:${SITE.email}`} className="row-link">
                        <span className="row-title">{SITE.email}</span>
                        <p className="row-desc">Best way to reach me.</p>
                    </a>
                </li>
                {socials.map((s) => (
                    <li key={s.href}>
                        <a
                            href={s.href}
                            target={s.external ? "_blank" : undefined}
                            rel={s.external ? "noreferrer" : undefined}
                            className="row-link"
                        >
                            <span className="row-title">
                                {s.label}
                                {s.external ? " ↗" : ""}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>

            <section className="section" aria-labelledby="contact-form-heading">
                <h2 id="contact-form-heading" className="section-title">
                    Form
                </h2>
                <p className="page-lede" style={{ marginBottom: "1rem" }}>
                    Prefer a form? That works too.
                </p>
                <ContactForm compact />
            </section>
        </div>
    );
}
