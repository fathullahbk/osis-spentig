"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Edit3, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";

interface ProfileFormProps {
  terms: any[];
  addAction: (formData: FormData) => Promise<any>;
  updateAction?: (id: number, formData: FormData) => Promise<any>;
  editData?: any;
  setEditData?: (data: any) => void;
}

export default function ProfileForm({ 
  terms, 
  addAction, 
  updateAction, 
  editData, 
  setEditData 
}: ProfileFormProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Perbaikan Error: 'possibly null' dengan pengecekan dan type casting
  useEffect(() => {
    if (editData && formRef.current) {
      setImageUrl(editData.imageUrl || null);
      
      // Akses elemen dengan casting agar TypeScript tidak error
      const form = formRef.current;
      (form.elements.namedItem("name") as HTMLInputElement).value = editData.name || "";
      (form.elements.namedItem("role") as HTMLInputElement).value = editData.role || "";
      (form.elements.namedItem("termId") as HTMLSelectElement).value = editData.termId.toString();
    } else {
      setImageUrl(null);
      formRef.current?.reset();
    }
  }, [editData]);

  async function clientAction(formData: FormData) {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const termId = formData.get("termId") as string;

    // FOTO OPSIONAL: Syarat !imageUrl dihapus dari validasi ini
    if (!name || !role || !termId) {
      toast.error("Mohon lengkapi Nama, Jabatan, dan Masa Bakti!");
      return;
    }

    setIsSubmitting(true);

    const dataToSend = new FormData();
    dataToSend.append("name", name);
    dataToSend.append("role", role);
    dataToSend.append("termId", termId);
    // Jika imageUrl null, kirim string kosong agar diterima server sebagai null/opsional
    dataToSend.append("imageUrl", imageUrl || "");

    try {
      let res;
      if (editData && updateAction) {
        res = await updateAction(editData.id, dataToSend);
      } else {
        res = await addAction(dataToSend);
      }

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(editData ? 'Profil diperbarui!' : 'Profil ditambahkan!');
        setImageUrl(null);
        formRef.current?.reset();
        if (setEditData) setEditData(null); 
      }
    } catch (err) {
      toast.error('Gagal memproses data.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="sticky top-6 border-slate-200 shadow-sm">
      <CardHeader className={`${editData ? 'bg-amber-50' : 'bg-slate-50'} border-b border-slate-100 pb-4`}>
        <CardTitle className="text-lg flex items-center justify-between text-slate-700 font-bold">
          <div className="flex items-center gap-2">
            {editData ? (
              <>
                <Edit3 size={18} className="text-amber-600" />
                Edit Profil Pengurus
              </>
            ) : (
              <>
                <UserPlus size={18} className="text-blue-600" />
                Tambah Pengurus Baru
              </>
            )}
          </div>
          {editData && (
            <button 
              type="button" 
              onClick={() => setEditData?.(null)}
              className="text-xs bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-100"
            >
              Batal Edit
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form ref={formRef} action={clientAction} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Masa Bakti</label>
            <select 
              name="termId" 
              required 
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
            >
              <option value="">-- Pilih Masa Bakti --</option>
              {terms.map((term) => (
                <option key={term.id} value={term.id}>{term.year}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" 
                placeholder="Masukkan nama lengkap..." 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jabatan</label>
              <input 
                type="text" 
                name="role" 
                required 
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" 
                placeholder="Contoh: Ketua Umum" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Foto Profil <span className="text-[10px] text-slate-400 font-normal italic">(Opsional)</span>
            </label>
            {imageUrl ? (
              <div className="relative w-full aspect-square max-w-[160px] mx-auto mb-2 group">
                <Image 
                  src={imageUrl} 
                  alt="Preview" 
                  fill 
                  className="rounded-2xl object-cover border-4 border-white shadow-xl ring-1 ring-slate-200" 
                />
                <button 
                  type="button" 
                  onClick={() => setImageUrl(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-all hover:scale-110 z-20"
                >
                  <X size={14} />
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
                    toast.success("Foto berhasil diproses!");
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Gagal upload: ${error.message}`);
                    setIsUploading(false);
                  }}
                  appearance={{
                    container: "border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-6 hover:bg-blue-50/30 hover:border-blue-300 transition-all",
                    button: "bg-blue-600 text-sm font-semibold rounded-lg",
                    label: "text-slate-600 text-sm",
                  }}
                />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isUploading || isSubmitting}
            className={`w-full text-white font-bold rounded-xl py-3.5 transition-all shadow-lg mt-4 flex items-center justify-center gap-2 active:scale-95 ${
              (isUploading || isSubmitting) 
                ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                : editData 
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {editData ? "Memperbarui..." : "Menyimpan..."}
              </>
            ) : isUploading ? (
              "Tunggu Upload..."
            ) : (
              editData ? "Simpan Perubahan" : "Simpan Profil Pengurus"
            )}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}