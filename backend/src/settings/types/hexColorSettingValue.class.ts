import { customSettingValue } from "./customSettingValue.class";

export class hexColorSettingValue extends customSettingValue {
    private color: string = "#000000";

    constructor(color?: string) {
        super();
        if (this.isValueCorrect(color)) {
            this.color = color;
        } else {
            this.color = "#000000";
        }
    }

    getColor(): string {
        return this.color;
    }

    convertSettingFromString(value: string): hexColorSettingValue {
        return new hexColorSettingValue(value);
    }

    isValueCorrect(value: string | number): boolean {
        if (typeof value === "number") {
            return false;
        }
        const hexColorPattern = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
        return hexColorPattern.test(value);
    }

    toJSON(): string {
        return this.color;
    }
}
