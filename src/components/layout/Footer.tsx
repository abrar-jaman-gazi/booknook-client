
import Link from "next/link";
import { BookOpen, Mail, MapPin } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Books", href: "/books" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "X", href: "https://x.com" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#193829] text-white">
      <div className="container-main grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10">
              <BookOpen size={24} />
            </div>

            <span className="font-editorial text-3xl font-bold">
              BookNook
            </span>
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
            Every book opens a new world. Discover stories, share your
            collection, and make room for your next favorite read.
          </p>

          <div className="mt-6 flex flex-wrap gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/65 transition hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="mb-5 font-semibold">Explore</h3>

          <ul className="space-y-3 text-sm text-white/65">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 font-semibold">Get in touch</h3>

          <div className="space-y-4 text-sm text-white/65">
            <div className="flex items-start gap-3">
              <Mail size={17} className="mt-0.5 shrink-0" />
              <a
                href="mailto:hello@booknook.com"
                className="transition hover:text-white"
              >
                hello@booknook.com
              </a>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container-main flex flex-col justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>© 2026 BookNook. All rights reserved.</p>
          <p>Made for the love of reading.</p>
        </div>
      </div>
    </footer>
  );
}
