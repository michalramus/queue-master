/**
 * Abstract class that can be used to store custom setting values in setting class
 */
export class CustomSettingValue {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    convertSettingFromString(value: string): CustomSettingValue {
        return new CustomSettingValue();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isValueCorrect(value: string | number): boolean {
        return false;
    }

    toJSON(): string {
        return "";
    }
}
