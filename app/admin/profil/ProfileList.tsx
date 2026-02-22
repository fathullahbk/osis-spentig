"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trash2, Edit, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Update Interface agar mengenal onEdit
interface ProfileListProps {
  profiles: any[];
  deleteProfile: (id: number) => Promise<any>;
  onEdit: (profile: any) => void; // Tambahkan ini
}

export default function ProfileList({ profiles, deleteProfile, onEdit }: ProfileListProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);
    
    toast.promise(deleteProfile(id), {
      loading: 'Menghapus data...',
      success: 'Data berhasil dihapus!',
      error: 'Gagal menghapus data.',
    });
    
    setIsDeleting(null);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
          <Users size={20} className="text-slate-500" />
          Daftar Pengurus
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {profiles.length === 0 ? (
          <div className="text-center py-10 text-slate-400 italic">
            Belum ada profil pengurus yang ditambahkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {profiles.map((profile: any) => (
              <div key={profile.id} className="p-4 border border-slate-100 rounded-lg bg-white flex items-center gap-4 group hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
                
                {/* Avatar Section */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                  {profile.imageUrl ? (
                    <Image src={profile.imageUrl} alt={profile.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Users size={24} />
                    </div>
                  )}
                </div>
                
                {/* Info Section */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 truncate">{profile.name}</h3>
                  <p className="text-sm font-medium text-blue-600">{profile.role}</p>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-wider">
                    {profile.term?.year || "N/A"}
                  </span>
                </div>

                {/* Actions Section */}
                <div className="flex gap-1">
                  {/* Tombol Edit sekarang menggunakan onEdit dari props */}
                  <button
                    onClick={() => onEdit(profile)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit Profil"
                  >
                    <Edit size={18} />
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        disabled={isDeleting === profile.id}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                        title="Hapus Profil"
                      >
                        {isDeleting === profile.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Profil Pengurus?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin? Tindakan ini akan menghapus data <strong>{profile.name}</strong> secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(profile.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Ya, Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}