// app/admin/page.tsx
import React from "react";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Calendar } from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  // 1️⃣ Ambil Masa Bakti Aktif
  const activeTerm = await prisma.term.findFirst({
    orderBy: { year: "desc" },
  });

  // 2️⃣ Ambil data paralel
  const [profiles, programs] = await Promise.all([
    prisma.profile.findMany({
      where: { termId: activeTerm?.id || 0 },
      include: { term: true },
      orderBy: { name: "asc" },
    }),
    prisma.program.findMany({
      where: { termId: activeTerm?.id || 0 },
      include: { term: true, leader: true }, // 'leader' digunakan untuk mengambil nama Penanggung Jawab
      orderBy: { id: "desc" },
    }),
  ]);

  // ===============================
  // 🔥 LOGIC KELOMPOK JABATAN
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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-10">
      {/* Header Dashboard */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Dashboard Admin
        </h1>
        <p className="text-slate-500 mt-1">
          Data berdasarkan Masa Bakti Aktif:{" "}
          {activeTerm?.year || "Belum Ada"}
        </p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-blue-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Pengurus Aktif
            </CardTitle>
            <Users size={20} className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {profiles.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Data profil tercatat
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-purple-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Program Kerja
            </CardTitle>
            <ClipboardList size={20} className="text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {programs.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Program siap dijalankan
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-green-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Masa Bakti Aktif
            </CardTitle>
            <Calendar size={20} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {activeTerm?.year || "-"}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Periode saat ini
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ============================= */}
      {/* TABEL PENGURUS KELOMPOK */}
      {/* ============================= */}
      <Card className="bg-white shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-4 pt-5">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
            <Users size={20} className="text-blue-600" />
            Daftar Pengurus Aktif ({activeTerm?.year})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b">
                <tr>
                  <th className="px-6 py-4 w-20">NO</th>
                  <th className="px-6 py-4">JABATAN</th>
                  <th className="px-6 py-4">NAMA LENGKAP</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* Jabatan Inti */}
                {jabatanInti.map((p, index) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">
                      {p.role}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {p.name}
                    </td>
                  </tr>
                ))}

                {/* Per Bidang */}
                {sortedBidangNumbers.map((bidangNumber) => {
                  const bidang = bidangMap[bidangNumber];

                  return (
                    <React.Fragment key={bidangNumber}>
                      {/* Header Bidang */}
                      <tr className="bg-blue-50/50">
                        <td
                          colSpan={3}
                          className="px-6 py-3 font-bold text-blue-700 text-xs uppercase tracking-wider"
                        >
                          Bidang {bidangNumber}
                        </td>
                      </tr>

                      {/* Ketua */}
                      {bidang.ketua && (
                        <tr className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-400">-</td>
                          <td className="px-6 py-4 text-blue-600 font-medium">
                            {bidang.ketua.role}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {bidang.ketua.name}
                          </td>
                        </tr>
                      )}

                      {/* Wakil */}
                      {bidang.wakil && (
                        <tr className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-400">-</td>
                          <td className="px-6 py-4 text-blue-600 font-medium">
                            {bidang.wakil.role}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {bidang.wakil.name}
                          </td>
                        </tr>
                      )}

                      {/* Anggota */}
                      {bidang.anggota.map((anggota) => (
                        <tr key={anggota.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-400">-</td>
                          <td className="px-6 py-4 text-blue-600 font-medium">
                            {anggota.role}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            {anggota.name}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}

                {profiles.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-8 text-slate-400"
                    >
                      Belum ada data pengurus.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ============================= */}
      {/* TABEL PROGRAM KERJA           */}
      {/* ============================= */}
      <Card className="bg-white shadow-sm border-slate-200 overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-4 pt-5">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
            <ClipboardList size={20} className="text-purple-600" />
            Daftar Program Kerja ({activeTerm?.year})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold border-b">
                <tr>
                  <th className="px-6 py-4 w-20">NO</th>
                  <th className="px-6 py-4">NAMA PROGRAM</th>
                  <th className="px-6 py-4">PENANGGUNG JAWAB</th>
                  <th className="px-6 py-4">STATUS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {programs.map((prog, index) => (
                  <tr key={prog.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {prog.title}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {/* Mengambil nama dari relasi 'leader', tampilkan "-" jika kosong */}
                      {prog.leader?.name || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {/* Menambahkan warna badge sederhana berdasarkan status (Opsional: bisa disesuaikan dengan nilai status Anda) */}
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        prog.status === "Terlaksana" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {prog.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {programs.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-8 text-slate-400"
                    >
                      Belum ada program kerja.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}