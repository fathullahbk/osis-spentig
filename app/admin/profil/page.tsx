import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Users } from "lucide-react";
import ProfileForm from "./ProfileForm";
import ProfileList from "./ProfileList"; 
import FilterTerm from "../program-kerja/FilterTerm";

export default async function KelolaProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ termId?: string }>;
}) {
  const { termId } = await searchParams;

  const terms = await prisma.term.findMany({ orderBy: { year: 'desc' } });

  // Filter pengurus berdasarkan Masa Bakti di URL
  const profiles = await prisma.profile.findMany({
    where: termId ? { termId: parseInt(termId) } : {},
    include: { term: true },
    orderBy: { name: 'asc' },
  });

  // Action: Tambah Profil
  async function addProfile(data: any) {
    "use server";
    await prisma.profile.create({ data });
    revalidatePath("/admin/profil");
  }

  // Action: Hapus Profil
async function deleteProfile(id: number) {
  "use server";
  
  try {
    await prisma.profile.delete({
      where: { id: id },
    });
    
    // Revalidate agar data di layar langsung terupdate
    revalidatePath("/admin/profil");
    revalidatePath("/profil");
  } catch (error) {
    console.error("Gagal menghapus:", error);
    throw new Error("Gagal menghapus data");
  }
}

  // Action: Edit Profil
  async function updateProfile(id: number, data: any) {
    "use server";
    await prisma.profile.update({
      where: { id },
      data: data,
    });
    revalidatePath("/admin/profil");
  }

return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Kelola Profil Pengurus</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form tetap di kiri seperti program kerja */}
        <div className="lg:col-span-1">
           <ProfileForm terms={terms} addAction={addProfile} />
        </div>

        {/* Daftar Pengurus dengan Filter di atasnya */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <span className="text-sm font-bold text-slate-500 uppercase">Filter Pengurus:</span>
            <FilterTerm terms={terms} /> 
          </div>

          <ProfileList profiles={profiles} />
        </div>
      </div>
    </div>
  );
}