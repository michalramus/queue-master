import { AxiosAuthInstance, AxiosPureInstance } from "../axiosInstances.interface";

export interface MultilingualSettingsInterface {
    printing_ticket_template?: { [lang: string]: string };
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
