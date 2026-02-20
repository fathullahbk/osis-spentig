"use client";

import { useState } from "react";

export default function ProgramForm({ terms, profiles, addAction }: any) {
  const [selectedTerm, setSelectedTerm] = useState("");

  // Filter pengurus sesuai Masa Bakti yang dipilih di dropdown atas
  const filteredProfiles = profiles.filter(
    (p: any) => p.termId === parseInt(selectedTerm)
  );

  return (
    <form action={addAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Masa Bakti</label>
        <select 
          name="termId" 
          required 
          onChange={(e) => setSelectedTerm(e.target.value)}
          className="w-full border rounded-lg p-2.5 text-sm bg-white"
        >
          <option value="">-- Pilih Masa Bakti --</option>
          {terms.map((t: any) => <option key={t.id} value={t.id}>{t.year}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Penanggung Jawab (PJ)</label>
        <select 
          name="leaderId" 
          disabled={!selectedTerm}
          className="w-full border rounded-lg p-2.5 text-sm bg-white disabled:bg-slate-50"
        >
          <option value="">-- Pilih PJ (Opsional) --</option>
          {filteredProfiles.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nama Program</label>
        <input name="title" required type="text" className="w-full border rounded-lg p-2.5 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select name="status" required className="w-full border rounded-lg p-2.5 text-sm bg-white">
          <option value="Belum Terlaksana">Belum Terlaksana</option>
          <option value="Sedang Berjalan">Sedang Berjalan</option>
          <option value="Terlaksana">Terlaksana</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deskripsi</label>
        <textarea name="description" required rows={3} className="w-full border rounded-lg p-2.5 text-sm resize-none" />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all">
        Simpan Program
      </button>
    </form>
  );
}