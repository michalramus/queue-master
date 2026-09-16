import { NextResponse, type NextRequest } from "next/server";
import { getCachedAuthInfo } from "./utils/server/getCachedAuthInfo";

interface Page {
    matcher: string;
    roles: ("Device" | "User" | "Admin")[];
    error401Redirect: string;
    error403Redirect: string;
}

const pages: Page[] = [
    {
        matcher: "/desk",
        roles: ["User", "Admin"],
        error401Redirect: "/login",
        error403Redirect: "/login",
    },
    {
        matcher: "/admin",
        roles: ["Admin"],
        error401Redirect: "/login",
        error403Redirect: "/",
    },
];

export async function proxy(request: NextRequest) {
    for (const page of pages) {
        if (request.nextUrl.pathname.startsWith(page.matcher)) {
            // `getCachedAuthInfo` never throws — it returns null when the visitor has no valid
            // session — so the unauthenticated case must be branched on explicitly.
            const info = await getCachedAuthInfo();

            if (!info) {
                return NextResponse.redirect(
                    new URL(page.error401Redirect + "?redirect=" + page.matcher, request.url),
                );
            }

            if (!page.roles.includes(info.role)) {
                return NextResponse.redirect(
                    new URL(page.error403Redirect + "?redirect=" + page.matcher, request.url),
                );
            }
        }
    }
}
