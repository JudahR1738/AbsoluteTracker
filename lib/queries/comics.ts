import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export type ComicRow = Database["public"]["Tables"]["comics"]["Row"];

/**
 * Fetches all comics owned by the currently authenticated user.
 * Runs strictly on the server (Server Components or Server Actions).
 */
export async function getUserComics(): Promise<ComicRow[]> {
  const supabase = await createClient();

  // Who is making request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the visitor is not logged in, return an empty collection
  if (!user) {
    return [];
  }

  // Fetch comics belonging to this user, newest first
  // Row Level Security (RLS) guarantees users only see their own rows,
  // but explicit .eq("user_id") is good practice for query performance.
  const { data, error } = await supabase
    .from("comics")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Database query error:", error.message);
    throw new Error("Could not retrieve comics from database.");
  }

  return data ?? [];
}