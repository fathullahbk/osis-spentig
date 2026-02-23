"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// router tidak lagi dibutuhkan karena logoutAction sudah handle redirect
import { logoutAction } from "@/lib/actions";
import { 
  Menu, X, LayoutDashboard, Calendar, 
  Users, FolderKanban, Globe, LogOut, Wallet 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fungsi logout yang sudah dirapikan
  const handleLogout = async () => {
    console.log("Menghapus sesi...");
    await logoutAction(); 
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* 1. TOMBOL TOGGLE - Z-index paling tinggi */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden fixed top-4 left-4 z-[110] p-2 bg-slate-900 text-white rounded-md shadow-xl border border-slate-700"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 2. OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. SIDEBAR CONTAINER */}
      <aside 
        className={`
          fixed inset-y-0 left-0 min-h-screen h-full w-64 bg-[#0f172a] text-white flex flex-col z-[100]
          transition-all duration-300 ease-in-out
          /* Logika Mobile: Gunakan opacity dan visibility selain transform */
          ${isOpen 
            ? "translate-x-0 opacity-100 visible" 
            : "-translate-x-full opacity-0 invisible lg:opacity-100 lg:visible"}
          /* Logika Desktop: Reset semua properti mobile */
          lg:static lg:translate-x-0 lg:flex
        `}
      >
        {/* Header - Beri jarak agar tidak tertutup tombol toggle di mobile */}
        <div className="p-6 pt-16 lg:pt-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">Admin OSIS</h1>
          <p className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">Portal Manajemen</p>

          <Link 
            href="/" 
            className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all text-sm group"
          >
            <Globe size={18} className="group-hover:text-blue-400" /> Lihat Website
          </Link>

        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {[
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
            { name: "Masa Bakti", href: "/admin/masa-bakti", icon: Calendar },
            { name: "Kelola Profil", href: "/admin/profil", icon: Users },
            { name: "Kelola Program", href: "/admin/program-kerja", icon: FolderKanban },
            { name: "Kelola Bendahara", href: "/admin/bendahara", icon: Wallet },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-all ${
                  isActive ? "bg-blue-600 shadow-lg text-white font-medium" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
            <button 
                type="button" 
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 text-slate-400 hover:text-red-400 w-full text-sm font-medium transition-all rounded-xl hover:bg-red-500/10 group"
            >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                <span>Keluar</span>
            </button>
            </div>
      </aside>
    </>
  );
}