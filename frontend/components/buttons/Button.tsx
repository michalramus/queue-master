export default function Button({
    children,
    onClick,
    color = "blue",
    disabled = false,
    className,
}: {
    children: React.ReactNode;
    onClick: () => void;
    color?: string;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`mb-2 me-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white bg-${color}-600 hover:bg-${color}-700 ${disabled && "cursor-not-allowed"} ${className}`}
            disabled={disabled}
       >
            {children}
        </button>
    );
}
