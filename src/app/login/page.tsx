
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  BookOpen,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Invalid email or password."
        );
        return;
      }

      toast.success("Welcome back to BookNook!");

      const callbackURL = searchParams.get("callbackURL");

      // Only allow internal application paths as redirect destinations.
      const destination =
        callbackURL?.startsWith("/") && !callbackURL.startsWith("//")
          ? callbackURL
          : "/";

      router.push(destination);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Unable to start Google login. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F7F2] px-4 py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        {/* Left information panel */}
        <div className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-[#173D32] p-12 text-white md:flex">
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
              Welcome back
            </p>
            <h1 className="mb-6 text-5xl font-bold leading-tight">
              Your next chapter starts here.
            </h1>
            <p className="max-w-md text-lg leading-8 text-white/75">
              Sign in to explore your library, discover new books,
              and continue your reading journey with BookNook.
            </p>
          </div>

          <p className="relative z-10 text-sm text-white/50">
            A world of stories, all in one place.
          </p>
        </div>

        {/* Login form */}
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
                Your reading journey continues
              </p>
              <h2 className="text-3xl font-bold text-[#173D32]">
                Welcome back!
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Enter your account details to sign in.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email address
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

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#FAFAF8] py-3 pl-11 pr-12 text-sm text-gray-800 outline-none transition focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#173D32]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      "Password reset is not available in this version."
                    )
                  }
                  className="text-sm font-medium text-[#173D32] hover:text-[#B38B3E]"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173D32] py-3.5 font-semibold text-white transition hover:bg-[#245545] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium text-gray-400">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                "Connecting to Google..."
              ) : (
                <>
                  <svg
                    viewBox="0 0 48 48"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.73 6C44.45 37.99 46.98 31.93 46.98 24.55Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.92-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.19 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <p className="mt-7 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#173D32] hover:text-[#B38B3E]"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-6 text-center text-xs text-gray-400">
              By signing in, you agree to use BookNook responsibly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
