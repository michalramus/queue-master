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
    monday_label = 2,
    tuesday_label = 3,
    wednesday_label = 4,
    thursday_label = 5,
    friday_label = 6,
    saturday_label = 7,
    sunday_label = 8,
}

export type MultilingualSettingKeyNames = keyof typeof MultilingualSettings;
