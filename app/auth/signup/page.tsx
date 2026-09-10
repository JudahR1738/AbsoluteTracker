import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Get started for free — no credit card required</CardDescription>
          </CardHeader>
          <SignupForm />
        </Card>
      </div>
    </div>
  );
}