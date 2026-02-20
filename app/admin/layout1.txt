import Link from "next/link";
import { LayoutDashboard, Users, FolderKanban, LogOut, CalendarRange, Globe } from "lucide-react";
import { logoutAction } from "@/lib/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin OSIS</h2>
          <p className="text-slate-400 text-sm mt-1">Portal Manajemen</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* Link ke Web Publik (Pindah ke sini agar tetap bisa akses depan) */}
          <Link href="/" className="flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mb-4">
            <Globe size={20} className="text-sky-400" /> 
            <span className="font-medium">Lihat Website</span>
          </Link>

          <div className="h-px bg-slate-800 my-2 mx-2"></div>

          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <LayoutDashboard size={20} className="text-blue-400" /> 
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/masa-bakti" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <CalendarRange size={20} className="text-orange-400" /> 
            <span className="font-medium">Masa Bakti</span>
          </Link>
          <Link href="/admin/profil" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <Users size={20} className="text-green-400" /> 
            <span className="font-medium">Kelola Profil</span>
          </Link>
          <Link href="/admin/program-kerja" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <FolderKanban size={20} className="text-purple-400" /> 
            <span className="font-medium">Kelola Program</span>
          </Link>
        </nav>

        {/* Tombol Logout Sebenarnya */}
        <div className="p-4 border-t border-slate-800">
          <form action={logoutAction}>
            <button 
              type="submit" 
              className="flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:text-white hover:bg-red-900/30 w-full transition-all group"
            >
              <LogOut size={20} className="text-red-500 group-hover:scale-110 transition-transform" /> 
              <span className="font-medium">Keluar / Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Utama Kanan */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}