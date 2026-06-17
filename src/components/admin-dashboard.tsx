"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type {
  AdminLogRecord,
  DashboardStats,
  NotificationRecord,
  ResultRecord,
  StudentRecord,
} from "@/lib/types";

type AdminDashboardProps = {
  adminEmail: string;
  students: StudentRecord[];
  results: ResultRecord[];
  logs: NotificationRecord[];
  adminLogs: AdminLogRecord[];
  stats: DashboardStats;
};

type Tab = "overview" | "students" | "results" | "logs" | "activity";

/* ── helpers ─────────────────────────────────────── */

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function initials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

function badgeCls(status: string) {
  if (status === "sent" || status === "success")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "pending")
    return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "partial")
    return "border-orange-200 bg-orange-50 text-orange-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function dotCls(status: string) {
  if (status === "sent" || status === "success") return "bg-emerald-500";
  if (status === "pending") return "bg-amber-400";
  if (status === "partial") return "bg-orange-400";
  return "bg-rose-500";
}

/* ── Main component ──────────────────────────────── */

export function AdminDashboard({
  adminEmail,
  students,
  results,
  logs,
  adminLogs,
  stats,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  /* action state */
  const [message, setMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [isUploading, startUploadTransition] = useTransition();
  const [isPublishing, startPublishTransition] = useTransition();
  const [isRemovingResult, startRemoveResultTransition] = useTransition();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const recentLogs = useMemo(() => logs.slice(0, 10), [logs]);
  const recentAdminLogs = useMemo(() => adminLogs.slice(0, 10), [adminLogs]);
  const recentResults = useMemo(() => results.slice(0, 12), [results]);

  /* handlers */
  function handleUpload() {
    if (!selectedFiles.length) { setUploadError("Select one or more PDF files."); return; }
    setUploadError(null); setMessage(null);
    startUploadTransition(async () => {
      const fd = new FormData();
      for (const f of selectedFiles) fd.append("files", f);
      const res = await fetch("/api/results/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        outcomes?: { matricNumber: string; status: string; message: string }[];
      };
      if (!res.ok) { setUploadError(data.message ?? "Upload failed"); return; }
      setMessage(data.outcomes?.map(o => `${o.matricNumber}: ${o.status}`).join(" · ") ?? "Upload complete");
      setSelectedFiles([]);
      router.refresh();
    });
  }

  function handlePublish() {
    setPublishError(null); setMessage(null);
    startPublishTransition(async () => {
      const res = await fetch("/api/results/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retryOnlyFailed: true }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        outcomes?: { matricNumber: string; status: string; message: string }[];
      };
      if (!res.ok) { setPublishError(data.message ?? "Publish failed"); return; }
      setMessage(data.outcomes?.map(o => `${o.matricNumber}: ${o.status}`).join(" · ") ?? "Published");
      router.refresh();
    });
  }

  function handleRemoveResult(matricNumber: string) {
    setRemoveError(null); setMessage(null);
    startRemoveResultTransition(async () => {
      const res = await fetch("/api/results/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricNumber }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) { setRemoveError(data.message ?? "Remove failed"); return; }
      setMessage(data.message ?? `Removed ${matricNumber}`);
      router.refresh();
    });
  }

  function handleLogout() {
    startLogoutTransition(async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    });
  }

  /* tab definitions */
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview",  label: "Overview" },
    { id: "students",  label: "Students",  count: stats.studentCount },
    { id: "results",   label: "Results",   count: stats.resultCount },
    { id: "logs",      label: "Delivery",  count: logs.length },
    { id: "activity",  label: "Activity",  count: adminLogs.length },
  ];

  return (
    <div className="grid gap-6 pb-16">

      {/* ── TOP HEADER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-7 text-white shadow-[0_32px_80px_-30px_rgba(15,23,42,0.65)] sm:px-8">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-cyan-400/5 blur-2xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* left: avatar + info */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white shadow-lg">
              {initials(adminEmail)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                  Admin Portal
                </span>
                <span className="flex h-1.5 w-1.5 items-center justify-center">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-medium text-emerald-400/70 uppercase tracking-widest">Live</span>
              </div>
              <h1 className="mt-0.5 text-xl font-semibold sm:text-2xl">
                Result Distribution Control
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">{adminEmail}</p>
            </div>
          </div>

          {/* right: quick stats row */}
          <div className="flex flex-wrap items-center gap-3">
            <QuickStat label="Students" value={stats.studentCount} color="text-cyan-400" />
            <div className="h-6 w-px bg-white/10" />
            <QuickStat label="Published" value={stats.publishedCount} color="text-emerald-400" />
            <div className="h-6 w-px bg-white/10" />
            <QuickStat label="Pending" value={stats.pendingCount} color="text-amber-400" />
            <div className="h-6 w-px bg-white/10" />
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="ml-1 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition-all duration-150 hover:bg-white/10 disabled:opacity-50"
            >
              {isLoggingOut
                ? <><Spinner /> Signing out…</>
                : <>
                    <svg className="h-3.5 w-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </>
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={<IcoUsers />}   label="Students"    value={stats.studentCount}         from="from-sky-500"     to="to-blue-600"    delay="anim-d-1" />
        <StatCard icon={<IcoPDF />}     label="Uploaded"    value={stats.resultCount}          from="from-violet-500"  to="to-purple-600"  delay="anim-d-2" />
        <StatCard icon={<IcoSend />}    label="Published"   value={stats.publishedCount}       from="from-emerald-500" to="to-teal-600"    delay="anim-d-3" />
        <StatCard icon={<IcoClock />}   label="Pending"     value={stats.pendingCount}         from="from-amber-400"   to="to-orange-500"  delay="anim-d-4" />
        <StatCard icon={<IcoCheck />}   label="Delivered"   value={stats.successfulDeliveries} from="from-green-500"   to="to-emerald-600" delay="anim-d-5" />
        <StatCard icon={<IcoAlert />}   label="Failed"      value={stats.failedDeliveries}     from="from-rose-500"    to="to-red-600"     delay="anim-d-6" />
      </div>

      {/* ── TAB BAR ── */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-sm backdrop-blur">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-emerald-900 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="animate-fade-in grid gap-6">
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">

            {/* Upload card */}
            <section className="grid gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Step 1 → 2</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">Upload &amp; Publish Results</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Name PDFs as <span className="mono font-semibold text-slate-700">matric_number.pdf</span> — the system matches each file to a student automatically.
                  </p>
                </div>
              </div>

              {/* Drop zone */}
              <label className="group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-transform duration-200 group-hover:scale-110">
                  <svg className="h-6 w-6 text-slate-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-800">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} selected`
                      : "Click to browse or drop PDFs here"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">PDF files only · Multiple allowed</p>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => { setSelectedFiles(Array.from(e.target.files ?? [])); setUploadError(null); }}
                />
              </label>

              {/* Selected file chips */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((f) => (
                    <span key={f.name} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
                      <svg className="h-3 w-3 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                      <span className="max-w-[140px] truncate">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedFiles(p => p.filter(x => x.name !== f.name))}
                        className="ml-1 rounded-full text-slate-400 transition-colors hover:text-rose-600"
                        aria-label="Remove file"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedFiles([])}
                    className="rounded-full border border-dashed border-slate-200 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-rose-200 hover:text-rose-600"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-emerald-500 hover:shadow-emerald-200 disabled:opacity-55"
                >
                  {isUploading ? <><Spinner /> Matching…</> : <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Match PDFs
                  </>}
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-slate-800 disabled:opacity-55"
                >
                  {isPublishing ? <><Spinner /> Publishing…</> : <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Publish Results
                  </>}
                </button>
              </div>

              {uploadError  && <Alert variant="error"   text={uploadError} />}
              {publishError && <Alert variant="error"   text={publishError} />}
              {removeError  && <Alert variant="error"   text={removeError} />}
              {message      && <Alert variant="success" text={message} />}
            </section>

            {/* Recent delivery summary */}
            <section className="grid auto-rows-min gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Delivery health</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">Recent notifications</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("logs")}
                  className="text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
                >
                  View all →
                </button>
              </div>

              {recentLogs.length === 0 ? (
                <EmptyState icon="📭" text="No delivery logs yet." />
              ) : (
                <div className="grid gap-2">
                  {recentLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-colors hover:bg-white">
                      <div className="flex items-center gap-3">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${dotCls(log.email_status)}`} />
                        <div>
                          <p className="mono text-xs font-semibold text-slate-800">{log.matric_number}</p>
                          <p className="text-[10px] text-slate-400">{formatDate(log.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <MiniChip label="E" status={log.email_status} />
                        <MiniChip label="S" status={log.sms_status} />
                        <MiniChip label="W" status={log.whatsapp_status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* delivery rate mini gauge */}
              {stats.studentCount > 0 && (
                <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>Delivery success rate</span>
                    <span className="text-emerald-700">
                      {Math.round((stats.successfulDeliveries / Math.max(stats.resultCount, 1)) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                      style={{ width: `${Math.min(100, Math.round((stats.successfulDeliveries / Math.max(stats.resultCount, 1)) * 100))}%` }}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* STUDENTS */}
      {activeTab === "students" && (
        <section className="animate-fade-in rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Registry</p>
              <h2 className="mt-0.5 text-lg font-semibold text-slate-900">Registered Students</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
              {students.length} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">#</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Name</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Matric</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Personal Email</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">MTU Email</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phone</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Parent Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400"><EmptyState icon="👤" text="No student records yet." /></td></tr>
                ) : students.map((s, i) => (
                  <tr key={s.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-3.5 text-xs text-slate-400">{i + 1}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 text-[10px] font-bold text-white">
                          {s.full_name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900">{s.full_name}</span>
                      </div>
                    </td>
                    <td className="mono px-6 py-3.5 text-slate-600">{s.matric_number}</td>
                    <td className="px-6 py-3.5 text-slate-500">{s.email}</td>
                    <td className="px-6 py-3.5 text-slate-500">{s.mtu_email}</td>
                    <td className="px-6 py-3.5 text-slate-500">{s.phone_number}</td>
                    <td className="px-6 py-3.5 text-slate-500">{s.parent_phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* RESULTS */}
      {activeTab === "results" && (
        <section className="animate-fade-in rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Uploaded PDFs</p>
              <h2 className="mt-0.5 text-lg font-semibold text-slate-900">Result Files</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
              {results.length} files
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">#</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Matric No.</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Delivery State</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Uploaded</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Published</th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentResults.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400"><EmptyState icon="📄" text="No results uploaded yet." /></td></tr>
                ) : recentResults.map((r, i) => (
                  <tr key={r.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-3.5 text-xs text-slate-400">{i + 1}</td>
                    <td className="mono px-6 py-3.5 font-semibold text-slate-900">{r.matric_number}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeCls(r.delivery_state)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${dotCls(r.delivery_state)}`} />
                        {r.delivery_state}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{formatDate(r.uploaded_at)}</td>
                    <td className="px-6 py-3.5 text-slate-500">{formatDate(r.published_at)}</td>
                    <td className="px-6 py-3.5">
                      <button
                        type="button"
                        disabled={isRemovingResult}
                        onClick={() => handleRemoveResult(r.matric_number)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-50"
                      >
                        {isRemovingResult ? "Removing…" : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {removeError && <div className="px-6 pb-5"><Alert variant="error" text={removeError} /></div>}
          {message     && <div className="px-6 pb-5"><Alert variant="success" text={message} /></div>}
        </section>
      )}

      {/* DELIVERY LOGS */}
      {activeTab === "logs" && (
        <section className="animate-fade-in rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Channel tracking</p>
              <h2 className="mt-0.5 text-lg font-semibold text-slate-900">Delivery Logs</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
              {logs.length} entries
            </span>
          </div>

          {recentLogs.length === 0 ? (
            <div className="py-16"><EmptyState icon="📭" text="No delivery logs yet." /></div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentLogs.map((log) => (
                <div key={log.id} className="px-6 py-4 transition-colors hover:bg-slate-50/60">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${dotCls(log.email_status)}`} />
                      <span className="mono text-sm font-semibold text-slate-900">{log.matric_number}</span>
                      <span className="text-xs text-slate-400">{formatDate(log.timestamp)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <ChannelBadge label="Email" status={log.email_status} />
                      <ChannelBadge label="SMS" status={log.sms_status} />
                      <ChannelBadge label="WhatsApp" status={log.whatsapp_status} />
                    </div>
                  </div>
                  {log.error_message && (
                    <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">{log.error_message}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ADMIN ACTIVITY */}
      {activeTab === "activity" && (
        <section className="animate-fade-in rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Audit trail</p>
              <h2 className="mt-0.5 text-lg font-semibold text-slate-900">Admin Activity</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
              {adminLogs.length} actions
            </span>
          </div>

          {recentAdminLogs.length === 0 ? (
            <div className="py-16"><EmptyState icon="🔍" text="No admin activity logged yet." /></div>
          ) : (
            <div className="relative px-6 py-2">
              {/* timeline line */}
              <div className="absolute left-[2.6rem] top-4 bottom-4 w-px bg-slate-100" />
              <div className="grid gap-0">
                {recentAdminLogs.map((log) => (
                  <div key={log.id} className="relative flex gap-4 py-4">
                    <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm ${log.status === "success" ? "bg-emerald-100" : "bg-rose-100"}`}>
                      <span className={`text-[10px] font-bold ${log.status === "success" ? "text-emerald-700" : "text-rose-700"}`}>
                        {log.status === "success" ? "✓" : "✕"}
                      </span>
                    </div>
                    <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-colors hover:bg-white">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold capitalize text-slate-900">
                          {log.action.replace(/_/g, " ")}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badgeCls(log.status)}`}>
                            {log.status}
                          </span>
                          <span className="text-[10px] text-slate-400">{formatDate(log.created_at)}</span>
                        </div>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">{log.admin_email}</p>
                      {log.target && <p className="mt-1.5 text-xs text-slate-500">Target: <span className="mono">{log.target}</span></p>}
                      {log.detail  && <p className="mt-0.5 text-xs text-slate-500">{log.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ── Micro components ────────────────────────────── */

function StatCard({
  icon, label, value, from, to, delay,
}: { icon: React.ReactNode; label: string; value: number; from: string; to: string; delay: string }) {
  return (
    <div className={`animate-scale-in ${delay} group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}>
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br ${from} ${to} text-white shadow-sm`}>
        {icon}
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <p className={`text-lg font-bold tabular-nums ${color}`}>{value}</p>
      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function MiniChip({ label, status }: { label: string; status: string }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${badgeCls(status)}`}>
      {label}
    </span>
  );
}

function ChannelBadge({ label, status }: { label: string; status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeCls(status)}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotCls(status)}`} />
      {label} · {status}
    </span>
  );
}

function Alert({ variant, text }: { variant: "success" | "error"; text: string }) {
  return (
    <div className={`animate-fade-in flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm font-medium ${variant === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
      <span className="mt-0.5 text-base">{variant === "success" ? "✓" : "✕"}</span>
      {text}
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <span className="text-3xl">{icon}</span>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}

function Spinner() {
  return <span className="h-3.5 w-3.5 animate-spin-slow rounded-full border-2 border-white/30 border-t-white" />;
}

/* ── SVG Icons ───────────────────────────────────── */

function IcoUsers() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IcoPDF() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IcoSend() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function IcoClock() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IcoCheck() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IcoAlert() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
