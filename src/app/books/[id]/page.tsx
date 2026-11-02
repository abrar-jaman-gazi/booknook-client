
"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import Loading from "@/components/shared/Loading";
import {
  ArrowLeft,
  BookOpen,
  UserRound,
  CalendarDays,
  Library,
  LoaderCircle,
  BookMarked,
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface BookResponse {
  success: boolean;
  data: Book;
  message?: string;
}

interface BorrowResponse {
  success: boolean;
  message: string;
}

function BookDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        setError("");

        const result = await apiRequest<BookResponse>(
          `/api/books/${bookId}`
        );

        setBook(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load book details."
        );
      } finally {
        setLoading(false);
      }
    }

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  async function handleBorrow() {
    if (!session?.user) {
      toast.error("Please log in to borrow this book.");
      router.push(`/login?callbackURL=${encodeURIComponent(`/books/${bookId}`)}`);
      return;
    }

    if (!book || book.availableCopies <= 0) {
      toast.error("This book is currently unavailable.");
      return;
    }

    setBorrowing(true);

    try {
      const result = await apiRequest<BorrowResponse>(
        "/api/borrows",
        {
          method: "POST",
          body: JSON.stringify({
            bookId: book._id,
          }),
        }
      );

      toast.success(result.message || "Book borrowed successfully!");

      // Refresh the displayed inventory after borrowing.
      const updated = await apiRequest<BookResponse>(
        `/api/books/${bookId}`
      );

      setBook(updated.data);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to borrow this book."
      );
    } finally {
      setBorrowing(false);
    }
  }

  if (loading || sessionLoading) {
  return (
    <main className="bg-[#F8F7F2]">
      <Loading
        message="Loading book details..."
        fullScreen
      />
    </main>
  );
}

  if (error || !book) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F7F2] px-4">
        <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
          <BookOpen
            size={42}
            className="mx-auto text-[#B38B3E]"
          />
          <h1 className="mt-4 text-2xl font-bold text-[#173D32]">
            Book not found
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {error || "This book may have been removed from the library."}
          </p>
          <Link
            href="/books"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#173D32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#245545]"
          >
            <ArrowLeft size={16} />
            Back to Books
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(book.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const isOwner =
    session?.user?.email?.toLowerCase() ===
    book.addedBy.email.toLowerCase();

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-12">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/books"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#173D32] transition hover:text-[#B38B3E]"
        >
          <ArrowLeft size={17} />
          Back to All Books
        </Link>

        <section className="overflow-hidden rounded-3xl bg-white shadow-lg">

          {/* Book hero */}
          <div className="grid lg:grid-cols-2">

            {/* Image */}
            <div className="flex min-h-[400px] items-center justify-center bg-[#F0EFE8] p-8 sm:p-12 lg:min-h-[600px]">
              <img
                src={book.image}
                alt={book.title}
                className="max-h-[480px] max-w-full rounded-xl object-contain shadow-xl"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">

              <span className="mb-5 w-fit rounded-full bg-[#F4EBD8] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#8C682B]">
                {book.category}
              </span>

              <h1 className="font-editorial text-3xl font-bold leading-tight text-[#173D32] sm:text-4xl lg:text-5xl">
                {book.title}
              </h1>

              <p className="mt-4 text-lg text-gray-500">
                By <span className="font-semibold text-gray-700">{book.author}</span>
              </p>

              <div className="my-8 h-px bg-gray-100" />

              <h2 className="text-lg font-bold text-[#173D32]">
                About This Book
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-8 text-gray-600">
                {book.description}
              </p>

              {/* Inventory */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-[#FAFAF8] p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Library size={17} />
                    <span className="text-xs font-medium">Total Copies</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#173D32]">
                    {book.totalCopies}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FAFAF8] p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <BookMarked size={17} />
                    <span className="text-xs font-medium">Available</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[#173D32]">
                    {book.availableCopies}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    book.availableCopies > 0
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <span
                  className={`text-sm font-semibold ${
                    book.availableCopies > 0
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {book.availableCopies > 0
                    ? "Available for borrowing"
                    : "Currently unavailable"}
                </span>
              </div>

              {/* Borrow action */}
              <button
                type="button"
                onClick={handleBorrow}
                disabled={borrowing || book.availableCopies <= 0}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173D32] px-6 py-4 font-semibold text-white transition hover:bg-[#245545] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {borrowing ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Borrowing...
                  </>
                ) : book.availableCopies <= 0 ? (
                  "Out of Stock"
                ) : (
                  <>
                    <BookOpen size={19} />
                    Borrow This Book
                  </>
                )}
              </button>

              {isOwner && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  You added this book to the library.
                </p>
              )}
            </div>
          </div>

          {/* Contributor information */}
          <div className="border-t border-gray-100 px-7 py-8 sm:px-12">
            <h3 className="mb-5 text-lg font-bold text-[#173D32]">
              Book Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">

              <div className="flex items-start gap-3">
                <UserRound className="mt-1 text-[#B38B3E]" size={20} />
                <div>
                  <p className="text-xs text-gray-400">Added By</p>
                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {book.addedBy.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays className="mt-1 text-[#B38B3E]" size={20} />
                <div>
                  <p className="text-xs text-gray-400">Date Added</p>
                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {formattedDate}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
export default function BookDetailsPage() {
  return (
    <Suspense
      fallback={
  <Loading
    message="Preparing book details..."
    fullScreen
  />
}
    >
      <BookDetailsContent />
    </Suspense>
  );
}