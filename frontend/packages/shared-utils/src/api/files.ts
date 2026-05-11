import { AxiosAuthInstance, AxiosPureInstance } from "../axiosInstances.interface";

export enum LogoID {
    logo_kiosk_main = "logo_kiosk_main",
    logo_kiosk_secondary = "logo_kiosk_secondary",
    logo_tv_main = "logo_tv_main",
    logo_tv_secondary = "logo_tv_secondary",
}

const apiPathLogo = "/file/logo";

export async function getLogoAvailability(axiosPureInstance: AxiosPureInstance): Promise<LogoID[]> {
    const response = await axiosPureInstance.pure.get(apiPathLogo);

    return response.data.availableLogos;
}

export async function uploadLogo(
    logoId: LogoID,
    file: File,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    await axiosAuthInstance.auth.post(`${apiPathLogo}/${logoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function deleteLogo(
    logoId: LogoID,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<void> {
    await axiosAuthInstance.auth.delete(`${apiPathLogo}/${logoId}`);
}
