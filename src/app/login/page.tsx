import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to book a table or place a pickup order.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">Account</p>
      <h1 className="display mt-2 text-5xl">Sign in</h1>
      <p className="mt-3 text-muted">Use your email to reserve tables and place pickup orders.</p>
      <div className="mt-8">
        <AuthForm mode="login" nextPath={next || "/account"} />
      </div>
    </div>
  );
}
