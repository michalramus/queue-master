export default function Input({
    value,
    onChange,
    onBlur,
    placeholder,
    type = "text",
    label,
    hint,
    disabled = false,
    className,
    inputClassName,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: React.ComponentProps<"input">["type"];
    label?: string;
    hint?: string;
    disabled?: boolean;
    className?: React.ComponentProps<"div">["className"];
    inputClassName?: React.ComponentProps<"input">["className"];
}) {
    return (
        <div className={className}>
            {label && <label className="text-text-1 mb-1 block text-sm font-medium">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                className={`focus:ring-primary-1 border-gray-1 w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none disabled:opacity-50 ${inputClassName ?? ""}`}
            />
            {hint && <p className="text-text-2 mt-1 text-xs">{hint}</p>}
        </div>
    );
}
