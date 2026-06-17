import Link from "next/link";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="animate-fade-in mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>
          Student Result Distribution System
        </div>

        <h1 className="animate-slide-up anim-d-1 mx-auto max-w-4xl text-5xl font-semibold leading-[1.06] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          Deliver every result to every{" "}
          <br className="hidden sm:block" />
          student{" "}
          <span className="shimmer-text">automatically.</span>
        </h1>

        <p className="animate-slide-up anim-d-2 mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Upload matched PDFs and the system emails, SMSes, and WhatsApps each
          result to the right student and their parents — all in one publish
          flow.
        </p>

        <div className="animate-slide-up anim-d-3 mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-full bg-emerald-900 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-900/20"
          >
            Register as a Student
          </Link>
          <Link
            href="/admin/login"
            className="rounded-full border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
          >
            Admin Login →
          </Link>
        </div>

        <div className="animate-slide-up anim-d-4 mt-12 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
          <ChannelBadge color="bg-blue-500" label="Email delivery" />
          <span className="text-slate-300">·</span>
          <ChannelBadge color="bg-amber-500" label="SMS alerts" />
          <span className="text-slate-300">·</span>
          <ChannelBadge color="bg-green-500" label="WhatsApp" />
          <span className="text-slate-300">·</span>
          <ChannelBadge color="bg-purple-500" label="Parent notifications" />
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="animate-scale-in anim-d-5 grid grid-cols-2 overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-sm lg:grid-cols-4">
          {[
            { value: "3", label: "Delivery channels" },
            { value: "1-click", label: "Bulk publish" },
            { value: "Auto", label: "PDF matching" },
            { value: "Live", label: "Delivery logs" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-7 text-center">
              <p className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="animate-slide-up mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            What it does
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Everything in one automated flow
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<IconPDF />}    accent="emerald" title="Automatic PDF matching"   text="Name PDFs with a matric number and upload in bulk. The system reads each file, extracts the identifier, and matches it to the right student."                             delayClass="" />
          <FeatureCard icon={<IconEmail />}  accent="blue"    title="Email delivery"            text="Results reach students on their personal email and MTU email simultaneously. Parents receive their copy too."                                                              delayClass="anim-d-1" />
          <FeatureCard icon={<IconPhone />}  accent="green"   title="SMS & WhatsApp"            text="Instant SMS and WhatsApp alerts with a secure download link. Twilio and Termii adapters both supported."                                                                   delayClass="anim-d-2" />
          <FeatureCard icon={<IconParent />} accent="purple"  title="Parent included"           text="Parent email and phone are collected at registration and included in every delivery automatically — no extra steps."                                                       delayClass="anim-d-3" />
          <FeatureCard icon={<IconShield />} accent="amber"   title="Secure & auditable"        text="HMAC session tokens, bcrypt passwords, Row-Level Security in Supabase, and full admin activity logs."                                                                      delayClass="anim-d-4" />
          <FeatureCard icon={<IconChart />}  accent="rose"    title="Live delivery logs"        text="Track email, SMS, and WhatsApp delivery state per student in real time. Retry failed deliveries with one click."                                                           delayClass="anim-d-5" />
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mx-auto max-w-4xl px-4 pb-28 sm:px-6 lg:px-8">
        <div className="animate-slide-up mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            The flow
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Three steps from upload to inbox
          </h2>
        </div>

        <div className="relative grid gap-0">
          <div className="absolute left-6 top-10 hidden h-[calc(100%-5rem)] w-px bg-linear-to-b from-emerald-300 via-emerald-200 to-transparent lg:block" />
          <StepCard num={1} title="Students register once"         text="Students submit their matric number, email addresses, phone, and parent contacts via the self-service portal. No admin needed."                                                                  delayClass="anim-d-sm" />
          <StepCard num={2} title="Admin uploads PDFs in bulk"     text="Upload any number of PDF files named by matric number. The system reads each PDF, extracts the matric identifier, and matches it to a student record."                                          delayClass="anim-d-md" />
          <StepCard num={3} title="Publish — and it reaches everyone" text="One click triggers simultaneous delivery to student email ×2, SMS, WhatsApp, parent email, and parent phone. Delivery state is logged per channel."                                          delayClass="anim-d-lg" />
        </div>
      </section>

      {/* ── Dual CTA ── */}
      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="animate-slide-in-left anim-d-sm relative overflow-hidden rounded-4xl bg-emerald-950 p-8 text-white lg:p-10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-emerald-300/5 blur-3xl" />
            <div className="relative grid gap-6">
              <div className="inline-flex w-fit rounded-full border border-emerald-700 bg-emerald-900/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
                For Students
              </div>
              <div>
                <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">
                  Register once. Receive every result automatically.
                </h2>
                <p className="mt-3 leading-7 text-emerald-200/80">
                  Your details are stored securely. Every time results are
                  published, yours arrive instantly — no portal checking
                  required.
                </p>
              </div>
              <Link
                href="/register"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                Register now
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="animate-slide-in-right anim-d-sm relative overflow-hidden rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.15)] lg:p-10">
            <div className="pointer-events-none absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-emerald-100/60 blur-3xl" />
            <div className="relative grid gap-6">
              <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                For Admins
              </div>
              <div>
                <h2 className="text-2xl font-semibold leading-snug text-slate-950 sm:text-3xl">
                  Publish results without manual file chasing.
                </h2>
                <p className="mt-3 leading-7 text-slate-500">
                  Manage uploads, student records, delivery logs, and publishing
                  from one secure dashboard.
                </p>
              </div>
              <Link
                href="/admin/login"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Admin login
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mx-auto max-w-7xl border-t border-slate-200/80 px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-slate-400">
          Mountain Top University · Student Result Distribution System · Built
          with Next.js &amp; Supabase
        </p>
      </footer>
    </main>
  );
}

/* ── Sub-components ── */

function ChannelBadge({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

const accentMap: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  blue:    "bg-blue-100 text-blue-700",
  green:   "bg-green-100 text-green-700",
  purple:  "bg-purple-100 text-purple-700",
  amber:   "bg-amber-100 text-amber-700",
  rose:    "bg-rose-100 text-rose-700",
};

function FeatureCard({
  icon, accent, title, text, delayClass,
}: {
  icon: React.ReactNode;
  accent: string;
  title: string;
  text: string;
  delayClass: string;
}) {
  return (
    <article className={`card-hover animate-slide-up ${delayClass} rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)]`}>
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${accentMap[accent] ?? "bg-slate-100 text-slate-700"}`}>
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </article>
  );
}

function StepCard({
  num, title, text, delayClass,
}: {
  num: number;
  title: string;
  text: string;
  delayClass: string;
}) {
  return (
    <div className={`animate-slide-in-left ${delayClass} flex gap-6 pb-10`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-base font-semibold text-emerald-800">
        {num}
      </div>
      <div className="pt-2">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

/* ── Icons ── */

function IconPDF() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
    </svg>
  );
}

function IconParent() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}
