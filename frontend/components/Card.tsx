export default function Card({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`block max-w-md rounded-lg border border-gray-700 bg-gray-800 p-6 shadow ${className}`}
        >
            {children}
        </div>
    );
}
