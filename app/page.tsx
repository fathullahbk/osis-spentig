import Link from "next/link";
import Image from "next/image";
import { Users, LayoutList, LogIn, Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* --- Navbar --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 transition-transform group-hover:rotate-12">
                <Image 
                  src="/logo-osis.png" 
                  alt="Logo OSIS"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight leading-none text-slate-800 uppercase">
                  OSIS <span className="text-blue-600">SPENTIG</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Makassar</span>
              </div>
            </Link>

            {/* Navigasi Kanan (Menu Pindahan dari Footer + Login) */}
            <nav className="flex items-center gap-4 sm:gap-8">
              {/* Menu Navigasi - Muncul di Desktop & HP */}
              <div className="flex items-center gap-4 sm:gap-8 mr-2 sm:mr-4">
                <Link href="/profil" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider">
                  Profil
                </Link>
                <Link href="/program-kerja" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wider">
                  Program
                </Link>
              </div>

              {/* Tombol Portal Admin */}
              <Link 
                href="/login" 
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold text-sm hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-100 transition-all active:scale-95"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden py-12">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-60 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
        </div>

        <section className="px-6 text-center w-full">
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            
            {/* Main Logo Content */}
<div className="relative w-full max-w-sm h-48 md:h-64 mb-10 animate-fade-in-up flex items-center justify-center">
  {/* Efek Glow Utama */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-[100px] opacity-20 animate-pulse"></div>

  {/* Container Logo Sekolah (Kiri-Belakang) */}
  <div className="relative w-32 h-32 md:w-44 md:h-44 -mr-8 md:-mr-12 z-10 transition-transform hover:-translate-x-4 duration-500">
    <Image 
      src="/logo-sekolah.png" 
      alt="Logo Sekolah"
      fill
      priority
      className="object-contain drop-shadow-2xl"
    />
  </div>

  {/* Container Logo OSIS (Kanan-Depan) */}
  <div className="relative w-36 h-36 md:w-52 md:h-52 z-20 transition-transform hover:scale-110 duration-500">
    <Image 
      src="/logo-osis.png" 
      alt="Logo OSIS"
      fill
      priority
      className="object-contain drop-shadow-2xl"
    />
  </div>
</div>
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-[ -0.04em] leading-tight">
              Inovasi dalam <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
                Kolaborasi Siswa
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl font-medium">
              Wadah aspirasi dan kreativitas siswa SMPN 3 Makassar untuk membentuk generasi unggul, berkarakter, dan siap menghadapi masa depan.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-5 w-full sm:w-auto px-4">
              <Link 
                href="/profil" 
                className="group bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95"
              >
                <Users size={22} className="group-hover:rotate-12 transition-transform" />
                Daftar Pengurus
              </Link>
              <Link 
                href="/program-kerja" 
                className="group bg-white text-slate-800 border-2 border-slate-200 px-10 py-5 rounded-2xl font-black text-lg hover:border-slate-900 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
              >
                <LayoutList size={22} />
                Program Kerja
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
               <Image src="/logo-osis.png" alt="Logo OSIS" fill className="object-contain" />
            </div>
            <span className="font-black text-slate-400 tracking-tighter">OSIS Spentig Makassar</span>
          </div>
          
          <nav className="flex gap-8 text-sm font-bold text-slate-400">
             <Link href="/profil" className="hover:text-blue-600">Profil</Link>
             <Link href="/program-kerja" className="hover:text-blue-600">Program</Link>
             <Link href="/login" className="hover:text-blue-600">Login</Link>
          </nav>

          <div className="h-px w-24 bg-slate-200"></div>
          
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em] text-center leading-loose">
            © {new Date().getFullYear()} • OSIS SPENTIG MAKASSAR <br />
            MADE WITH PRIDE BY <a href="https://fathullahbk.github.io/portofolio/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-blue-600 transition-colors">
                FATHULLAH, S.PD</a>
          </p>
        </div>
      </footer>
    </div>
  );
}