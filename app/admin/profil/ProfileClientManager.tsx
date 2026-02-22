"use client";

import { useState } from "react";
import ProfileForm from "./ProfileForm";
import ProfileList from "./ProfileList";
import { createProfile, updateProfile } from "./actions";

export default function ProfileClientManager({ terms, initialProfiles, deleteAction }: any) {
  // State inilah yang menangkap data saat tombol edit diklik
  const [editData, setEditData] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <ProfileForm 
          terms={terms} 
          addAction={createProfile} 
          updateAction={updateProfile} // Tambahkan ini
          editData={editData}           // Kirim data yang mau diedit
          setEditData={setEditData}     // Fungsi untuk reset
        />
      </div>

      <div className="lg:col-span-2 space-y-4">
        <ProfileList 
          profiles={initialProfiles} 
          deleteProfile={deleteAction}
          onEdit={(profile: any) => setEditData(profile)} // Fungsi saat tombol edit diklik
        />
      </div>
    </div>
  );
}