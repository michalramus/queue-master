export default function Card({
    children,
    className,
    shadow = true,
    color = "secondary",
}: {
    children: React.ReactNode;
    className?: React.ComponentProps<"div">["className"];
    shadow?: boolean;
    color?: "secondary" | "background";
}) {
    let colorClass: string = "";

    switch (color) {
        case "secondary":
            colorClass = "bg-secondary-1";
            break;
        case "background":
            colorClass = "bg-background";
            break;
    }

    return (
        <div
            className={`${colorClass} block rounded-lg p-6 ${shadow ? "shadow-xs" : ""} ${className}`}
        >
            {children}
        </div>
    );
}
