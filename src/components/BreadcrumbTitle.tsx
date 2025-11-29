"use client";

import { useSetBreadcrumbTitle } from "@/contexts/BreadcrumbContext";

export default function BreadcrumbTitle({ title }: { title: string }) {
    useSetBreadcrumbTitle(title);
    return null;
}
