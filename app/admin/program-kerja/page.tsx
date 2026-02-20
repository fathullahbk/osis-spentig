import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, PlusCircle } from "lucide-react";
import ProgramList from "./ProgramList";
import FilterTerm from "./FilterTerm";
import ProgramForm from "./ProgramForm";

export default async function KelolaProgramPage({
  searchParams,
}: {
  searchParams: Promise<{ termId?: string }>;
}) {
  const { termId } = await searchParams;

  const terms = await prisma.term.findMany({
    orderBy: { year: 'desc' },
  });

  // Ambil semua profil pengurus
  const profiles = await prisma.profile.findMany({
    orderBy: { name: 'asc' },
  });

  // Filter daftar program tersimpan berdasarkan URL termId
  const programs = await prisma.program.findMany({
    where: termId ? { termId: parseInt(termId) } : {},
    include: { 
      term: true,
      leader: true 
    },
    orderBy: { id: 'desc' },
  });

  async function addProgram(formData: FormData) {
    "use server";
    const tId = parseInt(formData.get("termId") as string);
    const lId = formData.get("leaderId") ? parseInt(formData.get("leaderId") as string) : null;

    await prisma.program.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        status: formData.get("status") as string,
        termId: tId,
        leaderId: lId,
      },
    });
    revalidatePath("/admin/program-kerja");
  }

  // Action: Hapus Program
  async function deleteProgram(id: number) {
    "use server";
    await prisma.program.delete({ where: { id } });
    revalidatePath("/admin/program-kerja");
  }

  // Action: Update Status
  async function updateProgramStatus(id: number, newStatus: string) {
    "use server";
    await prisma.program.update({
      where: { id },
      data: { status: newStatus }
    });
    revalidatePath("/admin/program-kerja");
  }

return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-3"><FolderKanban className="text-purple-600" /> Kelola Program Kerja</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><PlusCircle size={18}/> Tambah Program</CardTitle></CardHeader>
            <CardContent>
              {/* Kirim fungsi addProgram sebagai props */}
              <ProgramForm terms={terms} profiles={profiles} addAction={addProgram} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-sm font-bold text-slate-500 uppercase">Tampilkan Masa Bakti:</span>
            <FilterTerm terms={terms} />
          </div>
          <ProgramList programs={programs} deleteProgram={deleteProgram} updateProgramStatus={updateProgramStatus} />
        </div>
      </div>
    </div>
  );
}