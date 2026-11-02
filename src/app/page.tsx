
"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Suspense } from "react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

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

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600",
  },
  {
    title: "The Art of Reading",
    author: "David Ulin",
    category: "Others",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Fiction",
    image:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600",
  },
  {
    title: "A Short History of Nearly Everything",
    author: "Bill Bryson",
    category: "Science",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600",
  },
  {
    title: "The Story of Civilization",
    author: "Will Durant",
    category: "History",
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600",
  },
];

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

export default function HomePage() {
  return (
    <div>
      {/* Hero Slider */}
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
                style={{ backgroundImage: `url(${slide.image})` }}
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

      {/* Introduction */}
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

      {/* New Arrivals */}
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
            {sampleBooks.map((book) => (
              <article key={book.title} className="book-card group">
                <div className="h-[300px] overflow-hidden bg-[#e8e5dc]">
                  <div
                    className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${book.image})` }}
                  />
                </div>

                <div className="p-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                    {book.category}
                  </span>

                  <h3 className="font-editorial mt-3 text-2xl font-bold">
                    {book.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted">
                    By {book.author}
                  </p>

                  <Link
                    href="/books"
                    className="mt-5 inline-flex text-sm font-semibold text-primary hover:text-accent"
                  >
                    Explore book →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
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
                href="/books"
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

      {/* How It Works */}
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
              <div key={step.number} className="border-t border-white/20 pt-6">
                <span className="font-editorial text-4xl text-[#d8b77c]">
                  {step.number}
                </span>

                <h3 className="mt-5 text-2xl font-semibold">{step.title}</h3>

                <p className="mt-3 max-w-sm text-sm leading-7 text-white/65">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding">
        <div className="container-main rounded-xl bg-[#e9e5d9] px-7 py-14 text-center md:px-16 md:py-20">
          <p className="section-eyebrow">Your next chapter begins here</p>

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
