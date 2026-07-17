import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Notes",
    description: "Redirects to About study notes.",
};

/** Notes live under About — keep route for old links. */
export default function NotesPage() {
    redirect("/about");
}
