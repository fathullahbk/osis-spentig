"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

export default function FilterTerm({ terms }: { terms: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTermId = searchParams.get("termId") || "";

  const handleFilterChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("termId", id);
    } else {
      params.delete("termId");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md border border-slate-200">
      <Filter size={14} className="text-slate-400" />
      <select
        value={currentTermId}
        onChange={(e) => handleFilterChange(e.target.value)}
        className="text-xs font-bold bg-transparent outline-none text-slate-600 cursor-pointer"
      >
        <option value="">Semua Masa Bakti</option>
        {terms.map((term) => (
          <option key={term.id} value={term.id}>
            Masa Bakti {term.year}
          </option>
        ))}
      </select>
    </div>
  );
}