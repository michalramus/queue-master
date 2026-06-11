import { AxiosAuthInstance, AxiosPureInstance } from "../axiosInstances.interface";
import { LangCode } from "../types/LangCode";

export type RequiredMultilingualValue = { [lang in LangCode]?: string };
export type MultilingualValue = { [lang in LangCode]?: string | null };

export interface MultilingualSettingsInterface {
    printing_ticket_template?: RequiredMultilingualValue;
    monday_label?: MultilingualValue;
    tuesday_label?: MultilingualValue;
    wednesday_label?: MultilingualValue;
    thursday_label?: MultilingualValue;
    friday_label?: MultilingualValue;
    saturday_label?: MultilingualValue;
    sunday_label?: MultilingualValue;
}

const apiPathMultilingualSettings = "/settings/multilingual";

export async function getMultilingualSettings(
    axiosPureInstance: AxiosPureInstance,
): Promise<MultilingualSettingsInterface> {
    const response = await axiosPureInstance.pure.get(apiPathMultilingualSettings);

    return response.data;
}

/**
 * Use this endpoint only from Admin account
 * @param multilingualSettings
 * @returns
 */
export async function setMultilingualSettings(
    multilingualSettings: MultilingualSettingsInterface,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<MultilingualSettingsInterface> {
    const response = await axiosAuthInstance.auth.patch(
        apiPathMultilingualSettings,
        multilingualSettings,
    );

    return response.data;
}
