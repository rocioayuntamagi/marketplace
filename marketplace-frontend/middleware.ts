import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const rol = req.cookies.get("rol")?.value;

  const url = req.nextUrl.pathname;

  // Si no hay token, redirigir al login
  if (!token && !url.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Protección por rol
  if (url.startsWith("/admin") && rol !== "admin") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (url.startsWith("/proveedor") && rol !== "proveedor") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (url.startsWith("/cliente") && rol !== "cliente") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cliente/:path*", "/proveedor/:path*", "/admin/:path*"],
};
