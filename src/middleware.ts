import { NextRequest, NextResponse } from "next/server"

const AUTH_PAGES = [
    "/forgot-password",
    "/login",
    "/new-password",
    "/reset-confirmation",
    "/signup",
    "/verify-otp",
]

const CREATOR_PAGES = [
    "/creator-home",
    "/earning",
    "/creator-message",
    "/creator-profile",
    "/creator-setting",
]

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    const isAuthPage = AUTH_PAGES.some(p => pathname.startsWith(p))
    const isCreatorPage = CREATOR_PAGES.some(p => pathname.startsWith(p))

    const token = req.cookies.get("accessToken")?.value
    const role = req.cookies.get("role")?.value // "FAN" | "CREATOR"

    // No token — only allow auth pages
    if (!token) {
        if (isAuthPage) return NextResponse.next()
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // Logged in user trying to access auth pages
    if (isAuthPage) {
        const destination = role === "CREATOR" ? "/creator-home" : "/"
        return NextResponse.redirect(new URL(destination, req.url))
    }

    // FAN trying to access creator pages
    if (role === "FAN" && isCreatorPage) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    // Creator trying to access FAN pages
    // if (role === "CREATOR" && !isCreatorPage) {
    //     return NextResponse.redirect(new URL("/creator-home", req.url))
    // }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|icons|image|fonts|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
    ],
}