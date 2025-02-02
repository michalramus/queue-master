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
            className={`bg-secondary-1 block rounded-lg p-6 ${shadow ? "shadow-sm" : ""} ${className}`}
        >
            {children}
        </div>
    );
}
