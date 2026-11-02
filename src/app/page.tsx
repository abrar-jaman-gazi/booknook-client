
"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { BookOpen } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// ============================================
// Hero slider content
// ============================================

const slides = [
  {
    eyebrow: "A WORLD BETWEEN PAGES",
    title: "Find your next favorite story.",
    description:
      "Explore a thoughtfully curated collection of books. Discover new ideas, unforgettable characters, and stories worth sharing.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1800",
  },
  {
    eyebrow: "READ. DISCOVER. GROW.",
    title: "Every book opens a new world.",
    description:
      "From timeless classics to modern discoveries, find something inspiring for every chapter of your life.",
    image:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=1800",
  },
  {
    eyebrow: "YOUR COMMUNITY LIBRARY",
    title: "Good books are better shared.",
    description:
      "Build your reading journey, share your collection, and make your next great discovery with BookNook.",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1800",
  },
];

// ============================================
// Book data types
// ============================================

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

interface BooksResponse {
  success: boolean;
  count: number;
  data: Book[];
}

// ============================================
// Book categories
// ============================================

const categories = [
  {
    name: "Fiction",
    description: "Stories that take you somewhere new.",
    number: "01",
  },
  {
    name: "Science",
    description: "Explore discoveries and new ideas.",
    number: "02",
  },
  {
    name: "History",
    description: "Travel through the stories of our past.",
    number: "03",
  },
  {
    name: "Kids",
    description: "Inspiring stories for young readers.",
    number: "04",
  },
  {
    name: "Others",
    description: "Find something unexpected to read.",
    number: "05",
  },
];

// ============================================
// Homepage
// ============================================

