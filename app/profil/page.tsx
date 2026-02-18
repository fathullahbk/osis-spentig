import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Users } from "lucide-react";

export default async function ProfilPublikPage() {
  // Mengambil data masa bakti yang aktif beserta profil pengurusnya
  const activeTerm = await prisma.term.findFirst({
    where: { isActive: true },
    include: {
      profiles: {
        orderBy: { id: 'asc' }
      }
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Halaman */}
      <div className="bg-white border-b border-slate-200 py-12 mb-10">
        <div className="max-w-6xl mx-auto px-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:gap-3 transition-all"
          >
            <ArrowLeft size={20} />
            Kembali ke Beranda
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-blue-600" size={36} />
            Struktur Pengurus OSIS
          </h1>
          <p className="text-lg text-slate-500 mt-2">
            Masa Bakti {activeTerm ? activeTerm.year : "---"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {!activeTerm || activeTerm.profiles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
            Data pengurus belum tersedia untuk periode ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTerm.profiles.map((profile) => (
              <div key={profile.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100">
                {/* Foto Profil */}
                <div className="relative h-72 w-full bg-slate-200">
                  {profile.imageUrl ? (
                    <Image 
                      src={profile.imageUrl} 
                      alt={profile.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Users size={64} />
                    </div>
                  )}
                </div>
                {/* Informasi */}
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {profile.role}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mt-3">{profile.name}</h3>
                  {profile.vision && (
                    <p className="text-slate-500 text-sm mt-3 italic leading-relaxed">
                      "{profile.vision}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}