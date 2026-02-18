import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import { writeFile } from "fs/promises";
import path from "path";
import Image from "next/image";

export default async function KelolaProfilPage() {
  // 1. Ambil pilihan Masa Bakti dari database
  const terms = await prisma.term.findMany({
    orderBy: { year: 'desc' },
  });

  // 2. Ambil daftar Profil yang sudah ada
  const profiles = await prisma.profile.findMany({
    include: { term: true },
    orderBy: { id: 'desc' },
  });

  // 3. FUNGSI SIMPAN KE DATABASE & UPLOAD FOTO (Server Action)
  async function addProfile(formData: FormData) {
    "use server";
    
    // Ambil teks dari form
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const vision = formData.get("vision") as string;
    const termId = parseInt(formData.get("termId") as string);
    
    // Ambil file foto dari form
    const file = formData.get("image") as File;
    let imageUrl = null;

    // Logika Upload Foto (jika user memasukkan foto)
    if (file && file.size > 0) {
      // Ubah file menjadi buffer (format kepingan data)
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Buat nama file unik (gabungan waktu sekarang dan nama asli file)
      // spasi diganti dengan strip (-) agar rapi
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      
      // Tentukan lokasi penyimpanan (di dalam public/uploads)
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadDir, fileName);

      // Simpan file ke dalam folder komputer
      await writeFile(filePath, buffer);
      
      // URL yang akan disimpan ke database (bisa dibaca oleh tag <img src="...">)
      imageUrl = `/uploads/${fileName}`;
    }

    // Simpan data teks & URL foto ke database Neon
    await prisma.profile.create({
      data: {
        name: name,
        role: role,
        vision: vision,
        termId: termId,
        imageUrl: imageUrl, // Berdasarkan pesan error-mu sebelumnya, nama kolomnya adalah imageUrl
      },
    });

    // Refresh halaman otomatis
    revalidatePath("/admin/profil");
    revalidatePath("/profil"); 
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
          <Users className="text-green-600" />
          Kelola Profil Pengurus
        </h1>
        <p className="text-slate-500 mt-2">Tambah data dan foto anggota pengurus OSIS.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: FORMULIR TAMBAH PROFIL */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                <UserPlus size={18} className="text-blue-600" />
                Tambah Pengurus Baru
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form action={addProfile} className="space-y-4">
                
                {/* Masa Bakti */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Masa Bakti</label>
                  <select 
                    name="termId" 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">-- Pilih Masa Bakti --</option>
                    {terms.map((term) => (
                      <option key={term.id} value={term.id}>
                        {term.year} {term.isActive ? '(Aktif)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="Contoh: Budi Santoso" 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Jabatan (Role) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jabatan</label>
                  <input 
                    type="text" 
                    name="role" 
                    required 
                    placeholder="Contoh: Ketua OSIS" 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Visi / Kata-kata (Opsional) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Visi Misi Singkat (Opsional)</label>
                  <textarea 
                    name="vision" 
                    rows={3}
                    placeholder="Mewujudkan OSIS yang..." 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  ></textarea>
                </div>

                {/* FOTO PROFIL */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Foto Profil</label>
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*"
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-300 rounded-lg p-1.5 cursor-pointer"
                  />
                  <p className="text-xs text-slate-500 mt-1">Gunakan foto persegi (1:1) agar lebih rapi.</p>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white font-semibold rounded-lg py-2.5 hover:bg-blue-700 transition-colors shadow-sm mt-4"
                >
                  Simpan Profil
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: DAFTAR PROFIL YANG SUDAH ADA */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-700">Daftar Pengurus</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {profiles.length === 0 ? (
                <div className="text-center py-10 text-slate-400 italic">
                  Belum ada profil pengurus yang ditambahkan.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profiles.map((profile) => (
                    <div key={profile.id} className="p-4 border border-slate-100 rounded-lg hover:shadow-md transition-shadow bg-white flex items-center gap-4">
                      {/* Tampilkan Foto atau Avatar Default */}
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                        {profile.imageUrl ? (
                          <Image 
                            src={profile.imageUrl} 
                            alt={profile.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Users size={24} />
                          </div>
                        )}
                      </div>
                      
                      {/* Data Teks */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 truncate">{profile.name}</h3>
                        <p className="text-sm font-medium text-blue-600">{profile.role}</p>
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded mt-1 inline-block">
                          {profile.term?.year}
                        </span>
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