import { Logger } from "@nestjs/common";

//TODO add validation for interfaces as types(f.ex. JSON objects)

/**
 * Setting class for storing settings
 * @param T - use only string, number, Date - conversions are not implemented for other types
 *
 */
export class Setting<T> {
    key: string;
    defaultValue: T;
    possibleValues: { [key: string]: T } | undefined;
    private logger = new Logger("Setting");

    constructor(key: string, defaultValue: T, possibleValues: { [key: string]: T } | undefined = undefined) {
        this.key = key;
        this.defaultValue = defaultValue;
        this.possibleValues = possibleValues;
    }

    /**
     * Use this method to convert and validate setting from string //TODO
     * At the moment function only cast string to T
     * @param value
     * @returns
     */
    convertSettingFromString(value: string): T {
        //     //TODO
        //     try {
        //         if (typeof this.defaultValue === "number") {
        //             return <T>(<unknown>parseInt(value));
        //         } else if (typeof this.defaultValue === "string") {
        //             return <T>(<unknown>value);
        //         } else if (this.defaultValue instanceof Date) {
        //             return <T>(<unknown>new Date(value));
        //         }

        return <T>(<unknown>value);
        //     } catch (e) {
        //         this.logger.warn(`Error converting setting '${this.key}' from string: ${e} - returning default value`);
        //         return this.defaultValue;
        //     }
    }

    /**
     * Function always returns true if setting type is string and possibleValues are not defined
     * and false if type is not supported
     * @param value Value to validate
     *
     */
    isValueCorrect(value: string | number): boolean {
        //check possible values
        if (this.possibleValues != undefined) {
            if (Object.values(this.possibleValues).includes(<T>(<unknown>value))) {
                return true;
            } else {
                this.logger.debug(`Error validating setting '${this.key}' from string: '${value}'`);
                return false;
            }
        } else if (typeof this.defaultValue === "number") {
            //check if value is number
            if (!isNaN(<number>(<unknown>value))) {
                return true;
            }
        } else if (this.defaultValue instanceof Date) {
            //check if value is date
            if (!isNaN(Date.parse(<string>(<unknown>value)))) {
                return true;
            }
        } else if (typeof this.defaultValue === "string") {
            return true;
        }

        this.logger.debug(`Error validating setting '${this.key}' from string: '${value}'`);
        return false; // if type value is correct or is not supported, return true
    }

    // convertDefaultValueToString(): string {
    //     if (typeof this.defaultValue === "number") {
    //         return this.defaultValue.toString();
    //     } else if (typeof this.defaultValue === "string") {
    //         return this.defaultValue;
    //     } else if (this.defaultValue instanceof Date) {
    //         return this.defaultValue.toISOString();
    //     }

    //     return this.defaultValue.toString();
    // }

    /**
    //  *
    //  * @param name Name of setting to find
    //  * @param settings Array of settings to search in
    //  * @returns Setting with the given name
    //  */
    // static findSettingByName<T>(name: string, settings: { [key: string]: Setting<T> }): Setting<T> {
    //     return settings[name];
    //     // return settings[name] find((setting) => setting.key === name);
    // }
}

export type SettingSupportedTypes = string | number | Date;
