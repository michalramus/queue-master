export default function Button({
    children,
    onClick,
    color = "blue",
    disabled = false,
    type = "button",
    className,
}: {
    children: React.ReactNode;
    onClick(): void;
    color?: "blue" | "green" | "red" | "gray" | "primary" | "secondary";
    disabled?: boolean;
    type?: "button" | "submit";
    className?: React.ComponentProps<"div">["className"];
}) {
    let colorClass = "";
    switch (color) {
        case "blue":
            if (disabled) {
                colorClass = "bg-blue-2";
            } else {
                colorClass = "bg-blue-1 hover:bg-blue-2";
            }
            break;
        case "green":
            if (disabled) {
                colorClass = "bg-green-2";
            } else {
                colorClass = "bg-green-1 hover:bg-green-2";
            }

            break;
        case "red":
            if (disabled) {
                colorClass = "bg-red-2";
            } else {
                colorClass = "bg-red-1 hover:bg-red-2";
            }
            break;
        case "gray":
            if (disabled) {
                colorClass = "bg-gray-2";
            } else {
                colorClass = "bg-gray-1 hover:bg-gray-2";
            }
            break;

        case "primary":
            if (disabled) {
                colorClass = "bg-primary-2";
            } else {
                colorClass = "bg-primary-1 hover:bg-primary-2";
            }

            break;
        case "secondary":
            if (disabled) {
                colorClass = "bg-secondary-2";
            } else {
                colorClass = "bg-secondary-1 hover:bg-secondary-2";
            }
            break;
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`m-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-md ${colorClass} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
