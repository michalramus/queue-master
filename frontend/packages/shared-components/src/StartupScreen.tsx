"use client";

import Header from "./Header";
import LoadingBar from "./LoadingBar";
import Spinner from "./Spinner";

interface StartupScreenProps {
    status: "loading" | "connecting" | "info" | "error";
    title: string;
    details?: string;
    className?: string;
}

export default function StartupScreen({
    status,
    title,
    details,
    className = "",
}: StartupScreenProps) {
    const isError = status === "error";

    const boxColorClass = isError ? "bg-red-1 text-white" : "bg-primary-1 text-white";

    return (
        <div className={`flex min-h-screen flex-col items-center justify-center ${className}`}>
            <Header className="mb-8" />
            <div
                className={`flex flex-col items-center gap-4 rounded-2xl px-10 py-8 ${boxColorClass}`}
            >
                {status === "loading" && <Spinner size="lg" />}
                {status === "connecting" && <LoadingBar />}
                <p className="text-center text-2xl font-semibold">{title}</p>
                {details && (
                    <p className="text-center text-lg whitespace-pre-line opacity-90">{details}</p>
                )}
            </div>
        </div>
    );
}
