import Image from "next/image";
import Link from "next/link";

export function SiteBrand() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 sm:px-6 lg:px-8">
      {/* Floating glass pill */}
      <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/85 px-4 py-2.5 shadow-[0_4px_32px_-8px_rgba(13,45,26,0.18)] backdrop-blur-xl sm:mt-4 sm:rounded-2xl sm:px-5">

        {/* Brand / logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity duration-150 hover:opacity-75"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200/80 bg-white shadow-sm">
            <Image
              src="/mtu-logo.png"
              alt="Mountain Top University"
              width={32}
              height={32}
              className="h-7 w-7 object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-brand">
              Mountain Top
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
              University
            </span>
          </div>
        </Link>

        {/* Centre badge — desktop only */}
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Result Distribution System
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1.5">
          <Link
            href="/"
            className="hidden rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-500 transition-all duration-150 hover:bg-slate-100 hover:text-slate-800 sm:inline-flex"
          >
            Home
          </Link>
          <Link
            href="/register"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900"
          >
            Register
          </Link>

          <div className="mx-1 h-4 w-px bg-slate-200" />

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-px hover:bg-emerald-800 hover:shadow-md hover:shadow-emerald-900/20"
          >
            <svg
              className="h-3.5 w-3.5 opacity-75"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
