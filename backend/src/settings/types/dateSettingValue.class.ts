import { CustomSettingValue } from "./customSettingValue.class";

export class DateSettingValue extends CustomSettingValue {
    private date: Date = new Date();

    constructor(date: Date) {
        super();
        this.date = date;
    }

    getDate(): Date {
        return this.date;
    }

    convertSettingFromString(value: string): DateSettingValue {
        if (!this.isValueCorrect(value)) {
            return new DateSettingValue(new Date());
        }
        return new DateSettingValue(new Date(value));
    }

    isValueCorrect(value: string | number): boolean {
        if (typeof value === "number") {
            return false;
        }
        return !isNaN(Date.parse(value));
    }

    toJSON(): string {
        return this.date.toISOString();
    }
}
