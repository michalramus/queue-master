import { AxiosPureInstance } from "../axiosInstances.interface";

const apiPathLogo = "/file/logo";

/**
 *
 * @returns Available logo ids - can be fetched from /file/logo/[id]
 */
export async function getLogoAvailability(axiosPureInstance: AxiosPureInstance): Promise<number[]> {
    const response = await axiosPureInstance.pure.get(apiPathLogo).catch((error) => {
        return error.response;
    });

    return response.data.availableLogos;
}
