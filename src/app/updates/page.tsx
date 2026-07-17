import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Updates",
    description: "Redirects to the Now page.",
};

/** Legacy /updates → /now */
export default function UpdatesPage() {
    redirect("/now");
}
