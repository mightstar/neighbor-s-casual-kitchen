import type { Metadata } from "next";
import { AccountPanel } from "@/components/account-panel";

export const metadata: Metadata = {
  title: "Account",
  description: "Your Neighbor's reservations and pickup orders.",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-copper">Your table</p>
      <h1 className="display mt-2 text-5xl">Account</h1>
      <div className="mt-8">
        <AccountPanel />
      </div>
    </div>
  );
}
