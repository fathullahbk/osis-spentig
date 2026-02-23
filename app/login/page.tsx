import { loginAction } from "@/lib/actions"; 
import { LockKeyhole, User } from "lucide-react";

export default async function LoginPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ error?: string }> | { error?: string } 
}) {
  // PERBAIKAN: Gunakan await untuk searchParams di Next.js 15+
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-blue-200 selection:text-blue-900">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Login Admin</h1>
          <p className="text-slate-500 mt-2 font-medium">Masukkan kredensial untuk akses OSIS SPENTIG</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-100/50 border border-slate-100">
          <form action={loginAction} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-bold border border-red-100 text-center animate-in fade-in zoom-in duration-300">
                Username atau Password salah!
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input 
                  name="username"
                  type="text" 
                  required 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  placeholder="Masukkan username..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input 
                  name="password"
                  type="password" 
                  required 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
                  placeholder="Masukkan password..."
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] mt-2"
            >
              Masuk ke Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}