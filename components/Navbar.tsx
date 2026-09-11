import Link from "next/link";
import { getUser } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";

export async function Navbar() {
  const user = await getUser();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-3xl font-sedgwick font-semibold text-[#2d7a47] hover:text-[#40c671] transition-colors">
            AbsoluteTracker
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-100 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-sm text-zinc-400 hover:text-zinc-100 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors">
                  Profile
                </Link>
                <SignOutButton className="text-sm" />
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-zinc-400 hover:text-zinc-100 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors">
                  Sign in
                </Link>
                <Link href="/auth/signup" className="text-sm font-medium bg-[#40c671] text-white px-4 py-2 rounded-lg hover:bg-[#2d7a47] transition-colors">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}