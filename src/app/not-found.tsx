
import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F7F2] px-6 py-20">
      <div className="mx-auto max-w-xl text-center">

        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#193829] text-white shadow-lg">
          <BookOpen size={38} />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#B58B45]">
          Page not found
        </p>

        <h1 className="font-editorial text-7xl font-bold text-[#193829] sm:text-8xl">
          404
        </h1>

        <h2 className="mt-5 font-editorial text-2xl font-semibold text-[#193829] sm:text-3xl">
          Looks like this page is missing.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-600">
          The page you are looking for may have been moved, removed,
          or might never have existed. Let's help you find your next
          favorite book.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#193829] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#254B38]"
          >
            <Home size={17} />
            Back to Home
          </Link>

          <Link
            href="/books"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#193829]/20 px-6 py-3 text-sm font-semibold text-[#193829] transition hover:bg-[#193829]/5"
          >
            <Search size={17} />
            Explore Books
          </Link>
        </div>

      </div>
    </main>
  );
}
