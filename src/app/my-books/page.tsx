
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  Plus,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

const categories = ["Fiction", "Science", "History", "Kids", "Others"] as const;

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

interface BookForm {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
}

const emptyForm: BookForm = {
  title: "",
  author: "",
  category: "Fiction",
  image: "",
  description: "",
  totalCopies: 1,
};

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  const fetchMyBooks = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiRequest<BooksResponse>("/api/books");

      const allBooks = response.data || [];

      // Display only books belonging to the current user.
      const myBooks = allBooks.filter(
        (book) =>
          book.addedBy?.email?.toLowerCase() ===
          session?.user?.email?.toLowerCase()
      );

      setBooks(myBooks);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load your books."
      );
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
      router.replace("/login?callbackURL=/my-books");
      return;
    }

    fetchMyBooks();
  }, [session, sessionLoading, router, fetchMyBooks]);

  function openEditModal(book: Book) {
    setEditingBook(book);

    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
      description: book.description,
      totalCopies: book.totalCopies,
    });
  }

  function closeEditModal() {
    if (saving) return;
    setEditingBook(null);
    setForm(emptyForm);
  }

  function updateForm(
    field: keyof BookForm,
    value: string | number
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingBook) return;

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      !form.description.trim() ||
      !form.image.trim() ||
      form.totalCopies < 1
    ) {
      toast.error("Please complete all fields with valid values.");
      return;
    }

    try {
      setSaving(true);

      const response = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/api/books/${editingBook._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: form.title.trim(),
          author: form.author.trim(),
          category: form.category,
          image: form.image.trim(),
          description: form.description.trim(),
          totalCopies: Number(form.totalCopies),
        }),
      });

      toast.success(response.message || "Book updated successfully.");

      setEditingBook(null);
      setForm(emptyForm);

      await fetchMyBooks();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update the book."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!bookToDelete) return;

    try {
      setDeletingId(bookToDelete._id);

      const response = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/api/books/${bookToDelete._id}`, {
        method: "DELETE",
      });

      toast.success(response.message || "Book deleted successfully.");

      setBookToDelete(null);
      await fetchMyBooks();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete the book."
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (sessionLoading || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F7F2]">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-[#1F4D3A]" size={40} />
          <p className="mt-4 text-sm text-gray-500">
            Loading your collection...
          </p>
        </div>
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/books"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#1F4D3A] hover:text-[#C49A45]"
        >
          <ArrowLeft size={17} />
          Explore Library
        </Link>

        {/* Heading */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C49A45]">
              Your Collection
            </p>

            <h1 className="font-serif text-4xl font-bold text-[#1F3B2D] sm:text-5xl">
              My Books
            </h1>

            <p className="mt-3 text-gray-600">
              Manage the books you have contributed to our library.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F4D3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#173A2C]"
          >
            <Plus size={18} />
            Add New Book
          </Link>
        </div>

        {/* Summary */}
        <div className="mb-9 rounded-2xl border border-[#E8E5DA] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-[#EAF0E9] p-3 text-[#1F4D3A]">
              <BookOpen size={26} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Books contributed by you</p>
              <p className="text-3xl font-bold text-[#1F3B2D]">
                {books.length}
              </p>
            </div>
          </div>
        </div>

        {/* Book collection */}
        {books.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D8D5C9] bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto text-[#C49A45]" size={48} />

            <h2 className="mt-5 font-serif text-2xl font-bold text-[#1F3B2D]">
              Your collection is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              You haven't added any books yet. Share your favorite books
              with the BookNook community.
            </p>

            <Link
              href="/add-book"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1F4D3A] px-7 py-3 text-sm font-semibold text-white hover:bg-[#173A2C]"
            >
              <Plus size={17} />
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="overflow-hidden rounded-2xl border border-[#E8E5DA] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-60 bg-[#F0EEE5]">
                  {book.image ? (
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen size={42} className="text-[#1F4D3A]" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#EAF0E9] px-3 py-1 text-xs font-semibold text-[#1F4D3A]">
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
                        ? `${book.availableCopies} available`
                        : "Out of stock"}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-bold text-[#1F3B2D]">
                    {book.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    By {book.author}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                    {book.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#E9E6DE] pt-4 text-xs text-gray-500">
                    <span>Total copies</span>
                    <span className="font-semibold text-[#1F3B2D]">
                      {book.totalCopies}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => openEditModal(book)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1F4D3A] px-3 py-2.5 text-sm font-semibold text-[#1F4D3A] transition hover:bg-[#EAF0E9]"
                    >
                      <Edit3 size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => setBookToDelete(book)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editingBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeEditModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#C49A45]">
                  Manage Collection
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-[#1F3B2D]">
                  Edit Book
                </h2>
              </div>

              <button
                onClick={closeEditModal}
                disabled={saving}
                aria-label="Close edit form"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">
                  Book Title
                  <input
                    required
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1F4D3A]"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Author
                  <input
                    required
                    value={form.author}
                    onChange={(e) => updateForm("author", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1F4D3A]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-gray-700">
                  Category
                  <select
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#1F4D3A]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Total Copies
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.totalCopies}
                    onChange={(e) =>
                      updateForm("totalCopies", Number(e.target.value))
                    }
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1F4D3A]"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-gray-700">
                Book Cover Image URL
                <input
                  required
                  type="url"
                  value={form.image}
                  onChange={(e) => updateForm("image", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1F4D3A]"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Description
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  className="mt-2 w-full resize-y rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1F4D3A]"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1F4D3A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#173A2C] disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={17} />
                  ) : (
                    <Save size={17} />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {bookToDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            if (!deletingId) setBookToDelete(null);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={26} />
            </div>

            <h2 className="mt-5 text-center font-serif text-2xl font-bold text-[#1F3B2D]">
              Delete this book?
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <strong className="text-gray-800">
                {bookToDelete.title}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                onClick={() => setBookToDelete(null)}
                disabled={Boolean(deletingId)}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={Boolean(deletingId)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deletingId ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                {deletingId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
