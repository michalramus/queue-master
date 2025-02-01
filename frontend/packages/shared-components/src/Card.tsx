export default function Card({
    children,
    className,
    shadow = true,
}: {
    children: React.ReactNode;
    className?: React.ComponentProps<"div">["className"];
    shadow?: boolean;
}) {
    return (
        <div
            className={`block rounded-lg bg-secondary-1 p-6 ${shadow ? "shadow" : ""} ${className}`}
        >
            {children}
        </div>
    );
}
