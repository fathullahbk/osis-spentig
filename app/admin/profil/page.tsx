import prisma from "@/lib/prisma";
import FilterTerm from "../program-kerja/FilterTerm";
import ProfileClientManager from "./ProfileClientManager";
import { deleteProfile, createProfile, updateProfile } from "./actions";

export default async function KelolaProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ termId?: string }>;
}) {
  const { termId } = await searchParams;
  
  // Ambil data Masa Bakti untuk dropdown filter dan form
  const terms = await prisma.term.findMany({ 
    orderBy: { year: 'desc' } 
  });

  // Ambil data Profil berdasarkan filter termId
  const profiles = await prisma.profile.findMany({
    where: termId ? { termId: parseInt(termId) } : {},
    include: { term: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Kelola Profil Pengurus</h1>
          <p className="text-slate-500 text-sm">Manajemen data pengurus OSIS Spentig</p>
        </div>

        {/* Filter diletakkan di atas agar bersih */}
        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Filter:
          </span>
          <FilterTerm terms={terms} />
        </div>
      </div>

      {/* Cukup panggil ProfileClientManager saja.
          Komponen ini sudah mengatur tata letak (Grid):
          - Sisi Kiri: ProfileForm (untuk Tambah & Edit)
          - Sisi Kanan: ProfileList (Daftar Pengurus)
      */}
      <ProfileClientManager 
        terms={terms} 
        initialProfiles={profiles} 
        deleteAction={deleteProfile}
        addAction={createProfile}
        updateAction={updateProfile}
      />
    </div>
  );
}