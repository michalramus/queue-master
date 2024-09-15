"use client";

import { getInfo } from "@/utils/api/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { notFound } from "next/navigation";

/**
 * Redirect to correct page if 401 error or roles are not enough
 * @param error401Redirect
 * @param error403Redirect
 * @param roles
 * @param router
 * @returns
 */
export default async function protectPage(
    roles: ("Device" | "User" | "Admin")[],
    router: AppRouterInstance,
    error401Redirect: string,
    error403Redirect: string,
) {
    const info = await getInfo();

    if (info.status == 401) {
        return router.push(error401Redirect);
    }

    if (info.status == 403) {
        return router.push(error403Redirect);
    }

    if (roles.indexOf((await info.json()).role) < 0) {
        return router.push(error403Redirect);
    }
}
