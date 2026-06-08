"use client";

import { SketchPicker } from "react-color";
import tinycolor from "tinycolor2";
import HslInput from "./HslInput";

interface ColorPickerPopupProps {
    value: string;
    onClose: () => void;
    onChange: (hex: string) => void;
}

export default function ColorPickerPopup({ value, onClose, onChange }: ColorPickerPopupProps) {
    const hsl = tinycolor(value).toHsl();

    function handleHslChange(channel: "h" | "s" | "l", num: number) {
        const current = tinycolor(value).toHsl();
        const updated = { ...current, [channel]: channel === "h" ? num : num / 100 };
        onChange(tinycolor(updated).toHexString());
    }

    return (
        <div className="absolute top-full left-0 z-20 mt-2">
            <div className="fixed inset-0" onClick={onClose} />
            <div className="relative w-[225px] rounded shadow-[0_0_0_1px_rgba(0,0,0,.15),_0_8px_16px_rgba(0,0,0,.15)]">
                <SketchPicker
                    color={value}
                    disableAlpha
                    presetColors={[]}
                    onChange={(color) => onChange(color.hex)}
                    onChangeComplete={(color) => onChange(color.hex)}
                    styles={{
                        default: {
                            picker: {
                                width: "100%",
                                boxSizing: "border-box",
                                boxShadow: "none",
                                borderRadius: "4px 4px 0 0",
                                paddingBottom: 0,
                            },
                        },
                    }}
                />

                <div className="flex gap-2.5 rounded-b bg-white px-[10px] pb-[10px]">
                    <HslInput
                        label="h"
                        numericValue={Math.round(hsl.h)}
                        max={360}
                        onCommit={(num) => handleHslChange("h", num)}
                    />
                    <HslInput
                        label="s"
                        numericValue={Math.round(hsl.s * 100)}
                        max={100}
                        onCommit={(num) => handleHslChange("s", num)}
                    />
                    <HslInput
                        label="l"
                        numericValue={Math.round(hsl.l * 100)}
                        max={100}
                        onCommit={(num) => handleHslChange("l", num)}
                    />
                </div>
            </div>
        </div>
    );
}
