"use client";

import React, { createContext, useContext, useState } from "react";

interface BreadcrumbContextValue {
    pageTitle: string | null;
    setPageTitle: (title: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(
    undefined,
);

export function BreadcrumbProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [pageTitle, setPageTitle] = useState<string | null>(null);

    return (
        <BreadcrumbContext.Provider value={{ pageTitle, setPageTitle }}>
            {children}
        </BreadcrumbContext.Provider>
    );
}

export function useBreadcrumb() {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
    }
    return context;
}

export function useSetBreadcrumbTitle(title: string | null) {
    const { setPageTitle } = useBreadcrumb();

    React.useEffect(() => {
        setPageTitle(title);
        return () => setPageTitle(null);
    }, [title, setPageTitle]);
}
