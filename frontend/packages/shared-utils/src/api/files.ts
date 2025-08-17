import { AxiosPureInstance } from "../axiosInstances.interface";

export enum LogoID {
    logo_kiosk_main = "logo_kiosk_main",
    logo_kiosk_secondary = "logo_kiosk_secondary",
    logo_tv_main = "logo_tv_main",
    logo_tv_secondary = "logo_tv_secondary",
}

const apiPathLogo = "/file/logo";

/**
 *
 * @returns Available logo ids - can be fetched from /file/logo/[id]
 */
export async function getLogoAvailability(axiosPureInstance: AxiosPureInstance): Promise<LogoID[]> {
    const response = await axiosPureInstance.pure.get(apiPathLogo);

    return response.data.availableLogos;
}
