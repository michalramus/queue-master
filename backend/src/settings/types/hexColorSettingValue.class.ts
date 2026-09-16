import { CustomSettingValue } from "./customSettingValue.class";

export class HexColorSettingValue extends CustomSettingValue {
    private color: string = "#000000";

    constructor(color?: string) {
        super();
        if (color !== undefined && this.isValueCorrect(color)) {
            this.color = color;
        } else {
            this.color = "#000000";
        }
    }

    getColor(): string {
        return this.color;
    }

    convertSettingFromString(value: string): HexColorSettingValue {
        return new HexColorSettingValue(value);
    }

    isValueCorrect(value: string | number): boolean {
        if (typeof value === "number") {
            return false;
        }
        // Matches a "#" followed by exactly 3 or 6 case-insensitive hex digits and nothing else.
        // Matches: "#fff", "#27ce5e". Rejects: "27ce5e" (no "#"), "#ggg" (not hex), "#ffff" (wrong length).
        const hexColorPattern = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
        return hexColorPattern.test(value);
    }

    toJSON(): string {
        return this.color;
    }
}
