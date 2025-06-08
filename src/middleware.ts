import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const role = request.cookies.get("role")?.value;

  // 🚫 Redirect if a driver tries to access /owner
  if (pathname === "/owner" && role !== "owner") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  // 🚫 Redirect if an owner tries to access /driver
  if (pathname === "/driver" && role !== "driver") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner", "/driver"],
};
