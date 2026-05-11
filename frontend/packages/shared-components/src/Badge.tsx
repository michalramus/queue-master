type BadgeColor = "primary" | "blue" | "green" | "red" | "yellow" | "gray";

const colorClasses: Record<BadgeColor, string> = {
    primary: "bg-primary-1 text-white",
    blue: "bg-blue-1 text-white",
    green: "bg-green-1 text-white",
    red: "bg-red-1 text-white",
    yellow: "bg-yellow-1 text-white",
    gray: "bg-gray-1 text-white",
};

interface BadgeProps {
    color: BadgeColor;
    children: React.ReactNode;
    className?: React.ComponentProps<"span">["className"];
}

export default function Badge({ color, children, className }: BadgeProps) {
    return (
        <span
            className={`rounded px-2 py-1 text-xs font-medium ${colorClasses[color]} ${className ?? ""}`}
        >
            {children}
        </span>
    );
}
