"use client";

export default function Button({
    children,
    onClick,
    color = "blue",
    disabled = false,
    className,
}: {
    children: React.ReactNode;
    onClick: () => void;
    color?: "blue" | "green" | "red" | "primary" | "secondary";
    disabled?: boolean;
    className?: string;
}) {
    let colorClass = "";
    switch (color) {
        case "blue":
            colorClass = "bg-blue-1 hover:bg-blue-2";
            break;
        case "green":
            colorClass = "bg-green-1 hover:bg-green-2";

            break;
        case "red":
            colorClass = "bg-red-1 hover:bg-red-2";
            break;

        case "primary":
            colorClass = "bg-primary-1 hover:bg-primary-2";

            break;
        case "secondary":
            colorClass = "bg-secondary-1 hover:bg-secondary-2";
            break;
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`m-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-md ${colorClass} ${disabled && "cursor-not-allowed"} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
