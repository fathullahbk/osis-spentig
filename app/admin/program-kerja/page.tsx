import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, PlusCircle, CheckCircle2, Clock, PlayCircle } from "lucide-react";

export default async function KelolaProgramPage() {
  // 1. Ambil pilihan Masa Bakti (Term) dari database
  const terms = await prisma.term.findMany({
    orderBy: { year: 'desc' },
  });

  // 2. Ambil daftar Program Kerja yang sudah ada
  const programs = await prisma.program.findMany({
    include: { term: true },
    orderBy: { id: 'desc' },
  });

  // 3. FUNGSI SIMPAN KE DATABASE (Server Action)
  async function addProgram(formData: FormData) {
    "use server"; 
    
    // Ambil data dari form HTML
    // Perhatikan: Kita sesuaikan dengan kolom 'title' di schema.prisma
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const termId = parseInt(formData.get("termId") as string);

    // Simpan ke database Neon melalui Prisma
    await prisma.program.create({
      data: {
        title: title,       // Sesuai schema.prisma
        description: description,
        status: status,     // Sesuai schema.prisma
        termId: termId,
      },
    });

    // Refresh halaman otomatis agar data baru langsung muncul
    revalidatePath("/admin/program-kerja");
    revalidatePath("/program-kerja"); 
  }

  // Helper untuk warna status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Terlaksana": return "bg-green-100 text-green-700 border-green-200";
      case "Sedang Berjalan": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <FolderKanban className="text-purple-600" />
          Kelola Program Kerja
        </h1>
        <p className="text-slate-500 mt-2">Tambah dan kelola daftar program kerja OSIS di sini.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: FORMULIR TAMBAH PROGRAM */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                <PlusCircle size={18} className="text-blue-600" />
                Tambah Program Baru
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form action={addProgram} className="space-y-4">
                
                {/* Pilih Masa Bakti */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Masa Bakti</label>
                  <select 
                    name="termId" 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                  >
                    <option value="">-- Pilih Masa Bakti --</option>
                    {terms.map((term) => (
                      <option key={term.id} value={term.id}>
                        {term.year} {term.isActive ? '(Aktif)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nama Program (Title) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Program</label>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    placeholder="Contoh: Class Meeting" 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>

                {/* Status Program */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select 
                    name="status" 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                  >
                    <option value="Belum Terlaksana">Belum Terlaksana</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Terlaksana">Terlaksana</option>
                  </select>
                </div>

                {/* Deskripsi Program */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                  <textarea 
                    name="description" 
                    required 
                    rows={4}
                    placeholder="Jelaskan secara singkat kegiatan ini..." 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white font-bold rounded-lg py-3 hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  Simpan Program
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: DAFTAR PROGRAM YANG SUDAH ADA */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-700">Daftar Program Tersimpan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {programs.length === 0 ? (
                <div className="text-center py-20 text-slate-400 italic">
                  Belum ada program kerja yang ditambahkan.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {programs.map((prog) => (
                    <div key={prog.id} className="p-6 hover:bg-slate-50/50 transition-colors bg-white">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-slate-800 tracking-tight">{prog.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Masa Bakti {prog.term?.year}
                            </span>
                          </div>
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusBadge(prog.status)}`}>
                          {prog.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3 italic">
                        "{prog.description}"
                      </p>
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