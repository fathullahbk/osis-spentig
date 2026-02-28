// lib/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const cookieStore = await cookies();
  let targetPath = "";

  // 1️⃣ Verifikasi Admin Utama
  if (username === "adminosis" && password === "sekretariat") {
    cookieStore.set("session", "admin", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });
    targetPath = "/admin";
  } 
  // 2️⃣ Verifikasi Admin Bendahara
  else if (username === "bendahara" && password === "bendaharaosis") {
    cookieStore.set("session", "bendahara", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
    });
    targetPath = "/admin/bendahara";
  } 
  // 3️⃣ Jika Salah
  else {
    targetPath = "/login-bendahara?error=1"; // Sesuaikan rute login Anda
  }

  // Redirect harus dilakukan di luar blok if/else jika memungkinkan, 
  // atau pastikan dipanggil paling akhir.
  redirect(targetPath);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  // Memberikan jeda sedikit atau memastikan cookie terhapus sebelum redirect
  redirect("/"); 
}