// app/profil/page.tsx
import React from "react";
import prisma from "@/lib/prisma";
import { Users, Filter } from "lucide-react";

// Mencegah caching agar data selalu update saat pengguna memilih tahun
export const revalidate = 0;

export default async function StrukturPengurusPage({
  searchParams,
}: {
  // Menyesuaikan tipe data untuk Next.js terbaru
  searchParams: Promise<{ year?: string }> | { year?: string }; 
}) {
  // 1️⃣ Ambil SEMUA masa bakti untuk pilihan di dropdown
  const allTerms = await prisma.term.findMany({
    orderBy: { year: "desc" },
  });

  // 2️⃣ Tentukan masa bakti yang sedang Aktif / Dipilih
  // 🔥 PERBAIKAN: Gunakan await karena searchParams adalah Promise di Next.js 15+
  const resolvedSearchParams = await searchParams;
  const selectedYear = resolvedSearchParams?.year;
  
  let activeTerm = null;
  if (selectedYear) {
    activeTerm = allTerms.find((t) => t.year.toString() === selectedYear);
  }
  
  // Jika tidak ada parameter URL atau tahun tidak ditemukan, gunakan yang terbaru
  if (!activeTerm && allTerms.length > 0) {
    activeTerm = allTerms[0];
  }

  // 3️⃣ Ambil pengurus HANYA pada masa bakti yang dipilih
  const profiles = await prisma.profile.findMany({
    where: { termId: activeTerm?.id || 0 },
    orderBy: { name: "asc" },
  });

  // ===============================
  // 🔥 LOGIC URUT & KELOMPOK
  // ===============================

  const jabatanIntiList = [
    "Ketua Umum",
    "Wakil Ketua Umum",
    "Sekretaris Umum",
    "Bendahara Umum",
  ];

  // Pisahkan Jabatan Inti
  const jabatanInti = profiles
    .filter((p) => jabatanIntiList.includes(p.role))
    .sort(
      (a, b) =>
        jabatanIntiList.indexOf(a.role) -
        jabatanIntiList.indexOf(b.role)
    );

  // Kelompokkan per Bidang & Tampung yang tidak terfilter
  const bidangMap: Record<
    number,
    { ketua: any[]; wakil: any[]; anggota: any[] }
  > = {};
  
  const pengurusLainnya: any[] = []; 

  profiles.forEach((p) => {
    if (jabatanIntiList.includes(p.role)) return;

    const match = p.role.match(/(Ketua|Wakil Ketua|Anggota|Anggot)\s*Bidang\s*(\d+)/i);

    if (match) {
      const posisiStr = match[1].toLowerCase();
      const bidangNumber = parseInt(match[2]);

      if (!bidangMap[bidangNumber]) {
        bidangMap[bidangNumber] = { ketua: [], wakil: [], anggota: [] };
      }

      if (posisiStr === "ketua") {
        bidangMap[bidangNumber].ketua.push(p);
      } else if (posisiStr === "wakil ketua") {
        bidangMap[bidangNumber].wakil.push(p);
      } else {
        bidangMap[bidangNumber].anggota.push(p);
      }
    } else {
      pengurusLainnya.push(p);
    }
  });

  const sortedBidangNumbers = Object.keys(bidangMap)
    .map(Number)
    .sort((a, b) => a - b);

  // ===============================
  // UI
  // ===============================

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Tombol Kembali di Atas */}
      <div className="mb-6">
        <a href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors">
          ← Kembali ke Beranda
        </a>
      </div>

      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b pb-4">
        
        {/* KIRI: Ikon & Judul */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Struktur Pengurus OSIS
            </h1>
            <p className="text-slate-500 text-sm">
              Masa Bakti {activeTerm?.year || "-"}
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
                className="w-full sm:w-auto border border-slate-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
              >
                {allTerms.map((term) => (
                  <option key={term.id} value={term.year}>
                    {term.year}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Lihat
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tabel */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider w-16">No</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Nama Lengkap</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-blue-600">Jabatan</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {profiles.length > 0 ? (
              <>
                {/* ===== Jabatan Inti ===== */}
                {jabatanInti.map((p, index) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{p.name}</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">{p.role}</td>
                  </tr>
                ))}

                {/* ===== Per Bidang ===== */}
                {sortedBidangNumbers.map((bidangNumber) => {
                  const bidang = bidangMap[bidangNumber];

                  return (
                    <React.Fragment key={bidangNumber}>
                      {/* Header Bidang */}
                      <tr className="bg-blue-50">
                        <td colSpan={3} className="px-6 py-3 font-bold text-blue-700">
                          Bidang {bidangNumber}
                        </td>
                      </tr>

                      {/* Ketua */}
                      {bidang.ketua.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-400">-</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{p.name}</td>
                          <td className="px-6 py-4 text-blue-600">{p.role}</td>
                        </tr>
                      ))}

                      {/* Wakil */}
                      {bidang.wakil.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-400">-</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{p.name}</td>
                          <td className="px-6 py-4 text-blue-600">{p.role}</td>
                        </tr>
                      ))}

                      {/* Anggota */}
                      {bidang.anggota.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-400">-</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{p.name}</td>
                          <td className="px-6 py-4 text-blue-600">{p.role}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}

                {/* ===== Pengurus Lainnya ===== */}
                {pengurusLainnya.length > 0 && (
                  <React.Fragment>
                    <tr className="bg-slate-50 border-t-2 border-slate-200">
                      <td colSpan={3} className="px-6 py-3 font-bold text-amber-600">
                        Lainnya (Jabatan Tidak Dikenali/Typo)
                      </td>
                    </tr>
                    {pengurusLainnya.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-400">-</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{p.name}</td>
                        <td className="px-6 py-4 text-amber-600">{p.role}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                )}
              </>
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">
                  Belum ada data pengurus untuk masa bakti {activeTerm?.year}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}