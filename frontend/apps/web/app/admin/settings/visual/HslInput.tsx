"use client";

import { useState, useEffect } from "react";
import { Input } from "shared-components";

interface HslInputProps {
    numericValue: number;
    max: number;
    label: string;
    onCommit: (num: number) => void;
}

export default function HslInput({ numericValue, max, label, onCommit }: HslInputProps) {
    const [inputValue, setInputValue] = useState(String(numericValue));

    useEffect(() => {
        setInputValue(String(numericValue));
    }, [numericValue]);

    return (
        <div className="flex flex-1 flex-col items-center gap-1">
            <Input
                value={inputValue}
                inputClassName="px-0.5 py-0.5 text-xs text-center"
                onChange={(e) => {
                    // strips any non-digit character on input, e.g. "12a3" → "123"
                    const raw = e.target.value.replace(/\D/g, "");
                    setInputValue(raw);
                    if (raw) {
                        const num = Number(raw);
                        if (num >= 0 && num <= max) onCommit(num);
                    }
                }}
                onBlur={() => {
                    const num = Number(inputValue);
                    if (!inputValue || isNaN(num) || num < 0 || num > max) {
                        setInputValue(String(numericValue));
                    }
                }}
            />
            <span className="text-[11px] text-[#999] uppercase">{label}</span>
        </div>
    );
}
