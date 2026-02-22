"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createProfile(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const termId = formData.get("termId") as string;
    const imageUrl = formData.get("imageUrl") as string;

    // Validasi dasar di sisi server
    if (!name || !role || !termId) {
      return { error: "Data nama, jabatan, dan masa bakti wajib diisi." };
    }

    await prisma.profile.create({
      data: {
        name,
        role,
        termId: parseInt(termId),
        // Jika imageUrl kosong/string kosong, simpan sebagai null (Opsional)
        imageUrl: imageUrl || null,
        vision: "", 
      },
    });

    revalidatePath("/admin/profil");
    return { success: true };
  } catch (error) {
    console.error("Create Error:", error);
    return { error: "Gagal menyimpan data ke database" };
  }
}

export async function updateProfile(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const termId = formData.get("termId") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!id || !name || !role || !termId) {
      return { error: "Data tidak lengkap untuk pembaruan." };
    }

    await prisma.profile.update({
      where: { id },
      data: {
        name,
        role,
        termId: parseInt(termId),
        // Memungkinkan menghapus foto dengan mengirimkan string kosong
        imageUrl: imageUrl || null,
      },
    });

    revalidatePath("/admin/profil");
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "Gagal memperbarui data di database" };
  }
}

export async function deleteProfile(id: number) {
  try {
    await prisma.profile.delete({
      where: { id },
    });

    revalidatePath("/admin/profil");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "Gagal menghapus data dari database" };
  }
}

export async function getProfiles() {
  try {
    return await prisma.profile.findMany({
      include: { term: true },
      // Mengurutkan berdasarkan nama agar daftar lebih rapi secara alfabet
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}