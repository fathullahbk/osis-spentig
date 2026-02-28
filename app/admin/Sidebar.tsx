// app/admin/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions";
import Swal from "sweetalert2"; // Import SweetAlert2
import { toast, Toaster } from "sonner";
import { 
  Menu, X, LayoutDashboard, Calendar, 
  Users, FolderKanban, Globe, LogOut, Wallet 
} from "lucide-react";

interface SidebarProps {
  isBendahara: boolean;
}

export default function Sidebar({ isBendahara }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mencegah hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

 const handleLogout = async () => {
    // Tampilan Modal Konfirmasi Modern
    const result = await Swal.fire({
      title: "Konfirmasi Keluar",
      text: "Apakah Anda yakin ingin mengakhiri sesi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb", // Warna biru-600 (sesuai tema Anda)
      cancelButtonColor: "#64748b", // Warna slate-500
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      background: "#0f172a", // Warna dark sidebar Anda
      color: "#ffffff",
    });

    if (result.isConfirmed) {
      // Tampilkan loading toast
      toast.promise(logoutAction(), {
        loading: "Sedang mengeluarkan sesi...",
        success: "Berhasil keluar!",
        //error: "Gagal keluar, coba lagi.",
      });
    }
  };

  if (!isMounted) return null;

  // Daftar menu lengkap
  const allMenuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, tampilUntukBendahara: false },
    { name: "Masa Bakti", href: "/admin/masa-bakti", icon: Calendar, tampilUntukBendahara: false },
    { name: "Kelola Profil", href: "/admin/profil", icon: Users, tampilUntukBendahara: false },
    { name: "Kelola Program", href: "/admin/program-kerja", icon: FolderKanban, tampilUntukBendahara: false },
    { name: "Kelola Keuangan", href: "/admin/bendahara", icon: Wallet, tampilUntukBendahara: true },
  ];

  // Logic Filter: Jika isBendahara true, hanya ambil yang boleh dilihat bendahara
  // Jika false (admin utama), ambil semua menu.
  const visibleMenuItems = isBendahara 
    ? allMenuItems.filter(item => item.tampilUntukBendahara)
    : allMenuItems;

  return (
    <>
      <Toaster position="top-center" richColors />
      {/* TOMBOL TOGGLE MOBILE */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden fixed top-4 left-4 z-[110] p-2 bg-slate-900 text-white rounded-md shadow-xl border border-slate-700"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside 
        className={`
          fixed inset-y-0 left-0 min-h-screen h-full w-64 bg-[#0f172a] text-white flex flex-col z-[100]
          transition-all duration-300 ease-in-out
          ${isOpen 
            ? "translate-x-0 opacity-100 visible" 
            : "-translate-x-full opacity-0 invisible lg:opacity-100 lg:visible"}
          lg:static lg:translate-x-0 lg:flex
        `}
      >
        {/* Header Section */}
        <div className="p-6 pt-16 lg:pt-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">Admin OSIS</h1>
          <div className="flex items-center gap-2 mt-1">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <p className="text-blue-400 text-[10px] uppercase font-bold tracking-widest">
                {isBendahara ? "Akses Bendahara" : "Portal Manajemen"}
             </p>
          </div>

          <Link 
            href="/" 
            className="flex items-center gap-3 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all text-sm group mt-4 border border-transparent hover:border-slate-700"
          >
            <Globe size={18} className="group-hover:text-blue-400 transition-colors" /> 
            <span>Lihat Website</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {visibleMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-all group ${
                  isActive 
                    ? "bg-blue-600 shadow-lg shadow-blue-900/20 text-white font-medium" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-white" : "group-hover:text-blue-400 transition-colors"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout Section */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a]">
          <button 
          type="button" 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 text-slate-400 hover:text-red-400 w-full text-sm font-medium transition-all rounded-xl hover:bg-red-500/10 group"
      >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Keluar Sesi</span>
      </button>
        </div>
      </aside>
    </>
  );
}