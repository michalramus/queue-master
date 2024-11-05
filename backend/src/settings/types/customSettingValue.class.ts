export class customSettingValue {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    convertSettingFromString(value: string): customSettingValue {
        return new customSettingValue();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isValueCorrect(value: string | number): boolean {
        return false;
    }

    toJSON(): string {
        return "";
    }
}
