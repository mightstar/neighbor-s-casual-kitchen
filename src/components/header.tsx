"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/cartSlice";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/reserve", label: "Reserve" },
  { href: "/visit", label: "Visit" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const count = useAppSelector((state) => selectCartCount(state.cart.lines));
  const user = useAppSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6">
        <Link href="/" aria-label="Neighbor's Casual Kitchen home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide ${
                pathname.startsWith(link.href) ? "text-copper" : "text-ink/80 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={user ? "/account" : "/login"}
            className="hidden text-sm text-ink/80 hover:text-ink sm:inline"
          >
            {user ? user.name.split(" ")[0] : "Sign in"}
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full border border-line px-3 py-1.5 text-sm"
          >
            Cart
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-copper px-1 text-[11px] text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span className="block h-3.5 w-4 border-y-2 border-ink" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-paper px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-1 text-lg"
              >
                {link.label}
              </Link>
            ))}
            <Link href={user ? "/account" : "/login"} onClick={() => setOpen(false)}>
              {user ? "Account" : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
