// app/admin/layout.tsx
import { cookies } from "next/headers";
import Sidebar from "./Sidebar"; 

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const isBendahara = session === "bendahara";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isBendahara={isBendahara} />

      {/* Konten Utama dengan Padding yang diperbaiki */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {/* p-4: Padding untuk mobile
          md:p-8: Padding lebih lebar untuk desktop
          lg:p-10: Padding maksimal untuk layar besar
        */}
        <div className="min-h-screen p-4 md:p-8 lg:p-10">
          {/* max-w-7xl: Membatasi lebar konten agar tidak terlalu melebar di layar UltraWide
            mx-auto: Memastikan konten tetap di tengah
          */}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}