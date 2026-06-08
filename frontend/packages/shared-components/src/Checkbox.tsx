export default function Checkbox({
    id,
    label,
    checked,
    onChange,
    disabled = false,
    hint,
    className,
}: {
    id?: string;
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    hint?: string;
    className?: React.ComponentProps<"div">["className"];
}) {
    return (
        <div className={className}>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className="text-primary-1 focus:ring-primary-1 h-4 w-4 rounded border-gray-300 disabled:opacity-50"
                />
                <label htmlFor={id} className="text-text-1 ml-2 text-sm font-medium">
                    {label}
                </label>
            </div>
            {hint && <p className="text-text-2 mt-1 text-xs">{hint}</p>}
        </div>
    );
}