export default function HomePage() {
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);

  // Fetch the latest 6 books directly from MongoDB
  useEffect(() => {
    let isMounted = true;

    async function fetchLatestBooks() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(
          `${apiUrl}/api/books?limit=6`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch books.");
        }

        const result: BooksResponse = await response.json();

        if (!result.success) {
          throw new Error("Failed to load latest books.");
        }

        if (isMounted) {
          // MongoDB already sorts and limits the results.
          setLatestBooks(result.data || []);
        }
      } catch (error) {
        console.error("Homepage book loading error:", error);

        if (isMounted) {
          setLatestBooks([]);
        }
      } finally {
        if (isMounted) {
          setBooksLoading(false);
        }
      }
    }

    fetchLatestBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {/* ========================================
          Hero Slider
      ======================================== */}

      <section className="relative">
        <Suspense
          fallback={
            <div className="h-[540px] bg-[#193829] md:h-[620px]" />
          }
        >
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            loop
            className="h-[540px] md:h-[620px]"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative flex h-full items-center bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/55" />

                  <div className="container-main relative z-10 py-16 text-white">
                    <p className="mb-5 text-xs font-semibold tracking-[0.25em] text-[#e5c58c]">
                      {slide.eyebrow}
                    </p>

                    <h1 className="font-editorial max-w-2xl text-5xl leading-tight font-bold md:text-7xl">
                      {slide.title}
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-8 text-white/80 md:text-lg">
                      {slide.description}
                    </p>

                    <Link
                      href="/books"
                      className="mt-9 inline-flex rounded-md bg-[#244c3a] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#193829]"
                    >
                      Browse Books <span className="ml-3">→</span>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Suspense>
      </section>

      {/* ========================================
          Introduction
      ======================================== */}

      <section className="section-padding">
        <div className="container-main grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="section-eyebrow">Welcome to BookNook</p>

            <h2 className="font-editorial mt-5 text-4xl leading-tight font-bold md:text-5xl">
              A little corner for people who love books.
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-muted">
              BookNook brings readers and books together. Explore a growing
              collection, discover something new, and borrow books to enjoy
              at your own pace. Your next reading adventure starts here.
            </p>

            <Link
              href="/books"
              className="mt-6 inline-flex items-center font-semibold text-primary hover:text-accent"
            >
              Explore our collection <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          Dynamic New Arrivals
      ======================================== */}

      <section className="section-padding bg-[#f1f0e9]">
        <div className="container-main">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="section-eyebrow">Fresh from the shelves</p>

              <h2 className="font-editorial mt-3 text-4xl font-bold">
                New Arrivals
              </h2>

              <p className="mt-3 text-sm text-muted">
                Discover books waiting to become your next favorite.
              </p>
            </div>

            <Link href="/books" className="btn-outline">
              See All Books →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {booksLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-lg border border-border bg-white"
                >
                  <div className="h-[300px] bg-[#e8e5dc]" />

                  <div className="space-y-3 p-6">
                    <div className="h-3 w-20 rounded bg-gray-200" />
                    <div className="h-6 w-3/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                  </div>
                </div>
              ))
            ) : latestBooks.length > 0 ? (
              // Latest books returned by MongoDB
              latestBooks.map((book) => (
                <article
                  key={book._id}
                  className="book-card group"
                >
                  <div className="relative h-[300px] overflow-hidden bg-[#e8e5dc]">
                    {book.image ? (
                      <div
                        className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage: `url("${book.image}")`,
                        }}
                        role="img"
                        aria-label={`Cover of ${book.title}`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen size={48} className="text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                        {book.category}
                      </span>

                      <span
                        className={`text-xs font-semibold ${
                          book.availableCopies > 0
                            ? "text-green-700"
                            : "text-red-600"
                        }`}
                      >
                        {book.availableCopies > 0
                          ? "Available"
                          : "Out of stock"}
                      </span>
                    </div>

                    <h3 className="font-editorial mt-3 text-2xl font-bold">
                      {book.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted">
                      By {book.author}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                      {book.description}
                    </p>

                    <Link
                      href={`/books/${book._id}`}
                      className="mt-5 inline-flex text-sm font-semibold text-primary hover:text-accent"
                    >
                      View Details →
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              // Empty state
              <div className="col-span-full rounded-xl border border-dashed border-border bg-white px-6 py-14 text-center">
                <BookOpen
                  className="mx-auto text-primary"
                  size={42}
                />

                <h3 className="mt-4 font-editorial text-2xl font-bold">
                  No books available yet
                </h3>

                <p className="mt-2 text-sm text-muted">
                  New books will appear here as they are added to BookNook.
                </p>

                <Link href="/books" className="btn-primary mt-6">
                  Explore Library
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================
          Categories
      ======================================== */}

      <section className="section-padding">
        <div className="container-main">
          <div className="mb-12 text-center">
            <p className="section-eyebrow">Explore by interest</p>

            <h2 className="font-editorial mt-3 text-4xl font-bold">
              Find Your Reading Corner
            </h2>

            <p className="mt-4 text-sm text-muted">
              Whatever you enjoy reading, there is a place for you here.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                href={`/books?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="group rounded-lg border border-border bg-white p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <span className="font-editorial text-3xl text-accent">
                  {category.number}
                </span>

                <h3 className="mt-7 text-xl font-semibold text-primary">
                  {category.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted">
                  {category.description}
                </p>

                <span className="mt-5 inline-block text-sm font-semibold text-primary">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          How It Works
      ======================================== */}

      <section className="section-padding bg-[#193829] text-white">
        <div className="container-main">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#d8b77c]">
              SIMPLE AND EASY
            </p>

            <h2 className="font-editorial mt-4 text-4xl font-bold md:text-5xl">
              Your next great read is just three steps away.
            </h2>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Discover",
                description:
                  "Browse our collection and find a book that interests you.",
              },
              {
                number: "02",
                title: "Borrow",
                description:
                  "Choose an available book and borrow it from the library.",
              },
              {
                number: "03",
                title: "Return",
                description:
                  "Enjoy your reading and return the book when you finish.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="border-t border-white/20 pt-6"
              >
                <span className="font-editorial text-4xl text-[#d8b77c]">
                  {step.number}
                </span>

                <h3 className="mt-5 text-2xl font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-7 text-white/65">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          Final CTA
      ======================================== */}

      <section className="section-padding">
        <div className="container-main rounded-xl bg-[#e9e5d9] px-7 py-14 text-center md:px-16 md:py-20">
          <p className="section-eyebrow">
            Your next chapter begins here
          </p>

          <h2 className="font-editorial mx-auto mt-4 max-w-2xl text-4xl font-bold md:text-5xl">
            There is always room for one more book.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted">
            Join BookNook and discover a collection of stories, knowledge,
            and inspiration.
          </p>

          <Link href="/register" className="btn-primary mt-8">
            Join BookNook →
          </Link>
        </div>
      </section>
    </div>
  );
}
