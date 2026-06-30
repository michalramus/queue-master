export default function IconButton({
    onClick,
    children,
    className = "",
}: {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-gray-400 text-gray-500 transition-colors hover:border-gray-500 hover:text-gray-700 ${className}`}
        >
            {children}
        </button>
    );
}
