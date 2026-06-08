interface InfoTooltipProps {
    text: string;
    size?: "sm" | "md";
    icon?: "?" | "i";
    width?: string;
}

export default function InfoTooltip({
    text,
    size = "md",
    icon = "?",
    width = "w-64",
}: InfoTooltipProps) {
    const dimensions = size === "sm" ? "h-5 w-5 text-xs" : "h-6 w-6 text-sm";
    const tooltipTop = size === "sm" ? "top-6" : "top-8";

    return (
        <div className="group relative">
            <button
                className={`flex ${dimensions} items-center justify-center rounded-full border border-gray-400 font-bold text-gray-400 hover:text-gray-600`}
            >
                {icon}
            </button>
            <div
                className={`absolute ${tooltipTop} right-0 z-10 hidden ${width} rounded bg-gray-800 p-2 text-xs text-white shadow-lg group-hover:block`}
            >
                {text}
            </div>
        </div>
    );
}
