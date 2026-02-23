// app/admin/bendahara/page.tsx
import React from "react";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Wallet, Plus, Trash2, TrendingUp, TrendingDown, CreditCard, ReceiptText } from "lucide-react";

export const revalidate = 0;

export default async function AdminBendaharaPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }> | { year?: string };
}) {
  // 1️⃣ Ambil Data Masa Bakti
  const allTerms = await prisma.term.findMany({ orderBy: { year: "desc" } });
  const resolvedSearchParams = await searchParams;
  const selectedYear = resolvedSearchParams?.year;

  let activeTerm = allTerms.length > 0 ? allTerms[0] : null;
  if (selectedYear) {
    const found = allTerms.find((t) => t.year.toString() === selectedYear);
    if (found) activeTerm = found;
  }

  // 2️⃣ Ambil Data Keuangan
  const finances = await prisma.finance.findMany({
    where: { termId: activeTerm?.id || 0 },
    orderBy: { date: "desc" }, 
  });

  // ==========================================
  // 🔥 LOGIKA DASHBOARD KEUANGAN
  // ==========================================
  const totalPemasukan = finances
    .filter((trx) => trx.type === "PEMASUKAN")
    .reduce((total, trx) => total + trx.amount, 0);

  const totalPengeluaran = finances
    .filter((trx) => trx.type === "PENGELUARAN")
    .reduce((total, trx) => total + trx.amount, 0);

  const saldoAkhir = totalPemasukan - totalPengeluaran;

  const formatRp = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // ==========================================
  // 🔥 SERVER ACTIONS
  // ==========================================
  async function addTransaction(formData: FormData) {
    "use server";
    const description = formData.get("description") as string;
    const amount = parseInt(formData.get("amount") as string);
    const type = formData.get("type") as string;
    const dateStr = formData.get("date") as string;
    const termId = parseInt(formData.get("termId") as string);

    if (!description || !amount || !type || !dateStr || !termId) return;

    await prisma.finance.create({
      data: {
        description,
        amount,
        type,
        date: new Date(dateStr),
        termId,
      },
    });

    revalidatePath("/admin/bendahara");
    revalidatePath("/bendahara"); 
  }

  async function deleteTransaction(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("id") as string);
    await prisma.finance.delete({ where: { id } });
    
    revalidatePath("/admin/bendahara");
    revalidatePath("/bendahara");
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section - Rata Kiri & Lebih Rapat */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm text-white">
          <Wallet size={24} strokeWidth={2.5} />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kelola Bendahara</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Catat mutasi keuangan untuk Masa Bakti {activeTerm?.year || "-"}
          </p>
        </div>
      </div>

      {/* --- 📊 DASHBOARD KEUANGAN --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Kartu Pemasukan */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Pemasukan</p>
            <h3 className="text-xl font-black text-slate-800">{formatRp(totalPemasukan)}</h3>
          </div>
        </div>

        {/* Kartu Pengeluaran */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Pengeluaran</p>
            <h3 className="text-xl font-black text-slate-800">{formatRp(totalPengeluaran)}</h3>
          </div>
        </div>

        {/* Kartu Saldo Akhir */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-xl shadow-md flex items-center gap-4 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="p-3 bg-white/20 text-white rounded-lg relative z-10 backdrop-blur-sm">
            <CreditCard size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-0.5">Saldo Saat Ini</p>
            <h3 className="text-xl font-black text-white">{formatRp(saldoAkhir)}</h3>
          </div>
        </div>
      </div>

      {/* Konten Utama - Gap dikurangi menjadi gap-5 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        
        {/* KIRI: FORM INPUT */}
        <div className="lg:col-span-1 sticky top-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-1 bg-blue-50 text-blue-600 rounded-md">
                <Plus size={16} strokeWidth={3} />
              </div>
              Catat Transaksi Baru
            </h2>
            
            <form action={addTransaction} className="space-y-3">
              <input type="hidden" name="termId" value={activeTerm?.id || ""} />

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Tanggal</label>
                <input type="date" name="date" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Keterangan</label>
                <input type="text" name="description" required placeholder="Cth: Iuran Kas..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Jenis Transaksi</label>
                <select name="type" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  <option value="PEMASUKAN">Pemasukan (Debit)</option>
                  <option value="PENGELUARAN">Pengeluaran (Kredit)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Jumlah (Rp)</label>
                <input type="number" name="amount" required min="1" placeholder="Cth: 50000" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all mt-2 text-sm">
                Simpan Transaksi
              </button>
            </form>
          </div>
        </div>

        {/* KANAN: TABEL RIWAYAT */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ReceiptText size={16} className="text-slate-400" />
                Riwayat Transaksi
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px]">Tanggal</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px]">Keterangan</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px] text-right">Jumlah</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px] text-center w-12">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {finances.length > 0 ? (
                    finances.map((trx) => (
                      <tr key={trx.id} className="hover:bg-slate-50/60 transition-colors group">
                        <td className="px-4 py-3 text-slate-500 text-xs font-medium">
                          {new Date(trx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800 text-sm">{trx.description}</div>
                          <div className={`inline-flex items-center gap-1 mt-0.5 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                            trx.type === 'PEMASUKAN' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {trx.type}
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-right font-bold text-sm ${trx.type === 'PEMASUKAN' ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {trx.type === 'PEMASUKAN' ? '+' : '-'}{formatRp(trx.amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <form action={deleteTransaction}>
                            <input type="hidden" name="id" value={trx.id} />
                            <button type="submit" className="text-slate-300 hover:text-red-500 p-1.5 bg-transparent hover:bg-red-50 rounded-md transition-colors mx-auto block" title="Hapus">
                              <Trash2 size={16} />
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <ReceiptText size={28} className="text-slate-300" />
                          <p className="text-slate-500 font-medium text-sm">Belum ada transaksi</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}