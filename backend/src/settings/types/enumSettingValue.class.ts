import { CustomSettingValue } from "./customSettingValue.class";

export class EnumSettingValue extends CustomSettingValue {
    private value: string;
    private possibleValues: string[];

    constructor(value: string, possibleValues: string[]) {
        super();
        this.possibleValues = possibleValues;
        if (this.isValueCorrect(value)) {
            this.value = value;
        } else {
            this.value = possibleValues[0];
        }
    }

    getValue(): string {
        return this.value;
    }

    convertSettingFromString(value: string): EnumSettingValue {
        return new EnumSettingValue(value, this.possibleValues);
    }

    isValueCorrect(value: string | number): boolean {
        if (typeof value === "number") {
            return false;
        }
        return this.possibleValues.includes(value);
    }

    toJSON(): string {
        return this.value;
    }
}
