// app/program-kerja/page.tsx
import React from "react";
import prisma from "@/lib/prisma";
import { ClipboardList, CheckCircle2, Clock, Filter } from "lucide-react";

// Mencegah caching agar data selalu update saat pengguna memilih tahun
export const revalidate = 0;

export default async function ProgramKerjaPublicPage({
  searchParams,
}: {
  // Menyesuaikan tipe data untuk Next.js terbaru
  searchParams: Promise<{ year?: string }> | { year?: string }; 
}) {
  // 1️⃣ Ambil SEMUA masa bakti untuk pilihan di dropdown
  const allTerms = await prisma.term.findMany({
    orderBy: { year: 'desc' },
  });

  // 2️⃣ Tentukan masa bakti yang sedang Aktif / Dipilih berdasarkan parameter URL
  // 🔥 PERBAIKAN: Gunakan await karena searchParams adalah Promise di Next.js 15+
  const resolvedSearchParams = await searchParams;
  const selectedYear = resolvedSearchParams?.year;
  
  let activeTerm = null;
  if (selectedYear) {
    // Gunakan .toString() agar tipe Number dari database cocok dengan String dari URL
    activeTerm = allTerms.find((t) => t.year.toString() === selectedYear);
  }
  
  // Jika tidak ada parameter URL atau tahun tidak ditemukan, gunakan yang terbaru
  if (!activeTerm && allTerms.length > 0) {
    activeTerm = allTerms[0];
  }

  // 3️⃣ Mengambil program kerja yang sesuai dengan masa bakti yang dipilih
  const programs = await prisma.program.findMany({
    where: { termId: activeTerm?.id || 0 },
    include: { leader: true },
    orderBy: { id: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      
      {/* Tombol Kembali di Atas */}
      <div className="mb-6">
        <a href="/" className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline transition-colors">
          ← Kembali ke Beranda
        </a>
      </div>

      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b pb-6">
        
        {/* KIRI: Ikon & Judul */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <ClipboardList className="text-purple-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Program Kerja OSIS</h1>
            <p className="text-slate-500 text-sm">
              Transparansi inisiatif dan kegiatan untuk Masa Bakti {activeTerm?.year || "-"}
            </p>
          </div>
        </div>

        {/* KANAN: Form Filter Dropdown */}
        {allTerms.length > 0 && (
          <form method="GET" className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400 hidden sm:block" />
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                name="year"
                defaultValue={activeTerm?.year?.toString()}
                className="w-full sm:w-auto border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
              >
                {allTerms.map((term) => (
                  <option key={term.id} value={term.year}>
                    {term.year}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Lihat
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tabel Program Kerja */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider w-16 text-center">No</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Program Kerja</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Penanggung Jawab</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {programs.length > 0 ? (
              programs.map((prog, index) => (
                <tr key={prog.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-medium text-center">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{prog.title}</div>
                    {prog.description && (
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic">
                        "{prog.description}"
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">
                    {prog.leader?.name || (
                      <span className="text-slate-400 text-xs italic">Belum ditentukan</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      prog.status === 'Terlaksana' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {prog.status === 'Terlaksana' ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {prog.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                  Belum ada program kerja yang tercatat untuk periode {activeTerm?.year}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}