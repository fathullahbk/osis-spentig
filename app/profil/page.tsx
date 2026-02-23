import React from "react";
import prisma from "@/lib/prisma";
import { Users } from "lucide-react";

export default async function StrukturPengurusPage() {
  // Ambil masa bakti terbaru (Aktif)
  const activeTerm = await prisma.term.findFirst({
    orderBy: { year: "desc" },
  });

  // Ambil pengurus pada masa bakti tersebut
  const profiles = await prisma.profile.findMany({
    where: { termId: activeTerm?.id },
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

  // 1️⃣ Pisahkan Jabatan Inti
  const jabatanInti = profiles
    .filter((p) => jabatanIntiList.includes(p.role))
    .sort(
      (a, b) =>
        jabatanIntiList.indexOf(a.role) -
        jabatanIntiList.indexOf(b.role)
    );

  // 2️⃣ Kelompokkan per Bidang
  const bidangMap: Record<
    number,
    { ketua?: any; wakil?: any; anggota: any[] }
  > = {};

  profiles.forEach((p) => {
    const match = p.role.match(
      /(Ketua|Wakil Ketua|Anggota) Bidang (\d+)/
    );

    if (match) {
      const [, posisi, nomor] = match;
      const bidangNumber = parseInt(nomor);

      if (!bidangMap[bidangNumber]) {
        bidangMap[bidangNumber] = { anggota: [] };
      }

      if (posisi === "Ketua") bidangMap[bidangNumber].ketua = p;
      else if (posisi === "Wakil Ketua")
        bidangMap[bidangNumber].wakil = p;
      else bidangMap[bidangNumber].anggota.push(p);
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
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

      {/* Tabel */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider w-16">
                No
              </th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">
                Nama Lengkap
              </th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-blue-600">
                Jabatan
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {profiles.length > 0 ? (
              <>
                {/* ===== Jabatan Inti ===== */}
                {jabatanInti.map((p, index) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-blue-600 font-medium">
                      {p.role}
                    </td>
                  </tr>
                ))}

                {/* ===== Per Bidang ===== */}
                {sortedBidangNumbers.map((bidangNumber) => {
                  const bidang = bidangMap[bidangNumber];

                  return (
                    <React.Fragment key={bidangNumber}>
                      {/* Header Bidang */}
                      <tr className="bg-blue-50">
                        <td
                          colSpan={3}
                          className="px-6 py-3 font-bold text-blue-700"
                        >
                          Bidang {bidangNumber}
                        </td>
                      </tr>

                      {/* Ketua */}
                      {bidang.ketua && (
                        <tr className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-400">-</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {bidang.ketua.name}
                          </td>
                          <td className="px-6 py-4 text-blue-600">
                            {bidang.ketua.role}
                          </td>
                        </tr>
                      )}

                      {/* Wakil */}
                      {bidang.wakil && (
                        <tr className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-400">-</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {bidang.wakil.name}
                          </td>
                          <td className="px-6 py-4 text-blue-600">
                            {bidang.wakil.role}
                          </td>
                        </tr>
                      )}

                      {/* Anggota */}
                      {bidang.anggota.map((anggota) => (
                        <tr key={anggota.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-400">-</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {anggota.name}
                          </td>
                          <td className="px-6 py-4 text-blue-600">
                            {anggota.role}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </>
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-10 text-center text-slate-400 italic"
                >
                  Belum ada data pengurus untuk masa bakti ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <a href="/" className="text-sm text-blue-600 hover:underline">
          ← Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}