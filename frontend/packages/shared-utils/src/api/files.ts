import { AxiosAuthInstance, AxiosPureInstance } from "../axiosInstances.interface";
import { LangCode } from "../types/LangCode";

export enum LogoID {
    logo_kiosk_main = "logo_kiosk_main",
    logo_kiosk_secondary = "logo_kiosk_secondary",
    logo_tv_main = "logo_tv_main",
    logo_tv_secondary = "logo_tv_secondary",
}

const apiPathLogo = "/file/logo";

export function getLogoUrl(backendUrl: string, lang: LangCode, logoId: LogoID): string {
    return `${backendUrl}${apiPathLogo}/${lang}/${logoId}`;
}

export async function getLogoAvailability(
    axiosPureInstance: AxiosPureInstance,
): Promise<Record<LangCode, LogoID[]>> {
    const response = await axiosPureInstance.pure.get<{
        availableLogos: Record<LangCode, LogoID[]>;
    }>(apiPathLogo);

    return response.data.availableLogos;
}

export async function uploadLogo(
    lang: LangCode,
    logoId: LogoID,
    file: File,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    await axiosAuthInstance.auth.post(`${apiPathLogo}/${lang}/${logoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export async function deleteLogo(
    lang: LangCode,
    logoId: LogoID,
    axiosAuthInstance: AxiosAuthInstance,
): Promise<void> {
    await axiosAuthInstance.auth.delete(`${apiPathLogo}/${lang}/${logoId}`);
}
