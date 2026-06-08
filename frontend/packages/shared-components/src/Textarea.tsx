export default function Textarea({
    value,
    onChange,
    placeholder,
    rows = 3,
    maxLength,
    readOnly = false,
    mono = false,
    label,
    hint,
    className,
}: {
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
    readOnly?: boolean;
    mono?: boolean;
    label?: string;
    hint?: string;
    className?: React.ComponentProps<"div">["className"];
}) {
    const textareaClass = [
        "w-full rounded border border-gray-1 px-3 py-2 resize-none",
        readOnly ? "bg-gray-50" : "focus:ring-primary-1 focus:ring-2 focus:outline-none",
        mono ? "font-mono text-xs" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={className}>
            {label && <label className="text-text-1 mb-2 block text-sm font-medium">{label}</label>}
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                readOnly={readOnly}
                className={textareaClass}
            />
            {maxLength !== undefined && (
                <p className="text-text-2 mt-1 text-xs">
                    {value.length}/{maxLength}
                </p>
            )}
            {hint && <p className="text-text-2 mt-1 text-xs">{hint}</p>}
        </div>
    );
}
