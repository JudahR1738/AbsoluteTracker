import type { Metadata } from "next";
import { requireUser, getUserProfile } from "@/lib/auth";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await getUserProfile();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2d7a47] ">Profile</h1>
      </div>
      <ProfileForm user={user} initialProfile={profile} />
    </div>
  );
}