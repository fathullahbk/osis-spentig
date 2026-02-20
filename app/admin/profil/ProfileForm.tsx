"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";

interface ProfileFormProps {
  terms: any[];
  addAction: (formData: FormData) => Promise<void>;
}

export default function ProfileForm({ terms, addAction }: ProfileFormProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null); // Menggunakan ref untuk reset form lebih aman

  async function clientAction(formData: FormData) {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const termId = formData.get("termId") as string;

    if (!termId || !name || !role) {
      toast.error("Mohon lengkapi semua data!");
      return;
    }

    // Tambahkan imageUrl ke formData secara manual sebelum dikirim ke Server Action
    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }
    
    // Tambahkan default vision jika diperlukan oleh skema
    formData.append("vision", "");

    toast.promise(addAction(formData), {
      loading: 'Sedang menyimpan data...',
      success: () => {
        setImageUrl(null);
        formRef.current?.reset(); // Reset form via ref
        return 'Profil pengurus berhasil ditambahkan!';
      },
      error: 'Gagal menyimpan data pengurus.',
    });
  }

  return (
    <Card className="sticky top-6 border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
          <UserPlus size={18} className="text-blue-600" />
          Tambah Pengurus Baru
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form ref={formRef} action={clientAction} className="space-y-4">
          {/* Masa Bakti */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Masa Bakti</label>
            <select name="termId" required className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500/20">
              <option value="">-- Pilih Masa Bakti --</option>
              {terms.map((term) => (
                <option key={term.id} value={term.id}>{term.year}</option>
              ))}
            </select>
          </div>

          {/* Nama & Jabatan */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
            <input type="text" name="name" required className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Masukkan nama..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jabatan</label>
            <input type="text" name="role" required className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Contoh: Ketua Umum" />
          </div>

          {/* Upload Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Foto Profil</label>
            {imageUrl ? (
              <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-2">
                <Image src={imageUrl} alt="Preview" fill className="rounded-lg object-cover border-2 border-blue-100 shadow-md" />
                <button 
                  type="button" 
                  onClick={() => setImageUrl(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors z-20"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="mt-1">
                <UploadDropzone
                  endpoint="profileImage"
                  onUploadProgress={() => setIsUploading(true)}
                  onClientUploadComplete={(res) => {
                    setImageUrl(res[0].url);
                    setIsUploading(false);
                    toast.success("Foto berhasil diunggah!");
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Gagal upload: ${error.message}`);
                    setIsUploading(false);
                  }}
                  content={{
                    label: "Klik atau seret foto ke sini",
                    allowedContent: "Gambar (Maks 2MB)"
                  }}
                  appearance={{
                    container: "border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-8 cursor-pointer hover:bg-slate-100 transition-colors",
                    button: "ut-uploading:cursor-not-allowed bg-blue-600 text-white px-6 py-2 rounded-lg w-full mt-4",
                    label: "text-slate-700 font-medium",
                    allowedContent: "text-slate-500 text-xs mt-1"
                  }}
                />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isUploading}
            className={`w-full text-white font-semibold rounded-lg py-3 transition-all shadow-sm mt-4 active:scale-[0.98] ${
              isUploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isUploading ? "Tunggu, sedang mengunggah..." : "Simpan Profil"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}