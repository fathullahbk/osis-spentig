// app/admin/page.tsx
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Calendar } from "lucide-react";

export default async function DashboardPage() {
  // 1. Cari Masa Bakti yang aktif (tahun terbaru)
  const activeTerm = await prisma.term.findFirst({
    orderBy: { year: 'desc' },
  });

  // 2. Ambil data yang hanya berkaitan dengan Masa Bakti aktif
  const [profiles, programs] = await Promise.all([
    prisma.profile.findMany({
      where: { termId: activeTerm?.id },
      include: { term: true },
      orderBy: { name: 'asc' },
    }),
    prisma.program.findMany({
      where: { termId: activeTerm?.id },
      include: { term: true, leader: true },
      orderBy: { id: 'desc' },
    })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Admin</h1>
        <p className="text-slate-500">Data berdasarkan Masa Bakti Aktif: {activeTerm?.year}</p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Pengurus Aktif</CardTitle>
            <Users size={20} className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles.length}</div>
            <p className="text-xs text-slate-400">Data profil tercatat</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Program Kerja</CardTitle>
            <ClipboardList size={20} className="text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs.length}</div>
            <p className="text-xs text-slate-400">Program siap dijalankan</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Masa Bakti Aktif</CardTitle>
            <Calendar size={20} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTerm?.year}</div>
            <p className="text-xs text-slate-400">Periode saat ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Pengurus Aktif */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users size={18} className="text-blue-600" /> Daftar Pengurus Aktif ({activeTerm?.year})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Jabatan</th>
                <th className="px-4 py-3">Nama Lengkap</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {profiles.map((p, index) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 text-blue-600 font-medium">{p.role}</td>
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr><td colSpan={3} className="text-center py-4 text-slate-400">Belum ada data pengurus di periode ini.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Tabel Program Kerja Aktif */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList size={18} className="text-purple-600" /> Daftar Program Kerja ({activeTerm?.year})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Nama Program</th>
                <th className="px-4 py-3">PJ (Penanggung Jawab)</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {programs.map((prog, index) => (
                <tr key={prog.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-semibold">{prog.title}</td>
                  <td className="px-4 py-3 text-slate-600">{prog.leader?.name || "Belum ditentukan"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      prog.status === 'Terlaksana' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {prog.status}
                    </span>
                  </td>
                </tr>
              ))}
              {programs.length === 0 && (
                <tr><td colSpan={4} className="text-center py-4 text-slate-400">Belum ada program kerja di periode ini.</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}