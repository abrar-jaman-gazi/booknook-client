
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  BookOpen,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (password.length > 128) {
      toast.error("Password cannot exceed 128 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (image.trim()) {
      try {
        new URL(image.trim());
      } catch {
        toast.error("Please enter a valid profile photo URL.");
        return;
      }
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        ...(image.trim() ? { image: image.trim() } : {}),
      });

      if (result.error) {
        toast.error(
          result.error.message || "Registration failed. Please try again."
        );
        return;
      }

      toast.success("Account created successfully! Please log in.");

      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        {/* Left information panel */}
        <div className="relative hidden min-h-[700px] flex-col justify-between overflow-hidden bg-[#173D32] p-12 text-white md:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#D6A84B]/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="rounded-xl bg-[#D6A84B] p-2.5 text-[#173D32]">
                <BookOpen size={26} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                BookNook
              </span>
            </Link>
          </div>

          <div className="relative z-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#D6A84B]">
              A world of stories
            </p>
            <h1 className="mb-6 text-5xl font-bold leading-tight">
              Every book opens a new world.
            </h1>
            <p className="max-w-md text-lg leading-8 text-white/75">
              Join BookNook and discover a growing collection of books.
              Borrow, explore, and make reading part of your everyday life.
            </p>
          </div>

          <p className="relative z-10 text-sm text-white/50">
            Your next favourite book is waiting for you.
          </p>
        </div>

        {/* Registration form */}
        <div className="flex items-center justify-center p-6 py-12 sm:p-10 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 md:hidden">
              <Link href="/" className="inline-flex items-center gap-2">
                <BookOpen className="text-[#173D32]" size={28} />
                <span className="text-2xl font-bold text-[#173D32]">
                  BookNook
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#B38B3E]">
                Get started today
              </p>
              <h2 className="text-3xl font-bold text-[#173D32]">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Join our reading community and explore new stories.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full name *
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email address *
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                  />
                </div>
              </div>

              {/* Profile photo */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Profile photo URL{" "}
                  <span className="text-gray-400">(optional)</span>
                </label>
                <div className="relative">
                  <ImageIcon
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-12 text-sm text-gray-800 outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#173D32]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  At least 6 characters, including uppercase and lowercase
                  letters.
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm password *
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-12 text-sm text-gray-800 outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#173D32]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173D32] py-3.5 font-semibold text-white transition hover:bg-[#245545] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#173D32] hover:text-[#B38B3E]"
              >
                Log in
              </Link>
            </p>

            <p className="mt-6 text-center text-xs text-gray-400">
              By creating an account, you agree to use BookNook responsibly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
