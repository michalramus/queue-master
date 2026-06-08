import { cache } from "react";
import { getInfo } from "shared-utils";
import { axiosAuthInstance } from "../axiosInstances/axiosAuthInstance";

/**
 * Cached version of getInfo that deduplicates requests during the same server render
 * Both middleware and server components can call this without making duplicate requests
 */
export const getCachedAuthInfo = cache(async () => {
    try {
        const response = await getInfo(axiosAuthInstance);
        return response.data;
    } catch (error) {
        return null;
    }
});
