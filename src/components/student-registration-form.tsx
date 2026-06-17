"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const initialFormState = {
  fullName: "",
  matricNumber: "",
  email: "",
  mtuEmail: "",
  phoneNumber: "",
  parentEmail: "",
  parentPhone: "",
};

export function StudentRegistrationForm() {
  const router = useRouter();
  const [formState, setFormState] = useState(initialFormState);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorStatus(null);

    startTransition(async () => {
      const response = await fetch("/api/register-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        student?: { matricNumber?: string };
      };

      if (!response.ok) {
        setErrorStatus(payload.message ?? "Registration failed");
        return;
      }

      router.push("/register/success");
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-scale-in grid gap-6 rounded-4xl border border-white/60 bg-white/95 p-8 shadow-[0_40px_90px_-55px_rgba(13,37,63,0.4)] backdrop-blur"
    >
      <div className="grid gap-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          Student registration
        </p>
        <h2 className="text-2xl font-semibold text-slate-950">
          Submit your details once
        </h2>
        <p className="text-sm leading-6 text-slate-500">
          Matric number is the primary identifier used to match PDFs to the
          correct student.
        </p>
      </div>

      {/* Personal details */}
      <fieldset className="grid gap-4">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Personal details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name"     name="fullName"     value={formState.fullName}     onChange={handleChange} placeholder="e.g. Chukwuemeka Okafor" />
          <Field label="Matric number" name="matricNumber" value={formState.matricNumber} onChange={handleChange} placeholder="e.g. 22/0001" />
          <Field label="Personal email"    name="email"    type="email" value={formState.email}    onChange={handleChange} placeholder="you@gmail.com" />
          <Field label="MTU email"    name="mtuEmail" type="email" value={formState.mtuEmail} onChange={handleChange} placeholder="you@mtu.edu.ng" />
          <Field label="Phone number" name="phoneNumber"   value={formState.phoneNumber}   onChange={handleChange} placeholder="+2348012345678" />
        </div>
      </fieldset>

      <div className="border-t border-slate-100" />

      {/* Parent / guardian details */}
      <fieldset className="grid gap-4">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Parent / guardian
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Parent email"        name="parentEmail" type="email" value={formState.parentEmail} onChange={handleChange} placeholder="parent@example.com" />
          <Field label="Parent phone number" name="parentPhone"              value={formState.parentPhone} onChange={handleChange} placeholder="+2348098765432" />
        </div>
      </fieldset>

      {errorStatus ? (
        <div className="animate-fade-in flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {errorStatus}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-900/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-white/30 border-t-white" />
            Saving details…
          </>
        ) : (
          "Register student"
        )}
      </button>
    </form>
  );
}

function Field({
  label, name, type = "text", value, onChange, placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        required
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-ring rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 placeholder:text-slate-400"
      />
    </label>
  );
}
