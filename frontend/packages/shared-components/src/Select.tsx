export default function Select<T extends string>({
    value,
    onChange,
    label,
    hint,
    disabled = false,
    children,
    className,
}: {
    value: T;
    onChange: (value: T) => void;
    label?: string;
    hint?: string;
    disabled?: boolean;
    children: React.ReactNode;
    className?: React.ComponentProps<"div">["className"];
}) {
    return (
        <div className={className}>
            {label && <label className="text-text-1 mb-1 block text-sm font-medium">{label}</label>}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
                disabled={disabled}
                className="focus:ring-primary-1 border-gray-1 w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none disabled:opacity-50"
            >
                {children}
            </select>
            {hint && <p className="text-text-2 mt-1 text-xs">{hint}</p>}
        </div>
    );
}
