import { Logger } from "@nestjs/common";
import { customSettingValue } from "./types/customSettingValue.class";

/**
 * Setting class for storing settings
 * @param T - use only string, number, Date - conversions are not implemented for other types
 *
 */
export class Setting<T> {
    key: string;
    defaultValue: T;
    possibleStringValues: { [key: string]: T } | undefined;
    numberRange: { min: number; max: number } | undefined;
    private logger = new Logger("Setting");

    /**
     *
     * @param key Name of setting
     * @param defaultValue Default value of setting
     * @param possibleValues Dictionary of all possible string values
     * @param numberRange Range of possible number values
     */
    constructor(
        key: string,
        defaultValue: T,
        possibleValues: { [key: string]: T } | undefined = undefined,
        numberRange: { min: number; max: number } | undefined = undefined,
    ) {
        this.key = key;
        this.defaultValue = defaultValue;
        this.possibleStringValues = possibleValues;
        this.numberRange = numberRange;
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

        if (this.defaultValue instanceof customSettingValue) {
            return <T>(<unknown>(<customSettingValue>this.defaultValue).convertSettingFromString(value));
        } else if (typeof this.defaultValue === "number") {
            return <T>(<unknown>parseInt(value));
        } else if (typeof this.defaultValue === "string") {
            return <T>(<unknown>value);
        }

        return this.defaultValue;
    }

    /**
     * Function always returns true if setting type is string and possibleValues are not defined
     * and false if type is not supported
     * @param value Value to validate
     *
     */
    isValueCorrect(value: string | number): boolean {
        //check possible values
        if (this.possibleStringValues != undefined) {
            if (Object.values(this.possibleStringValues).includes(<T>(<unknown>value))) {
                return true;
            } else {
                this.logger.debug(`Error validating setting '${this.key}' from string: '${value}'`);
                return false;
            }
        } else if (typeof this.defaultValue === "number") {
            //check if value is number
            if (!isNaN(<number>(<unknown>value))) {
                if (this.numberRange != undefined) {
                    const numValue = <number>(<unknown>value);
                    if (numValue < this.numberRange.min || numValue > this.numberRange.max) {
                        this.logger.debug(`Error validating setting '${this.key}' from string: '${value}'`);
                        return false;
                    }
                }
                return true;
            }
        } else if (this.defaultValue instanceof customSettingValue) {
            //check if custom setting value is correct
            return (<customSettingValue>this.defaultValue).isValueCorrect(<string>value);
        } else if (typeof this.defaultValue === "string") {
            return true;
        }

        this.logger.debug(`Error validating setting '${this.key}' from string: '${value}'`);
        return false; // if type value is correct or is not supported, return true
    }
}

export type SettingSupportedTypes = string | number | customSettingValue;
