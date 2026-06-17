import type { Metadata } from "next";
import { StudentRegistrationForm } from "@/components/student-registration-form";

export const metadata: Metadata = {
  title: "Student Registration | SRDS",
  description: "Register student and parent contact details for automatic result delivery.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:pt-4">
        {/* Left panel */}
        <section className="animate-slide-in-left grid gap-7 rounded-4xl border border-emerald-800/40 bg-emerald-950 p-8 text-white shadow-[0_40px_120px_-60px_rgba(6,78,59,0.7)] lg:sticky lg:top-28">
          <div className="inline-flex w-fit rounded-full border border-emerald-700/60 bg-emerald-900/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            Student portal
          </div>

          <div className="grid gap-4">
            <h1 className="max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
              Register once. Receive every result automatically.
            </h1>
            <p className="text-base leading-7 text-emerald-200/75">
              Fill in your details below and we will deliver your results straight
              to your inbox and phone the moment they are published.
            </p>
          </div>

          <div className="grid gap-3">
            <InfoRow icon="✉" text="Personal &amp; MTU email — both receive your result" />
            <InfoRow icon="💬" text="SMS &amp; WhatsApp to your registered phone number" />
            <InfoRow icon="👨‍👩‍👧" text="Parent email and phone included automatically" />
            <InfoRow icon="🔒" text="Matched by matric number — no mix-ups" />
          </div>

          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-400/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-6 left-4 h-24 w-24 rounded-full bg-emerald-300/5 blur-2xl" />
        </section>

        {/* Right panel — form */}
        <StudentRegistrationForm />
      </div>
    </main>
  );
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3 text-sm text-emerald-200/80">
      <span className="mt-px text-base leading-none">{icon}</span>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static trusted strings */}
      <span dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}
