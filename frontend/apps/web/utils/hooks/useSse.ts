"use client";

import { useContext } from "react";
import { SseContext } from "../providers/SseProvider";

export function useSse() {
    const context = useContext(SseContext);
    if (!context) {
        throw new Error("useSse must be used within SseProvider");
    }
    return context;
}
