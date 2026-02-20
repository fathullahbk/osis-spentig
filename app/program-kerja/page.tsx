import prisma from "@/lib/prisma";
import { ClipboardList, CheckCircle2, Clock } from "lucide-react";

export default async function ProgramKerjaPublicPage() {
  // Mengambil masa bakti terbaru (Aktif)
  const activeTerm = await prisma.term.findFirst({
    orderBy: { year: 'desc' },
  });

  // Mengambil program kerja yang sesuai dengan masa bakti aktif
  const programs = await prisma.program.findMany({
    where: { termId: activeTerm?.id },
    include: { leader: true },
    orderBy: { id: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header Halaman */}
      <div className="flex items-center gap-3 mb-8 border-b pb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <ClipboardList className="text-purple-600" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Program Kerja OSIS</h1>
          <p className="text-slate-500 text-sm">
            Transparansi inisiatif dan kegiatan untuk Masa Bakti {activeTerm?.year || "-"}
          </p>
        </div>
      </div>

      {/* Tabel Program Kerja */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider w-16 text-center">No</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Program Kerja</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Penanggung Jawab</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {programs.length > 0 ? (
              programs.map((prog, index) => (
                <tr key={prog.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-medium text-center">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{prog.title}</div>
                    {prog.description && (
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 italic">
                        "{prog.description}"
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">
                    {prog.leader?.name || (
                      <span className="text-slate-400 text-xs italic italic">Belum ditentukan</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      prog.status === 'Terlaksana' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {prog.status === 'Terlaksana' ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {prog.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                  Belum ada program kerja yang tercatat untuk periode ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <a href="/" className="text-sm text-slate-500 hover:text-purple-600 transition-colors">
          ← Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}