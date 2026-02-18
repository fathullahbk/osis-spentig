"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  // Verifikasi kredensial
  if (username === "adminosis" && password === "sekretariat") {
    // PERBAIKAN: Gunakan await sebelum memanggil cookies()
    const cookieStore = await cookies();
    
    cookieStore.set("session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });
    
    redirect("/admin");
  } else {
    // Jika salah, kirim balik ke login dengan pesan error
    redirect("/login?error=1");
  }
}

export async function logoutAction() {
  const cookieStore = await cookies(); // Gunakan await untuk Next.js terbaru
  cookieStore.delete("session");
  redirect("/"); // Setelah logout, lempar ke halaman login
}