import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the current user or null if not authenticated.
 * Use in Server Components and Route Handlers.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Returns the current user or redirects to /auth/login.
 * Use at the top of any protected Server Component.
 */
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}

/**
 * Returns the profile row for the current user or null.
 */
export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}