"use client";

interface LoadingBarProps {
    className?: string;
}

export default function LoadingBar({ className = "" }: LoadingBarProps) {
    return (
        <div className={`bg-primary-2 relative h-2 w-64 overflow-hidden rounded-full ${className}`}>
            <div className="animate-slide absolute h-full w-1/4 rounded-full bg-white" />
        </div>
    );
}
