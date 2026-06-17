import Image from "next/image";
import Link from "next/link";

export function SiteBrand() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-brand/20 bg-white/90 backdrop-blur-md transition-shadow">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <Image
            src="/mtu-logo.png"
            alt="Mountain Top University logo"
            width={48}
            height={48}
            className="h-10 w-10 rounded-md border border-brand-soft/70 bg-white object-contain p-1 sm:h-11 sm:w-11"
            priority
          />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand sm:text-sm">
            Mountain Top University
          </p>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/register"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900"
          >
            Register
          </Link>
          <Link
            href="/admin/login"
            className="ml-1 rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-emerald-800 hover:-translate-y-px"
          >
            Admin →
          </Link>
        </nav>
      </div>
    </header>
  );
}
