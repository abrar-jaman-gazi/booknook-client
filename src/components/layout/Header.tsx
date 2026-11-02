
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Menu,
  Search,
  User,
  LogOut,
  ChevronDown,
  Library,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";

const publicNavigation = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
];

const privateNavigation = [
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

export default function Header() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const user = session?.user;
  const isLoggedIn = !!user;

  async function handleLogout() {
    try {
      await signOut();

      setProfileMenuOpen(false);
      setMobileMenuOpen(false);

      toast.success("You have been logged out successfully.");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Unable to log out. Please try again.");
    }
  }

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container-main flex min-h-[76px] items-center justify-between gap-5">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
            <BookOpen size={22} strokeWidth={1.8} />
          </div>

          <div>
            <span className="font-editorial text-2xl font-bold tracking-tight text-primary">
              BookNook
            </span>
            <p className="-mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-muted">
              A world between pages
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn &&
            privateNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
        </nav>

        {/* Desktop authentication section */}
        <div className="hidden items-center gap-3 md:flex">

          {!isLoggedIn && !isPending && (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
              >
                Login
              </Link>

              <Link href="/register" className="btn-primary">
                Join BookNook
              </Link>
            </>
          )}

          {isPending && (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          )}

          {isLoggedIn && user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 transition hover:bg-white"
                aria-expanded={profileMenuOpen}
                aria-label="Open profile menu"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {userInitial}
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-semibold text-foreground">
                  {user.name}
                </span>

                <ChevronDown size={16} />
              </button>

              {profileMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-14 z-50 w-64 rounded-xl border border-border bg-white p-3 shadow-xl">
                    <div className="border-b border-border px-3 py-3">
                      <p className="truncate text-sm font-semibold text-primary">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="mt-2 flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-background hover:text-primary"
                    >
                      <User size={17} />
                      My Profile
                    </Link>

                    <Link
                      href="/my-books"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-700 transition hover:bg-background hover:text-primary"
                    >
                      <Library size={17} />
                      My Books
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile navigation controls */}
        {/* Mobile navigation controls */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/books"
            aria-label="Browse books"
            className="rounded-lg border border-border p-2 text-primary"
          >
            <Search size={19} />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-primary"
          >
            <Menu size={21} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-white px-5 py-4 shadow-lg md:hidden">
          <nav className="flex flex-col">
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-background hover:text-primary"
              >
                {item.label}
              </Link>
            ))}

            {isLoggedIn &&
              privateNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-background hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          <div className="my-3 border-t border-border" />

          {isPending && (
            <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
          )}

          {!isLoggedIn && !isPending && (
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-primary hover:bg-background"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-primary px-3 py-3 text-center text-sm font-semibold text-white"
              >
                Join BookNook
              </Link>
            </div>
          )}

          {isLoggedIn && user && (
            <div>
              <div className="flex items-center gap-3 px-3 py-3">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                    {userInitial}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-background"
              >
                <User size={17} />
                My Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
