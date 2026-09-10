import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "StarterApp",
    template: "%s | StarterApp",
  },
  description: "A Next.js + Supabase starter application with authentication.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}