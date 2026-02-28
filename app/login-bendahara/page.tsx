// app/login-bendahara/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Wallet } from "lucide-react";

export default function LoginBendahara() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // ==========================================
    // 🔥 LOGIKA AUTHENTIKASI SEMENTARA (MOCKUP)
    // ==========================================
    // Pada aplikasi nyata, Anda harus memanggil API (misal: NextAuth atau endpoint login Anda)
    // Jangan simpan password secara plain-text di frontend untuk produksi.
    
    setTimeout(() => {
      if (username === "bendahara" && password === "bendaharaosis") {
        // Jika berhasil, arahkan ke halaman Kelola Bendahara (sesuaikan dengan rute asli Anda)
        router.push("/admin/bendahara"); 
      } else {
        setError("Username atau password salah. Silakan coba lagi.");
        setIsLoading(false);
      }
    }, 1000); // Simulasi loading 1 detik
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header Form */}
        <div className="bg-blue-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Wallet className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Login Bendahara</h1>
          <p className="text-blue-100 text-sm mt-1">
            Silakan masuk untuk mengelola keuangan OSIS
          </p>
        </div>

        {/* Body Form */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                  placeholder="Masukkan username..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
                  placeholder="Masukkan password..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-200 flex justify-center items-center"
            >
              {isLoading ? "Memeriksa..." : "Masuk"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-slate-500 hover:text-blue-600 hover:underline">
              ← Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}