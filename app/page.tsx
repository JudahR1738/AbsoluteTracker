import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getUser();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-[#4ade80] bg-[#215433] px-3 py-1 rounded-full mb-6 border border-[#2d7a47;]">
          <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full"></span>
          Next.js + Supabase Starter
        </div>

        <h1 className="text-5xl font-bold text-zinc-100 mb-4 leading-tight">
          Welcome to QuickStarter!<br/>Let's get,{" "}
          <span className="text-[#2d7a47]">started!</span>
        </h1>

        <p className="text-xl text-zinc-500 mb-10 leading-relaxed">
          This starter has authentication, database, file storage, and CI/CD functionality.
        </p>

        {user ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-green-400 bg-green-950/50 px-4 py-2 rounded-full border border-green-900">
              Signed in as <strong>{user.email}</strong>
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard" className="bg-[#40c671] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d7a47] transition-colors">
                Go to Dashboard →
              </Link>
              <Link href="/profile" className="bg-zinc-800 text-zinc-100 px-6 py-3 rounded-lg font-medium border border-zinc-700 hover:bg-zinc-700 transition-colors">
                View Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex gap-3 justify-center">
            <Link href="/auth/signup" className="bg-[#40c671] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2d7a47] transition-colors shadow-lg shadow-[#2d7a47]/20">
              Get started
            </Link>
            <Link href="/auth/login" className="bg-zinc-800 text-zinc-100 px-8 py-3 rounded-lg font-medium border border-zinc-700 hover:bg-zinc-700 transition-colors">
              Sign in
            </Link>
          </div>
        )}
      </div>

      <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div key={feature.title} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="text-2xl mb-3">{feature.icon}</div>
            <h3 className="font-semibold text-[#4ade80] mb-1">{feature.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const features = [
  { icon: "🔐", title: "Authentication", description: "Sign up, sign in, and sign out with Supabase Auth. Session management via middleware." },
  { icon: "🗄️", title: "Database & RLS", description: "Profiles table with Row Level Security. Users can only read and modify their own data." },
  { icon: "📸", title: "Avatar Uploads", description: "Upload profile pictures to Supabase Storage with per-user access control." },
  { icon: "⚡", title: "Next.js App Router", description: "Built with Next.js 16 App Router, TypeScript, Server Components, and Tailwind CSS." },
  { icon: "🧪", title: "Testing with Jest", description: "Unit tests for components, utilities, and auth logic using Jest and Testing Library." },
  { icon: "🚀", title: "CI/CD Ready", description: "GitHub Actions workflow that automatically runs DB migrations on every push to main." },
];