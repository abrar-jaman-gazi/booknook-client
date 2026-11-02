
"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F7F2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#173D32]/20 border-t-[#173D32]" />
          <p className="mt-4 text-sm text-gray-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F7F2] px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <UserRound className="mx-auto text-[#173D32]" size={42} />
          <h1 className="mt-4 text-2xl font-bold text-[#173D32]">
            Login required
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Please log in to view your profile.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-[#173D32] px-6 py-3 font-semibold text-white transition hover:bg-[#245545]"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const user = session.user;
  const initial = user.name?.charAt(0)?.toUpperCase() || "U";

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Back navigation */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#173D32] transition hover:text-[#B38B3E]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#B38B3E]">
            Your BookNook account
          </p>
          <h1 className="text-3xl font-bold text-[#173D32] sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-gray-500">
            View your personal account information.
          </p>
        </div>

        {/* Profile card */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-lg">

          {/* Banner */}
          <div className="relative h-40 overflow-hidden bg-[#173D32] sm:h-52">
            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-[#D6A84B]/20 blur-3xl" />
            <div className="absolute -bottom-32 left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex h-full items-center px-8 sm:px-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D6A84B]">
                  Member account
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Welcome, {user.name?.split(" ")[0] || "Reader"}!
                </h2>
              </div>
            </div>
          </div>

          {/* User identity */}
          <div className="px-6 pb-8 sm:px-12">
            <div className="-mt-12 flex flex-col items-start gap-5 sm:-mt-14 sm:flex-row sm:items-end">

              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile photo"}
                  className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-md sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#D6A84B] text-4xl font-bold text-[#173D32] shadow-md sm:h-28 sm:w-28">
                  {initial}
                </div>
              )}

              <div className="pb-1">
                <h2 className="text-2xl font-bold text-[#173D32]">
                  {user.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  BookNook Member
                </p>
              </div>

              <div className="sm:ml-auto sm:pb-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                  <ShieldCheck size={15} />
                  Active Account
                </span>
              </div>
            </div>

            {/* Information section */}
            <div className="mt-10 border-t border-gray-100 pt-8">
              <h3 className="mb-6 text-lg font-bold text-[#173D32]">
                Account Information
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">

                <div className="rounded-xl border border-gray-100 bg-[#FAFAF8] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#B38B3E]">
                    <UserRound size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Full Name
                    </span>
                  </div>
                  <p className="break-words font-semibold text-gray-800">
                    {user.name || "Not available"}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#FAFAF8] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#B38B3E]">
                    <Mail size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Email Address
                    </span>
                  </div>
                  <p className="break-all font-semibold text-gray-800">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#FAFAF8] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#B38B3E]">
                    <CalendarDays size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Member Since
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {joinedDate}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#FAFAF8] p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#B38B3E]">
                    <BookOpen size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Membership
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800">
                    Standard Reader
                  </p>
                </div>

              </div>
            </div>

            {/* Profile actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/my-books"
                className="rounded-xl bg-[#173D32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245545]"
              >
                Manage My Books
              </Link>

              <Link
                href="/my-borrows"
                className="rounded-xl border border-[#173D32] px-6 py-3 text-sm font-semibold text-[#173D32] transition hover:bg-[#173D32]/5"
              >
                My Borrowed Books
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
