
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  Upload,
  ImagePlus,
  X,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

interface CreateBookResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    title: string;
  };
}

interface ImageUploadResponse {
  success: boolean;
  message: string;
  imageUrl?: string;
}

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [totalCopies, setTotalCopies] = useState("1");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const user = session?.user;

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size cannot exceed 5 MB.");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImageUrl("");

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  function removeImage() {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview("");
    setImageUrl("");

    const input = document.getElementById(
      "book-image"
    ) as HTMLInputElement | null;

    if (input) input.value = "";
  }

  async function uploadImage(): Promise<string> {
    if (!selectedImage) {
      throw new Error("Please select a book cover image.");
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result =
        (await response.json()) as ImageUploadResponse;

      if (!response.ok || !result.success || !result.imageUrl) {
        throw new Error(
          result.message || "Image upload failed."
        );
      }

      setImageUrl(result.imageUrl);
      return result.imageUrl;
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to add a book.");
      router.push("/login");
      return;
    }

    if (!selectedImage && !imageUrl) {
      toast.error("Please upload a book cover image.");
      return;
    }

    const copies = Number(totalCopies);

    if (!Number.isInteger(copies) || copies < 1 || copies > 10000) {
      toast.error("Enter a valid number of copies (1–10,000).");
      return;
    }

    if (description.trim().length < 20) {
      toast.error("Description must contain at least 20 characters.");
      return;
    }

    setSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      if (!finalImageUrl) {
        finalImageUrl = await uploadImage();
      }

      const result = await apiRequest<CreateBookResponse>(
        "/api/books",
        {
          method: "POST",
          body: JSON.stringify({
            title: title.trim(),
            author: author.trim(),
            category,
            image: finalImageUrl,
            description: description.trim(),
            totalCopies: copies,
          }),
        }
      );

      toast.success(result.message || "Book added successfully!");

      router.push("/books");
      router.refresh();
    } catch (error) {
      console.error("Add book error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add book. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sessionLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F7F2]">
        <LoaderCircle className="animate-spin text-[#173D32]" size={36} />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F7F2] px-4">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <BookOpen className="mx-auto text-[#173D32]" size={42} />
          <h1 className="mt-4 text-2xl font-bold text-[#173D32]">
            Login required
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Please log in before adding a book to the library.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-[#173D32] px-6 py-3 font-semibold text-white hover:bg-[#245545]"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-12">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#173D32] transition hover:text-[#B38B3E]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#B38B3E]">
            Grow our collection
          </p>
          <h1 className="text-3xl font-bold text-[#173D32] sm:text-4xl">
            Add a New Book
          </h1>
          <p className="mt-2 text-gray-500">
            Share a new story with the BookNook reading community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl bg-white shadow-lg"
        >
          <div className="border-b border-gray-100 px-6 py-6 sm:px-10">
            <h2 className="text-xl font-bold text-[#173D32]">
              Book Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter the details of the book you want to add.
            </p>
          </div>

          <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-5">

            {/* Book details */}
            <div className="space-y-6 lg:col-span-3">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Book Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter the book title"
                  required
                  maxLength={150}
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Author Name *
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter the author's name"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                >
                  <option value="">Select a category</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Total Copies *
                </label>
                <input
                  type="number"
                  value={totalCopies}
                  onChange={(e) => setTotalCopies(e.target.value)}
                  min="1"
                  max="10000"
                  step="1"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Number of copies available in your collection.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Book Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a meaningful description of this book..."
                  required
                  minLength={20}
                  maxLength={2000}
                  rows={6}
                  className="w-full resize-y rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                />
                <p className="mt-2 text-right text-xs text-gray-400">
                  {description.length}/2000 characters
                </p>
              </div>
            </div>

            {/* Image upload */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Book Cover Image *
              </label>

              <div className="relative flex min-h-[310px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-[#FAFAF8] p-5 text-center transition hover:border-[#173D32]/50">

                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Book cover preview"
                      className="max-h-[260px] w-auto max-w-full rounded-xl object-contain shadow-md"
                    />

                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-700">
                      <CheckCircle2 size={17} />
                      Image selected
                    </div>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-500 shadow-md transition hover:bg-red-50"
                      aria-label="Remove selected image"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#173D32]/10 text-[#173D32]">
                      <ImagePlus size={30} />
                    </div>

                    <p className="font-semibold text-gray-700">
                      Upload book cover
                    </p>

                    <p className="mt-2 text-xs leading-6 text-gray-400">
                      PNG, JPG or WEBP
                      <br />
                      Maximum file size: 5 MB
                    </p>

                    <label
                      htmlFor="book-image"
                      className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#173D32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245545]"
                    >
                      <Upload size={16} />
                      Choose Image
                    </label>
                  </>
                )}

                <input
                  id="book-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Your image will be uploaded securely through the BookNook
                server to ImgBB.
              </p>

              {uploadingImage && (
                <div className="mt-4 flex items-center gap-2 text-sm text-[#173D32]">
                  <LoaderCircle size={17} className="animate-spin" />
                  Uploading image...
                </div>
              )}
            </div>
          </div>

          {/* User information */}
          <div className="mx-6 mb-8 rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5 sm:mx-10">
            <h3 className="mb-4 text-sm font-bold text-[#173D32]">
              Contributor Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-medium text-gray-400">
                  Added By
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-gray-400">
                  Email Address
                </p>
                <p className="break-all text-sm font-semibold text-gray-700">
                  {user.email}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              Contributor details are automatically taken from your account.
            </p>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-white px-6 py-6 sm:flex-row sm:justify-end sm:px-10">
            <Link
              href="/books"
              className="rounded-xl border border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173D32] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#245545] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  {uploadingImage ? "Uploading image..." : "Adding book..."}
                </>
              ) : (
                <>
                  <BookOpen size={17} />
                  Add Book to Library
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
