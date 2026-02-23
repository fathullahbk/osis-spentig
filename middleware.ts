// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Ambil tiket sesi dari cookie (isinya "admin" atau "bendahara")
  const session = request.cookies.get("session")?.value;
  const path = request.nextUrl.pathname;

  // 1️⃣ LOGIKA JIKA SUDAH LOGIN TAPI BUKA HALAMAN LOGIN
  if (path === "/login" && session) {
    // Jika bendahara, lempar ke halamannya. Jika admin utama, lempar ke dashboard admin.
    if (session === "bendahara") {
      return NextResponse.redirect(new URL("/admin/bendahara", request.url));
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 2️⃣ LOGIKA JIKA BELUM LOGIN TAPI MENCOBA MASUK KE /ADMIN
  if (path.startsWith("/admin") && !session) {
    // Tendang kembali ke halaman login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika aman, biarkan lewat
  return NextResponse.next();
}

// Tentukan middleware ini berjalan di /admin dan /login
export const config = {
  matcher: ["/admin/:path*", "/login"],
};