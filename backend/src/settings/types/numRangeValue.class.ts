import { CustomSettingValue } from "./customSettingValue.class";

export class NumRangeValue extends CustomSettingValue {
    private value: number = 0;
    private min: number = 0;
    private max: number = 0;

    constructor(value: number, min: number, max: number) {
        super();
        this.min = min;
        this.max = max;
        if (this.isValueCorrect(value)) {
            this.value = value;
        } else {
            this.value = 0;
        }
    }

    getValue(): number {
        return this.value;
    }

    convertSettingFromString(value: string): NumRangeValue {
        return new NumRangeValue(parseInt(value), this.min, this.max);
    }

    isValueCorrect(value: string | number): boolean {
        // parse to int
        if (typeof value === "string") {
            value = parseInt(value);
        }

        if (typeof value === "number") {
            if (value >= this.min && value <= this.max) {
                return true;
            }
        }
        return false;
    }

    toJSON(): string {
        return this.value.toString();
    }
}
