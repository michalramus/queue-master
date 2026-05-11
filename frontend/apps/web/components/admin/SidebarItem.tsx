"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTopLoadingBar } from "@/utils/providers/TopLoadingBarProvider";

interface SidebarItemProps {
    href: string;
    label: string;
    subItems?: { href: string; label: string }[];
}

function SidebarSubItem({ href, label }: { href: string; label: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const { show } = useTopLoadingBar();

    return (
        <Link
            href={href}
            className={`flex items-center px-4 py-2 text-sm transition-colors ${
                pathname === href ? "bg-primary-2 text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={(e) => {
                e.preventDefault();
                show();
                router.push(href);
            }}
        >
            {label}
        </Link>
    );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
    return (
        <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}

export default function SidebarItem({ href, label, subItems }: SidebarItemProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { show } = useTopLoadingBar();
    const [isOpen, setIsOpen] = useState(true);

    const isActive =
        pathname === href || (subItems && subItems.some((child) => pathname === child.href));

    if (subItems) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                        isActive ? "bg-primary-1 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    <span>{label}</span>
                    <ChevronIcon isOpen={isOpen} />
                </button>
                {isOpen && (
                    <div className="ml-4">
                        {subItems.map((child) => (
                            <SidebarSubItem
                                key={child.href}
                                href={child.href}
                                label={child.label}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "bg-primary-1 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={(e) => {
                e.preventDefault();
                show();
                router.push(href);
            }}
        >
            {label}
        </Link>
    );
}
