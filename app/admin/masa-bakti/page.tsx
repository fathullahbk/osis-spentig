import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange, PlusCircle } from "lucide-react";

export default async function KelolaMasaBaktiPage() {
  // Ambil semua data masa bakti dari database
  const terms = await prisma.term.findMany({
    orderBy: { year: 'desc' },
  });

  // Fungsi Server Action untuk menyimpan Masa Bakti
  async function addTerm(formData: FormData) {
    "use server";
    
    const year = formData.get("year") as string;
    const isActive = formData.get("isActive") === "on"; // Cek apakah checkbox dicentang

    // Jika yang baru ini diset Aktif, nonaktifkan semua masa bakti yang lain terlebih dahulu
    if (isActive) {
      await prisma.term.updateMany({
        data: { isActive: false },
      });
    }

    // Simpan masa bakti baru ke database
    await prisma.term.create({
      data: {
        year: year,
        isActive: isActive,
      },
    });

    // Refresh halaman agar data baru langsung muncul
    revalidatePath("/admin/masa-bakti");
    revalidatePath("/admin/program-kerja"); 
    revalidatePath("/admin/profil"); 
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <CalendarRange className="text-orange-600" />
          Kelola Masa Bakti
        </h1>
        <p className="text-slate-500 mt-2">Tentukan periode kepengurusan OSIS (Contoh: 2023/2024).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* FORM TAMBAH MASA BAKTI */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                <PlusCircle size={18} className="text-blue-600" />
                Tambah Masa Bakti
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form action={addTerm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tahun Periode</label>
                  <input 
                    type="text" 
                    name="year" 
                    required 
                    placeholder="Contoh: 2024/2025" 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 mt-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    id="isActive"
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-blue-900 cursor-pointer">
                    Jadikan Masa Bakti Aktif
                  </label>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Hanya boleh ada 1 masa bakti yang aktif pada satu waktu.
                </p>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white font-semibold rounded-lg py-2.5 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Simpan Periode
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* DAFTAR MASA BAKTI */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-700">Daftar Masa Bakti</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {terms.length === 0 ? (
                <div className="text-center py-10 text-slate-400 italic">
                  Belum ada masa bakti yang ditambahkan.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {terms.map((term) => (
                    <div key={term.id} className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${term.isActive ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-200'}`}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-800">{term.year}</h3>
                        {term.isActive ? (
                          <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Aktif
                          </span>
                        ) : (
                          <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                            Selesai
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}