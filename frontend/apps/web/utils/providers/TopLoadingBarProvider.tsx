"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TopLoadingBar } from "shared-components";

interface TopLoadingBarContextType {
    show: () => void;
    hide: () => void;
    isShowing: boolean;
}

const TopLoadingBarContext = createContext<TopLoadingBarContextType | undefined>(undefined);

export function TopLoadingBarProvider({ children }: { children: React.ReactNode }) {
    const [isShowing, setIsShowing] = useState(false);
    const pathname = usePathname();

    const show = () => setIsShowing(true);
    const hide = () => setIsShowing(false);

    // Automatically hide loading bar when pathname changes
    useEffect(() => {
        setIsShowing(false);
    }, [pathname]);

    return (
        <TopLoadingBarContext.Provider value={{ show, hide, isShowing }}>
            <TopLoadingBar hidden={!isShowing} />
            {children}
        </TopLoadingBarContext.Provider>
    );
}

export function useTopLoadingBar() {
    const context = useContext(TopLoadingBarContext);
    if (context === undefined) {
        throw new Error("useTopLoadingBar must be used within a TopLoadingBarProvider");
    }
    return context;
}
