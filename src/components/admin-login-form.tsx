"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const initialFormState = { email: "", password: "" };

export function AdminLoginForm() {
  const router = useRouter();
  const [formState, setFormState] = useState(initialFormState);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        setStatus({ ok: false, message: payload.message ?? "Login failed" });
        return;
      }

      setStatus({ ok: true, message: "Login successful. Redirecting…" });
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-scale-in grid gap-5 rounded-4xl border border-white/60 bg-white/95 p-8 shadow-[0_40px_90px_-55px_rgba(13,37,63,0.4)] backdrop-blur"
    >
      <div className="grid gap-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          Admin access
        </p>
        <h1 className="text-2xl font-semibold text-slate-950">
          Secure dashboard login
        </h1>
        <p className="text-sm leading-6 text-slate-500">
          Use the admin record stored in Supabase to unlock uploads,
          publishing, and logs.
        </p>
      </div>

      <div className="grid gap-4">
        <Field
          label="Admin email"
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
          placeholder="admin@mtu.edu.ng"
        />

        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              required
              name="password"
              type={showPassword ? "text" : "password"}
              value={formState.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-ring w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-950 placeholder:text-slate-400"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>
      </div>

      {status ? (
        <div className={`animate-fade-in flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${status.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
          {status.ok ? <IconCheck /> : <IconX />}
          {status.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-white/30 border-t-white" />
            Checking…
          </>
        ) : (
          "Sign in"
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

function IconEye() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconEyeOff() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconX() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
