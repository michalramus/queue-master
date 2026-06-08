/**
 * Enum mapping setting property names to their corresponding database key numbers
 * Used in multilingual_text table for identifying different settings
 *
 * When adding a new multilingual setting:
 * 1. Add new entry here with unique key number
 * No changes needed in service or controller code - they handle it automatically
 */

export enum MultilingualSettings {
    printing_ticket_template = 1,
}

export type MultilingualSettingKeyNames = keyof typeof MultilingualSettings;
