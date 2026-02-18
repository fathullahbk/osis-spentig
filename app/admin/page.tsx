import prisma from "@/lib/prisma"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, CalendarRange, List } from "lucide-react";

export default async function AdminDashboard() {
  // 1. Ambil data secara paralel dari database (Sekarang kita juga mengambil 'profiles')
  const [totalPengurus, totalProgram, masaBaktiAktif, profiles] = await Promise.all([
    prisma.profile.count(),
    prisma.program.count(),
    prisma.term.findFirst({
      where: { isActive: true },
    }),
    // Mengambil semua data profil, diurutkan dari yang terbaru, dan sertakan data masa baktinya
    prisma.profile.findMany({
      include: { term: true },
      orderBy: { id: 'desc' }
    }),
  ]);

  return (
    <div className="space-y-8"> {/* Mengubah space-y-6 menjadi 8 agar jarak ke tabel lebih lega */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Admin</h1>
        <p className="text-slate-500 mt-2">Selamat datang di panel kontrol website OSIS SPENTIG.</p>
      </div>

      {/* --- Kartu Statistik Cepat --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Pengurus</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalPengurus}</div>
            <p className="text-xs text-slate-500 mt-1">Data profil tercatat</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Program Kerja</CardTitle>
            <FolderKanban className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalProgram}</div>
            <p className="text-xs text-slate-500 mt-1">Program siap dijalankan</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Masa Bakti Aktif</CardTitle>
            <CalendarRange className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {masaBaktiAktif ? masaBaktiAktif.year : "Belum Diatur"}
            </div>
            <p className="text-xs text-slate-500 mt-1">Periode saat ini</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Tabel Daftar Semua Pengurus --- */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4 flex flex-row items-center gap-2">
          <List className="text-blue-600" size={20} />
          <CardTitle className="text-lg text-slate-700">Daftar Semua Pengurus</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold w-16 text-center">No</th>
                <th scope="col" className="px-6 py-4 font-bold">Jabatan</th>
                <th scope="col" className="px-6 py-4 font-bold">Nama Lengkap</th>
                {/* Tambahan kolom Masa Bakti agar jelas pengurus tahun berapa */}
                <th scope="col" className="px-6 py-4 font-bold">Masa Bakti</th> 
              </tr>
            </thead>
            <tbody>
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                    Belum ada data pengurus yang diinputkan.
                  </td>
                </tr>
              ) : (
                profiles.map((profile, index) => (
                  <tr key={profile.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-center font-medium">{index + 1}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600">{profile.role}</td>
                    <td className="px-6 py-4 text-slate-800">{profile.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200">
                        {profile.term?.year}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}