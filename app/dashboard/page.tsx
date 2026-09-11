import type { Metadata } from "next";
import Link from "next/link";
import { requireUser, getUserProfile } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { getInitials } from "@/lib/utils";
import { Profile } from "@/lib/supabase/types";
import { getUserComics } from "@/lib/queries/comics";
import { AddComicForm } from "@/components/comics/AddComicForm";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await getUserProfile() as Profile | null;
  const comics = await getUserComics();

  const displayName = profile?.full_name ?? user.email ?? "User";
  const initials = getInitials(displayName);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-zinc-500 mt-1">
            Welcome back, <span className="text-zinc-300 font-medium">{profile?.full_name ?? user.email}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Your current account information</CardDescription>
          </CardHeader>

          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#215433] flex items-center justify-center text-[#2d7a47] text-xl font-semibold border-2 border-[#2d7a47]">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-zinc-100 truncate">{profile?.full_name ?? "—"}</p>
              <p className="text-sm text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800">
            <Link href="/profile" className="text-sm font-medium text-[#4ade80] hover:text-indigo-300 hover:underline">
              Edit profile →
            </Link>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>

          <ul className="space-y-3 text-sm">
            <li className="flex justify-between py-1.5 border-b border-zinc-800">
              <span className="text-zinc-500">Status</span>
              <span className="text-green-400 font-medium">Active</span>
            </li>
            <li className="flex justify-between py-1.5 border-b border-zinc-800">
              <span className="text-zinc-500">Email verified</span>
              <span className={user.email_confirmed_at ? "text-green-400 font-medium" : "text-yellow-400 font-medium"}>
                {user.email_confirmed_at ? "Yes" : "Pending"}
              </span>
            </li>
            <li className="flex justify-between py-1.5">
              <span className="text-zinc-500">Profile updated</span>
              <span className="text-zinc-300 font-medium">
                {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "Never"}
              </span>
            </li>
          </ul>
        </Card>
        <AddComicForm />

        <main className="mx-auto max-w-6xl">
          {/* Placeholder count check before wiring ComicCard */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
            {comics.length === 0 ? (
              <p>Your collection is empty. Click <strong>Add Comic</strong> above to create your first entry.</p>
            ) : (
              <p>Database has <strong>{comics.length}</strong> items ready for presentation.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}