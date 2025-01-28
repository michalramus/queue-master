import { NextResponse, type NextRequest } from "next/server";
import { getInfoSSR } from "./utils/api/SSR/auth";

interface Page {
    matcher: string;
    roles: ("Device" | "User" | "Admin")[];
    error401Redirect: string;
    error403Redirect: string;
}

const pages: Page[] = [
    {
        matcher: "/seat",
        roles: ["User", "Admin"],
        error401Redirect: "/login",
        error403Redirect: "/login",
    },

    {
        matcher: "/kiosk",
        roles: ["Device", "User", "Admin"],
        error401Redirect: "/register-device",
        error403Redirect: "/register-device",
    },
];

//TODO Add 404
export async function middleware(request: NextRequest) {
    for (let page of pages) {
        if (request.nextUrl.pathname.startsWith(page.matcher)) {
            const info = await getInfoSSR();
            if (info.status == 401) {
                return NextResponse.redirect(
                    new URL(page.error401Redirect + "?redirect=" + page.matcher, request.url),
                );
            }

            if (info.status == 403) {
                return NextResponse.redirect(
                    new URL(page.error403Redirect + "?redirect=" + page.matcher, request.url),
                );
            }

            if (page.roles.indexOf((await info.json()).role) < 0) {
                return NextResponse.redirect(
                    new URL(page.error403Redirect + "?redirect=" + page.matcher, request.url),
                );
            }
        }
    }
}
