"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ChevronDown, CheckCircle2, Clock, PlayCircle, Loader2, User } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProgramList({ programs, deleteProgram, updateProgramStatus }: any) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Terlaksana": return "bg-green-100 text-green-700 border-green-200";
      case "Sedang Berjalan": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    toast.promise(updateProgramStatus(id, status), {
      loading: 'Updating status...',
      success: 'Status diperbarui!',
      error: 'Gagal update status.',
    });
  };

  const handleDelete = async (id: number) => {
    setLoadingId(id);
    toast.promise(deleteProgram(id), {
      loading: 'Menghapus program...',
      success: () => {
        setLoadingId(null);
        return 'Program berhasil dihapus!';
      },
      error: () => {
        setLoadingId(null);
        return 'Gagal menghapus.';
      },
    });
  };

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg text-slate-700">Daftar Program Tersimpan</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {programs.length === 0 ? (
          <div className="text-center py-20 text-slate-400 italic">Belum ada program kerja.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {programs.map((prog: any) => (
              <div key={prog.id} className="p-6 hover:bg-slate-50/50 transition-colors bg-white group">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 tracking-tight">{prog.title}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                      Masa Bakti {prog.term?.year}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-[11px] font-semibold text-slate-600">
                        <User size={12} />
                        PJ: {prog.leader ? prog.leader.name : "Belum ditentukan"}
                    </div>
                    </div>
                  <div className="flex items-center gap-2">
                    {/* DROPDOWN EDIT STATUS */}
                    <DropdownMenu>
                      <DropdownMenuTrigger className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border flex items-center gap-2 outline-none ${getStatusStyle(prog.status)}`}>
                        {prog.status} <ChevronDown size={14} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleUpdateStatus(prog.id, "Belum Terlaksana")} className="gap-2">
                          <Clock size={16} className="text-amber-500" /> Belum Terlaksana
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(prog.id, "Sedang Berjalan")} className="gap-2">
                          <PlayCircle size={16} className="text-blue-500" /> Sedang Berjalan
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(prog.id, "Terlaksana")} className="gap-2">
                          <CheckCircle2 size={16} className="text-green-500" /> Terlaksana
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* ALERT DIALOG HAPUS */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          {loadingId === prog.id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Program Kerja?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak bisa dibatalkan. Data program <strong>{prog.title}</strong> akan hilang selamanya.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(prog.id)} className="bg-red-600 hover:bg-red-700">Ya, Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{prog.description}"</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}