"use client";
import { useState, useEffect } from "react";

export default function NumericStepper({
    value,
    onChange,
    min,
    max,
    hint,
    disabled = false,
    className = "",
}: {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    hint?: string;
    disabled?: boolean;
    className?: string;
}) {
    const [inputValue, setInputValue] = useState(String(value));

    useEffect(() => {
        setInputValue(String(value));
    }, [value]);

    return (
        <>
            <div
                className={`flex items-center gap-2${disabled ? "pointer-events-none opacity-50" : ""} ${className}`}
            >
                <button
                    type="button"
                    onClick={() => value > min && onChange(value - 1)}
                    disabled={disabled || value <= min}
                    className="border-gray-1 bg-background flex h-10 w-10 items-center justify-center rounded border transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
                <input
                    type="text"
                    inputMode="numeric"
                    value={inputValue}
                    onChange={(e) => {
                        // strips any non-digit character on input, e.g. "12a3" → "123"
                        const raw = e.target.value.replace(/\D/g, "");
                        setInputValue(raw);
                        if (raw) {
                            const num = Number(raw);
                            if (num >= min && num <= max) onChange(num);
                        }
                    }}
                    onBlur={() => {
                        const num = Number(inputValue);
                        if (!inputValue || isNaN(num) || num < min || num > max) {
                            setInputValue(String(value));
                        }
                    }}
                    className="focus:ring-primary-1 border-gray-1 flex-1 rounded border px-3 py-2 text-center focus:ring-2 focus:outline-none"
                />
                <button
                    type="button"
                    onClick={() => value < max && onChange(value + 1)}
                    disabled={disabled || value >= max}
                    className="border-gray-1 bg-background flex h-10 w-10 items-center justify-center rounded border transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                        />
                    </svg>
                </button>
            </div>
            {hint && <p className="text-text-2 mt-1 text-xs">{hint}</p>}
        </>
    );
}
