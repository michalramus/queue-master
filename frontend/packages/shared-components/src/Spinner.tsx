"use client";

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    hidden?: boolean;
    label?: string;
}

export default function Spinner({
    size = "md",
    className = "",
    hidden = false,
    label = "Loading...",
}: SpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4 border-2",
        md: "h-8 w-8 border-3",
        lg: "h-12 w-12 border-4",
    };

    return (
        <div
            className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeClasses[size]} ${hidden ? "invisible" : ""} ${className}`}
            role="status"
        >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]">
                {label}
            </span>
        </div>
    );
}
