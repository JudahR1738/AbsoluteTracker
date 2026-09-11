"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

// Pull the valid ENUM values directly from the generated database schema
type ComicFormat = Database["public"]["Enums"]["comic_format"];

// Standard response shape returned to the frontend form
export type ActionResponse = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Helper: Safely trims a string or returns null if empty/missing.
 * Prevents saving whitespace-only strings into text columns.
 */
function sanitizeString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Helper: Basic URL validation without third-party regex packages.
 */
function isValidUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Server Action: Validates form input and inserts a new comic.
export async function addComic(_prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "You must be signed in to add a comic to your collection.",
    };
  }

  // Sanitize each field from FormData
  const title = sanitizeString(formData.get("title"));
  const publisher = sanitizeString(formData.get("publisher"));
  const issueNumber = sanitizeString(formData.get("issue_number"));
  const rawFormat = formData.get("format")?.toString() || "single_issue";
  const genre = sanitizeString(formData.get("genre"));
  const mainCharacter = sanitizeString(formData.get("main_character"));
  const author = sanitizeString(formData.get("author"));
  const penciler = sanitizeString(formData.get("penciler"));
  const inker = sanitizeString(formData.get("inker"));
  const letterer = sanitizeString(formData.get("letterer"));
  const condition = sanitizeString(formData.get("condition"));
  const notes = sanitizeString(formData.get("notes"));
  const coverImgUrl = sanitizeString(formData.get("cover_img_url"));

  // Manual Validation Checks
  const errors: Record<string, string> = {};

  if (!title) {
    errors.title = "Comic title is required.";
  }

  if (!publisher) {
    errors.publisher = "Publisher name is required.";
  }

  // Check format strictly matches our Postgres ENUM ('single_issue' | 'tpb')
  const validFormats: ComicFormat[] = ["single_issue", "tpb"];
  if (!validFormats.includes(rawFormat as ComicFormat)) {
    errors.format = "Please select a valid comic format.";
  }

  // Check URL syntax if a cover image link was provided
  if (coverImgUrl && !isValidUrl(coverImgUrl)) {
    errors.cover_img_url = "Please provide a valid web link (http:// or https://).";
  }

  // If any errors accumulated, reject early before calling Postgres
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted errors.",
      fieldErrors: errors,
    };
  }

  // Insert into the Database
  const { error: insertError } = await supabase.from("comics").insert({
    user_id: user.id,
    title: title!,
    publisher: publisher!,
    issue_number: issueNumber,
    format: rawFormat as ComicFormat,
    genre,
    main_character: mainCharacter,
    author,
    penciler,
    inker,
    letterer,
    condition,
    notes,
    cover_img_url: coverImgUrl,
  });

  if (insertError) {
    console.error("Database insert failure:", insertError.message);
    return {
      success: false,
      message: "Failed to save comic to database. Please try again.",
    };
  }

  // Invalidate Next.js cache so the dashboard immediately shows the new item
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Comic added to your collection!",
  };
}

/**
 * Server Action: Deletes a comic entry by ID.
 */
export async function deleteComic(comicId: string): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Unauthorized." };
  }

  const { error } = await supabase
    .from("comics")
    .delete()
    .eq("id", comicId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Delete failure:", error.message);
    return { success: false, message: "Failed to delete comic." };
  }

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Comic removed from collection.",
  };
}