import { CustomSettingValue } from "./customSettingValue.class";

export class BooleanSettingValue extends CustomSettingValue {
    private defaultValue: boolean;

    constructor(value: boolean) {
        super();
        this.defaultValue = value;
    }

    // getValue(): boolean {
    //     return this.defaultValue;
    // }

    isValueCorrect(value: string | number): boolean {
        if (typeof value === "string") {
            return value === "true" || value === "false";
        }
        return typeof value === "boolean";
    }

    convertSettingFromString(value: string): BooleanSettingValue {
        return new BooleanSettingValue(value === "true");
    }

    toJSON(): any {
        return this.defaultValue;
    }
}
