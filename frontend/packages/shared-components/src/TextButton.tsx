interface TextButtonProps {
    onClick: () => void;
    disabled?: boolean;
    color?: "primary" | "red" | "blue";
    children: React.ReactNode;
    className?: string;
}

export default function TextButton({
    onClick,
    disabled = false,
    color = "primary",
    children,
    className = "",
}: TextButtonProps) {
    let colorClasses;
    if (color === "red") {
        colorClasses = "text-red-1 hover:text-red-2";
    } else if (color === "blue") {
        colorClasses = "text-blue-1 hover:text-blue-2";
    } else {
        colorClasses = "text-primary-1 hover:text-primary-2";
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${colorClasses} w-fit cursor-pointer text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
}
