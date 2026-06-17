import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login | SRDS",
  description: "Admin authentication for result uploads and publishing.",
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        {/* Left panel */}
        <section className="animate-slide-in-left grid gap-7 rounded-4xl border border-slate-800/40 bg-slate-950 p-8 text-white shadow-[0_40px_120px_-60px_rgba(15,23,42,0.6)]">
          <div className="inline-flex w-fit rounded-full border border-slate-700/60 bg-slate-800/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
            Admin access
          </div>

          <div className="grid gap-4">
            <h1 className="max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
              Publish results without manual file chasing.
            </h1>
            <p className="text-base leading-7 text-slate-400">
              Authenticate with the Supabase admin record to manage students,
              uploads, delivery logs, and result publishing from one protected
              workspace.
            </p>
          </div>

          <div className="grid gap-3">
            <AdminFeature text="Bulk PDF upload with matric matching" />
            <AdminFeature text="One-click publish to all channels" />
            <AdminFeature text="Live delivery logs per student" />
            <AdminFeature text="Full admin activity audit trail" />
          </div>

          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-slate-400/5 blur-2xl" />
        </section>

        {/* Right panel — form */}
        <AdminLoginForm />
      </div>
    </main>
  );
}

function AdminFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-400">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800">
        <svg className="h-3 w-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      {text}
    </div>
  );
}
