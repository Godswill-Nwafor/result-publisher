import Link from "next/link";

export const metadata = {
  title: "Registration Successful | SRDS",
  description: "Your student registration was successful. Results will be sent to your contact details.",
};

export default function RegistrationSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="animate-scale-in w-full">
        <section className="grid gap-8 rounded-4xl border border-white/60 bg-white/95 p-8 shadow-[0_40px_90px_-55px_rgba(13,37,63,0.4)] backdrop-blur sm:p-12">

          {/* Animated check icon */}
          <div className="flex justify-center">
            <div className="animate-pulse-ring flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-200">
                <svg
                  className="h-10 w-10 text-emerald-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="animate-draw-check"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="grid gap-3 text-center">
            <h1 className="text-4xl font-semibold text-slate-950 sm:text-5xl">
              You&apos;re registered!
            </h1>
            <p className="mx-auto max-w-md text-base leading-relaxed text-slate-500">
              Your details have been saved. Results will be delivered to your
              email, SMS, and WhatsApp automatically once published.
            </p>
          </div>

          {/* Feature chips */}
          <div className="grid gap-3 rounded-3xl bg-emerald-50 p-6 sm:grid-cols-2">
            <DeliveryItem label="Personal & MTU email" sub="Direct to your inbox" />
            <DeliveryItem label="SMS & WhatsApp"       sub="To your phone number" />
            <DeliveryItem label="Parent notifications"  sub="Email & phone included" />
            <DeliveryItem label="Secure matching"       sub="Matched by matric number" />
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-sm text-blue-900">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              <strong>Note:</strong> Keep your contact details up to date. Results are sent as soon as the administration publishes them.
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-full bg-emerald-900 px-8 py-3.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-emerald-800"
            >
              Return to home
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-slate-200 px-8 py-3.5 text-center text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-50"
            >
              Register another student
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function DeliveryItem({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200">
        <svg className="h-3 w-3 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-emerald-900">{label}</p>
        <p className="text-xs text-emerald-700/70">{sub}</p>
      </div>
    </div>
  );
}
