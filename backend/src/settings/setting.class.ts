import { Logger } from "@nestjs/common";
import { CustomSettingValue } from "./types/customSettingValue.class";

/**
 * Setting class for storing settings
 * @param T - use only string, number, Date - conversions are not implemented for other types
 *
 */
export class Setting<T> {
    key: string;
    defaultValue: T;
    private logger = new Logger("Setting");

    /**
     *
     * @param key Name of setting
     * @param defaultValue Default value of setting
     */
    constructor(key: string, defaultValue: T) {
        this.key = key;
        this.defaultValue = defaultValue;
    }

    /**
     * Use this method to convert setting from string
     * Function also calls isValueCorrect() to validate the value
     * @param value
     * @returns
     */
    convertSettingFromString(value: string): T {
        if (!this.isValueCorrect(value)) {
            return this.defaultValue;
        }

        if (this.defaultValue instanceof CustomSettingValue) {
            return <T>(<unknown>(<CustomSettingValue>this.defaultValue).convertSettingFromString(value));
        } else if (typeof this.defaultValue === "number") {
            return <T>(<unknown>parseInt(value));
        } else if (typeof this.defaultValue === "string") {
            return <T>(<unknown>value);
        }

        return this.defaultValue;
    }

    /**
     * Function always returns true if setting type is string
     * and false if type is not supported
     * @param value Value to validate
     *
     */
    isValueCorrect(value: string | number): boolean {
        //check if custom setting value is correct
        if (this.defaultValue instanceof CustomSettingValue) {
            const correct = (<CustomSettingValue>this.defaultValue).isValueCorrect(<string>value);

            if (!correct) {
                this.logger.debug(`Error validating setting '${this.key}' from string: '${value}'`);
            }
            return correct;
        } else if (typeof this.defaultValue === "number") {
            //check if value is number
            if (!isNaN(<number>(<unknown>value))) {
                return true;
            }
        } else if (typeof this.defaultValue === "string") {
            return true;
        }

        this.logger.debug(`Error validating setting '${this.key}' from string: '${value}'`);
        return false; // if type value is correct or is not supported, return true
    }
}

export type SettingSupportedTypes = string | number | CustomSettingValue;
