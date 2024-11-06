/**
 * Abstract class that can be used to store custom setting values in setting class
 */
export abstract class CustomSettingValue {
    abstract convertSettingFromString(value: string): CustomSettingValue;

    abstract isValueCorrect(value: string | number): boolean;

    abstract toJSON(): string;
}
