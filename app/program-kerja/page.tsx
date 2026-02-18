import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, LayoutList, Calendar, CheckCircle2, Clock, PlayCircle } from "lucide-react";

export default async function ProgramKerjaPublikPage() {
  // Ambil data dari database
  const programs = await prisma.program.findMany({
    include: { term: true },
    orderBy: { id: 'desc' }
  });

  // Fungsi helper untuk ikon status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Terlaksana": 
        return { color: "text-green-600 bg-green-50", icon: <CheckCircle2 size={16} /> };
      case "Sedang Berjalan": 
        return { color: "text-blue-600 bg-blue-50", icon: <PlayCircle size={16} /> };
      default: 
        return { color: "text-amber-600 bg-amber-50", icon: <Clock size={16} /> };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 py-12 mb-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-600 font-bold mb-6 hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={20} />
            Kembali ke Beranda
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutList className="text-blue-600" size={36} />
            Program Kerja OSIS
          </h1>
          <p className="text-lg text-slate-500 mt-2 font-medium">Transparansi inisiatif dan kegiatan OSIS SPENTIG untuk masa bakti yang aktif.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {programs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            <LayoutList size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Belum ada program kerja yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program) => {
              const statusStyle = getStatusInfo(program.status);
              return (
                <div 
                  key={program.id} 
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      {/* PERBAIKAN: Gunakan program.title sesuai schema */}
                      <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {program.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-current ${statusStyle.color}`}>
                          {statusStyle.icon}
                          {program.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl uppercase tracking-wider border border-slate-100">
                      <Calendar size={14} />
                      Masa Bakti {program.term?.year}
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed font-medium">
                    {program.description}
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end italic text-xs text-slate-400">
                    OSIS SPENTIG &bull; {program.term?.year}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}