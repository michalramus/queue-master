export class dateSettingValue {
    private date: Date = new Date();
    constructor(date: Date) {
        this.date = date;
    }
    convertSettingFromString(value) {
        if (!this.isValueCorrect(value)) {
            return new dateSettingValue(new Date());
        }
        return new dateSettingValue(new Date(value));
    }
    isValueCorrect(value: string | number): boolean {
        if (!isNaN(Date.parse(<string>(<unknown>value)))) {
            return true;
        }
        return false;
    }
    toJSON(): string {
        return this.date.toISOString();
    }
}
