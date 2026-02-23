"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const cookieStore = await cookies();

  // 1️⃣ Verifikasi Admin Utama
  if (username === "adminosis" && password === "sekretariat") {
    // Simpan sesi dengan nilai 'admin'
    cookieStore.set("session", "admin", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });
    
    redirect("/admin");
  } 
  // 2️⃣ Verifikasi Admin Bendahara
  else if (username === "bendahara" && password === "bendaharaosis") {
    // Simpan sesi dengan nilai 'bendahara'
    cookieStore.set("session", "bendahara", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });
    
    // Langsung arahkan ke halaman khusus bendahara
    redirect("/admin/bendahara");
  } 
  // 3️⃣ Jika Salah Semua
  else {
    redirect("/login?error=1");
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/"); 
}