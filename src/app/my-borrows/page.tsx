
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  RotateCcw,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loading from "@/components/shared/Loading";

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowedAt: string;
  returnedAt: string | null;
  status: "active" | "returned";
}

interface BorrowsResponse {
  success: boolean;
  count: number;
  data: Borrow[];
}

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  async function fetchBorrows() {
    try {
      setLoading(true);

      const response = await apiRequest<BorrowsResponse>("/api/borrows");

      setBorrows(response.data || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load your borrowing history."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
      router.replace("/login?callbackURL=/my-borrows");
      return;
    }

    fetchBorrows();
  }, [session, sessionLoading, router]);

  async function handleReturn(borrowId: string) {
    try {
      setReturningId(borrowId);

      const response = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/api/borrows/${borrowId}`, {
        method: "DELETE",
      });

      toast.success(response.message || "Book returned successfully.");

      await fetchBorrows();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to return the book."
      );
    } finally {
      setReturningId(null);
    }
  }

  const activeBorrows = borrows.filter(
    (borrow) => borrow.status === "active"
  );

  const returnedBorrows = borrows.filter(
    (borrow) => borrow.status === "returned"
  );

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

 if (sessionLoading || loading) {
  return (
    <main className="bg-[#F8F7F2]">
      <Loading
        message="Loading your borrowing history..."
        fullScreen
      />
    </main>
  );
}

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-8">
          <Link
            href="/books"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#1F4D3A] transition hover:text-[#C49A45]"
          >
            <ArrowLeft size={17} />
            Explore Books
          </Link>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#C49A45]">
                Your Reading Journey
              </p>

              <h1 className="font-serif text-4xl font-bold text-[#1F3B2D] sm:text-5xl">
                My Borrows
              </h1>

              <p className="mt-3 max-w-xl text-gray-600">
                Keep track of the books you are reading and the ones
                you have already returned.
              </p>
            </div>

            <Link
              href="/books"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F4D3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#173A2C]"
            >
              <BookOpen size={17} />
              Browse Books
            </Link>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E8E5DA] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Borrows</span>
              <BookOpen className="text-[#1F4D3A]" size={22} />
            </div>
            <p className="mt-3 text-3xl font-bold text-[#1F3B2D]">
              {borrows.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E5DA] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Currently Reading</span>
              <Clock3 className="text-[#C49A45]" size={22} />
            </div>
            <p className="mt-3 text-3xl font-bold text-[#1F3B2D]">
              {activeBorrows.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E5DA] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Books Returned</span>
              <CheckCircle2 className="text-green-600" size={22} />
            </div>
            <p className="mt-3 text-3xl font-bold text-[#1F3B2D]">
              {returnedBorrows.length}
            </p>
          </div>
        </div>

        {/* Borrowing history */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#1F3B2D]">
            Borrowing History
          </h2>
          <span className="text-sm text-gray-500">
            {borrows.length} {borrows.length === 1 ? "record" : "records"}
          </span>
        </div>

        {borrows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D8D5C9] bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto text-[#C49A45]" size={48} />

            <h3 className="mt-5 font-serif text-2xl font-bold text-[#1F3B2D]">
              Your reading journey starts here
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              You haven't borrowed any books yet. Explore our library
              and discover your next favorite read.
            </p>

            <Link
              href="/books"
              className="mt-7 inline-flex rounded-full bg-[#1F4D3A] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#173A2C]"
            >
              Explore the Library
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {borrows.map((borrow) => {
              const isActive = borrow.status === "active";
              const isReturning = returningId === borrow._id;

              return (
                <article
                  key={borrow._id}
                  className="flex flex-col gap-5 rounded-2xl border border-[#E8E5DA] bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
                >
                  {/* Book cover */}
                  <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-[#F0EEE5] sm:h-36 sm:w-24">
                    {borrow.bookImage ? (
                      <Image
                        src={borrow.bookImage}
                        alt={borrow.bookTitle}
                        fill
                        sizes="(max-width: 640px) 100vw, 96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen size={32} className="text-[#1F4D3A]" />
                      </div>
                    )}
                  </div>

                  {/* Book information */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isActive
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isActive ? "Active" : "Returned"}
                      </span>

                      <span className="text-xs text-gray-400">
                        ID: {borrow._id.slice(-8)}
                      </span>
                    </div>

                    <h3 className="truncate font-serif text-xl font-bold text-[#1F3B2D]">
                      {borrow.bookTitle}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={15} />
                        Borrowed: {formatDate(borrow.borrowedAt)}
                      </span>

                      {borrow.returnedAt && (
                        <span className="inline-flex items-center gap-2">
                          <CheckCircle2 size={15} />
                          Returned: {formatDate(borrow.returnedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Return action */}
                  <div className="shrink-0">
                    {isActive ? (
                      <button
                        onClick={() => handleReturn(borrow._id)}
                        disabled={isReturning}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F4D3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#173A2C] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        <RotateCcw size={16} />
                        {isReturning ? "Returning..." : "Return Book"}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-3 text-sm font-semibold text-green-700">
                        <CheckCircle2 size={16} />
                        Completed
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
