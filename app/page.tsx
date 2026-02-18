import Link from "next/link";
import { Users, LayoutList, LogIn, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* --- Navbar Sederhana (Disinkronkan dengan Layout Admin/Publik) --- */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="font-extrabold text-2xl tracking-tight">
                <span className="text-slate-800">OSIS </span>
                <span className="text-blue-600">SPENTIG</span>
              </Link>
            </div>

            {/* Navigasi Kanan */}
            <nav className="flex items-center gap-4 sm:gap-8">
              <div className="hidden md:flex items-center gap-6">
                <Link href="/profil" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                  Profil Pengurus
                </Link>
                <Link href="/program-kerja" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                  Program Kerja
                </Link>
              </div>

              {/* Tombol Login */}
              <Link 
                href="/login" 
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold text-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Login Admin</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden">
        {/* Dekorasi Background Bulat (Opsional) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-3xl"></div>
        </div>

        <section className="py-20 px-6 text-center w-full">
          <div className="max-w-4xl mx-auto">
            {/* Badge kecil di atas judul */}
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
              <Sparkles size={14} />
              Website Resmi OSIS SMP Negeri 3 Makassar
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
              OSIS Spentig<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Wadah Kolaborasi
              </span>
            </h2>

            <p className="text-lg md:text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              Bersama OSIS, kita ciptakan lingkungan sekolah yang inovatif, kreatif, dan penuh kolaborasi untuk masa depan yang lebih cerah.
            </p>
            
            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/profil" 
                className="group bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <Users size={20} className="group-hover:scale-110 transition-transform" />
                Kenali Pengurus
              </Link>
              <Link 
                href="/program-kerja" 
                className="group bg-white text-slate-700 border-2 border-slate-200 px-10 py-4 rounded-2xl font-bold hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <LayoutList size={20} className="group-hover:scale-110 transition-transform" />
                Lihat Program
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-slate-100 py-10 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <div className="font-bold text-slate-800">OSIS SPENTIG</div>
            <p className="text-sm text-slate-500 max-w-xs">
              Membangun karakter dan kepemimpinan melalui organisasi siswa yang aktif.
            </p>
            <div className="h-px w-12 bg-slate-200 my-2"></div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              © {new Date().getFullYear()} - Dibuat dengan semangat kolaborasi oleh OSIS SMPN 3 Makassar
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}