
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import {
  Search,
  BookOpen,
  SlidersHorizontal,
  AlertCircle,
  BookMarked,
  ArrowRight,
} from "lucide-react";

import Loading from "@/components/shared/Loading";

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

interface BooksResponse {
  success: boolean;
  count: number;
  data: Book[];
}

const categories = [
  "All",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        setError("");

        const result = await apiRequest<BooksResponse>("/api/books");

        setBooks(result.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load books. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        !searchTerm ||
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm);

      const matchesCategory =
        selectedCategory === "All" ||
        book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [books, search, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#F8F7F2]">

      {/* Page hero */}
      <section className="bg-[#173D32] px-5 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#D6A84B]">
            Discover your next favorite
          </p>

          <h1 className="font-editorial text-4xl font-bold sm:text-5xl lg:text-6xl">
            Explore Our Library
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
            Discover stories, explore new ideas, and find books that
            inspire your imagination. Your next reading adventure starts here.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/75">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-[#D6A84B]" />
              {books.length} Books in Library
            </div>

            <div className="flex items-center gap-2">
              <BookMarked size={18} className="text-[#D6A84B]" />
              {categories.length - 1} Categories
            </div>
          </div>
        </div>
      </section>

      {/* Books section */}
      <section className="container-main py-12 sm:py-16">

        {/* Search and category filters */}
        <div className="mb-10 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-xl font-bold text-[#173D32]">
                Find Your Next Read
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Search by book title, author, or category.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search books or authors..."
                className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
              <SlidersHorizontal size={16} />
              Categories:
            </span>

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === category
                    ? "bg-[#173D32] text-white"
                    : "bg-[#F5F4EF] text-gray-600 hover:bg-[#EAE8DF]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>


        {/* Results heading */}
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#173D32]">
              Available Books
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {loading
                ? "Loading library..."
                : `${filteredBooks.length} ${
                    filteredBooks.length === 1 ? "book" : "books"
                  } found`}
            </p>
          </div>
        </div>

  
        {/* Loading state */}
{loading && (
  <Loading message="Loading books from our library..." />
)}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
            <AlertCircle
              size={38}
              className="mx-auto text-red-500"
            />
            <h3 className="mt-4 text-lg font-bold text-gray-800">
              Unable to load books
            </h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[#173D32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#245545]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredBooks.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center">
            <BookOpen
              size={45}
              className="mx-auto text-[#B38B3E]"
            />
            <h3 className="mt-5 text-xl font-bold text-[#173D32]">
              No books found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try another search term or select a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-5 font-semibold text-[#173D32] hover:text-[#B38B3E]"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Book cards */}
        {!loading && !error && filteredBooks.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <article
                key={book._id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link
                  href={`/books/${book._id}`}
                  className="block"
                  aria-label={`View ${book.title}`}
                >
                  <div className="relative flex h-[280px] items-center justify-center overflow-hidden bg-[#F3F1EA] p-6">
                    <img
                      src={book.image}
                      alt={book.title}
                      loading="lazy"
                      className="h-full w-auto max-w-full object-contain transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#173D32] shadow-sm">
                      {book.category}
                    </span>

                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                        book.availableCopies > 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {book.availableCopies > 0
                        ? "Available"
                        : "Out of stock"}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="line-clamp-1 text-xl font-bold text-[#173D32] transition group-hover:text-[#B38B3E]">
                      {book.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      By {book.author}
                    </p>

                    <p className="mt-4 line-clamp-3 min-h-[66px] text-sm leading-6 text-gray-600">
                      {book.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-xs font-medium text-gray-500">
                        {book.availableCopies} of {book.totalCopies} copies available
                      </span>

                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#173D32]">
                        Details
                        <ArrowRight
                          size={16}
                          className="transition group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
