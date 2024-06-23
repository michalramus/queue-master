export default function Button({
    children,
    onClick,
    color = "blue",
    disabled = false,
    className,
}: {
    children: React.ReactNode;
    onClick: () => void;
    color?: "blue" | "green" | "red";
    disabled?: boolean;
    className?: string;
}) {

    let colorClass = "";
    switch (color) {
        case "blue":
            colorClass = "bg-blue-600 hover:bg-blue-700";
            break;
        case "green":
            colorClass = "bg-green-600 hover:bg-green-700";

            break;
        case "red":
            colorClass = "bg-red-600 hover:bg-red-700";
            break;
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`mb-2 me-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white ${colorClass} ${disabled && "cursor-not-allowed"} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
