"use client";

import { useState, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/lib/supabase/types";

interface ProfileFormProps {
  user: User;
  initialProfile: Profile | null;
}

export function ProfileForm({ user, initialProfile }: ProfileFormProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialProfile?.avatar_url ?? null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      setSuccessMsg("Avatar uploaded — click Save to apply changes.");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Avatar upload failed.");
      setAvatarPreview(initialProfile?.avatar_url ?? null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("profiles")
      .update({ full_name: fullName, avatar_url: avatarUrl || null })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Profile saved successfully.");
    }
  }

  const initials = getInitials(fullName || user.email || "U");

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload a photo — JPG, PNG, GIF up to 50MB</CardDescription>
        </CardHeader>

        <div className="flex items-center gap-6">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-zinc-700" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#215433] border-2 border-[#2d7a47] flex items-center justify-center text-[#2d7a47] text-2xl font-semibold">
              {initials}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button type="button" variant="secondary" loading={uploading} onClick={() => fileInputRef.current?.click()}>
              {uploading ? "Uploading…" : "Change photo"}
            </Button>
            <p className="text-xs text-zinc-600">Stored in Supabase Storage</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} aria-label="Upload avatar" />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name and details</CardDescription>
        </CardHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {successMsg && <Alert variant="success">{successMsg}</Alert>}
          {errorMsg && <Alert variant="error">{errorMsg}</Alert>}

          <Input label="Email" type="email" value={user.email ?? ""} disabled hint="Email is managed by your authentication provider" />
          <Input label="Full name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" autoComplete="name" />

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={saving}>Save changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}