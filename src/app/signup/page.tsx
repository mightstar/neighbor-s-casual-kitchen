import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an account to book tables and order takeout.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">Account</p>
      <h1 className="display mt-2 text-5xl">Join us</h1>
      <p className="mt-3 text-muted">A name, an email, and a password. That is the whole signup.</p>
      <div className="mt-8">
        <AuthForm mode="signup" nextPath={next || "/account"} />
      </div>
    </div>
  );
}
