import Sidebar from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      {/* Tambahkan min-w-0 agar konten tidak mendorong sidebar keluar */}
      <main className="flex-1 min-h-screen w-full overflow-x-hidden">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}