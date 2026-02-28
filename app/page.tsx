import Link from "next/link";
import Image from "next/image";
import { Users, LayoutList, LogIn, Sparkles, ArrowRight } from "lucide-react";
import { UserCircle, ClipboardList, Wallet } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900 relative">
      
      {/* --- Background Pattern --- */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>

      {/* --- Navbar --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <Image 
                  src="/logo-osis.png" 
                  alt="Logo OSIS"
                  fill
                  className="object-contain drop-shadow-md"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight leading-none text-slate-800 uppercase">
                  OSIS <span className="text-blue-700">SPENTIG</span>
                </span>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Makassar</span>
              </div>
            </Link>

            {/* Navigasi Kanan */}
            <nav className="flex items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-4 sm:gap-8 mr-2 sm:mr-4">
                <Link 
  href="/profil" 
  className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700 transition-colors uppercase tracking-wider"
>
  <UserCircle size={18} />
  <span>PENGURUS</span>
</Link>

<Link 
  href="/program-kerja" 
  className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700 transition-colors uppercase tracking-wider"
>
  <ClipboardList size={18} />
  <span>PROGRAM</span>
</Link>

<Link 
  href="/login" 
  className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-700 transition-colors uppercase tracking-wider"
>
  <Wallet size={18} />
  <span>KEUANGAN</span>
</Link>
              </div>

              {/* Tombol Portal Admin */}
              <Link 
                href="/login" 
                className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold text-sm hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden py-16 lg:py-20 z-10">
        
        {/* Background Gradients (Biru Khas SMP) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-300 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] bg-blue-100 rounded-full blur-[100px] opacity-40"></div>
        </div>

        <section className="px-6 text-center w-full">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Main Logo Content */}
            <div className="relative w-full max-w-sm h-40 md:h-56 mb-12 flex items-center justify-center">
              {/* Efek Glow Utama di belakang logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 rounded-full blur-[80px] opacity-20 animate-pulse"></div>

              {/* Container Logo Sekolah (Kiri-Belakang) */}
              <div className="relative w-28 h-28 md:w-40 md:h-40 -mr-6 md:-mr-10 z-10 transition-transform hover:-translate-x-4 duration-500">
                <Image 
                  src="/logo-sekolah.png" 
                  alt="Logo Sekolah"
                  fill
                  priority
                  className="object-contain drop-shadow-xl"
                />
              </div>

              {/* Container Logo OSIS (Kanan-Depan) */}
              <div className="relative w-32 h-32 md:w-48 md:h-48 z-20 transition-transform hover:scale-110 duration-500">
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
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Inovasi dalam <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400">
                Kolaborasi Siswa
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base md:text-lg text-slate-500 mb-12 leading-relaxed max-w-2xl font-medium">
              Wadah aspirasi dan kreativitas siswa SMPN 3 Makassar untuk membentuk generasi unggul, berkarakter, dan siap menghadapi masa depan.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4">
              <Link 
                href="/profil" 
                className="group bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 flex items-center justify-center gap-3 active:scale-95"
              >
                <Users size={20} className="group-hover:rotate-12 transition-transform" />
                Daftar Pengurus
              </Link>
              <Link 
                href="/program-kerja" 
                className="group bg-white text-blue-700 border-2 border-blue-100 px-8 py-4 rounded-2xl font-bold text-base hover:border-blue-700 hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
              >
                <LayoutList size={20} />
                Program Kerja
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 relative grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
               <Image src="/logo-osis.png" alt="Logo OSIS" fill className="object-contain" />
            </div>
            <span className="font-bold text-slate-400 text-sm tracking-tight">OSIS Spentig Makassar</span>
          </div>
          
          <div className="h-px w-16 bg-slate-200"></div>
          
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center leading-loose">
            © {new Date().getFullYear()} • OSIS SPENTIG MAKASSAR <br />
            MADE WITH PRIDE BY <a href="https://fathullahbk.github.io/portofolio/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition-colors">
                FATHULLAH, S.PD</a>
          </p>
        </div>
      </footer>
    </div>
  );
}