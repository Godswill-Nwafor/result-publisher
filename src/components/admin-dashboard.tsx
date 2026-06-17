"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { AdminLogRecord, DashboardStats, NotificationRecord, ResultRecord, StudentRecord } from "@/lib/types";

type AdminDashboardProps = {
  adminEmail: string;
  students: StudentRecord[];
  results: ResultRecord[];
  logs: NotificationRecord[];
  adminLogs: AdminLogRecord[];
  stats: DashboardStats;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function badgeClass(status: string) {
  if (status === "sent" || status === "success")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "pending")
    return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "partial")
    return "border-orange-200 bg-orange-50 text-orange-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function messageClass(value: string) {
  return /error|failed|missing/i.test(value) ? "text-rose-700" : "text-emerald-700";
}

export function AdminDashboard({ adminEmail, students, results, logs, adminLogs, stats }: AdminDashboardProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const [isPublishing, startPublishTransition] = useTransition();
  const [isRemovingResult, startRemoveResultTransition] = useTransition();
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showNotificationLogs, setShowNotificationLogs] = useState(false);
  const [showAdminLogs, setShowAdminLogs] = useState(false);

  const recentLogs = useMemo(() => logs.slice(0, 8), [logs]);
  const recentAdminLogs = useMemo(() => adminLogs.slice(0, 8), [adminLogs]);
  const recentResults = useMemo(() => results.slice(0, 10), [results]);

  function handleUpload() {
    if (selectedFiles.length === 0) {
      setUploadError("Select one or more PDF files before uploading.");
      return;
    }
    setUploadError(null);
    setMessage(null);

    startUploadTransition(async () => {
      const formData = new FormData();
      for (const file of selectedFiles) formData.append("files", file);

      const response = await fetch("/api/results/upload", { method: "POST", body: formData });
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        outcomes?: Array<{ matricNumber: string; status: string; message: string }>;
      };

      if (!response.ok) { setUploadError(payload.message ?? "Upload failed"); return; }

      const summary =
        payload.outcomes?.map((o) => `${o.matricNumber}: ${o.status} (${o.message})`).join(" | ") ??
        "Upload completed";
      setMessage(summary);
      setSelectedFiles([]);
      router.refresh();
    });
  }

  function handlePublish() {
    setPublishError(null);
    setMessage(null);

    startPublishTransition(async () => {
      const response = await fetch("/api/results/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retryOnlyFailed: true }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
        outcomes?: Array<{ matricNumber: string; status: string; message: string }>;
      };

      if (!response.ok) { setPublishError(payload.message ?? "Publish failed"); return; }

      const summary =
        payload.outcomes?.map((o) => `${o.matricNumber}: ${o.status} (${o.message})`).join(" | ") ??
        "Publish completed";
      setMessage(summary);
      router.refresh();
    });
  }

  function handleRemoveSelectedFile(name: string) {
    setSelectedFiles((current) => current.filter((f) => f.name !== name));
  }

  function handleClearSelectedFiles() {
    setSelectedFiles([]);
  }

  function handleRemoveUploadedResult(matricNumber: string) {
    setRemoveError(null);
    setMessage(null);

    startRemoveResultTransition(async () => {
      const response = await fetch("/api/results/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricNumber }),
      });
      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) { setRemoveError(payload.message ?? "Could not remove uploaded result"); return; }
      setMessage(payload.message ?? `Removed result for ${matricNumber}`);
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

  return (
    <div className="grid gap-6">

      {/* ── Header banner ── */}
      <div className="animate-slide-up flex flex-col gap-4 rounded-4xl border border-slate-800/40 bg-slate-950 p-6 text-white shadow-[0_40px_100px_-50px_rgba(15,23,42,0.6)] lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin dashboard</p>
          <h1 className="text-2xl font-semibold sm:text-3xl">Student result distribution control room</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Signed in as <span className="font-semibold text-slate-200">{adminEmail}</span>. Upload PDFs, review matched records, and publish delivery.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? (
            <><span className="h-3.5 w-3.5 animate-spin-slow rounded-full border-2 border-white/30 border-t-white" /> Signing out…</>
          ) : (
            "Sign out"
          )}
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Registered students"  value={stats.studentCount}        accent="from-cyan-500 to-blue-500"    delay="anim-d-1" />
        <StatCard label="Uploaded results"      value={stats.resultCount}         accent="from-slate-600 to-slate-800"  delay="anim-d-2" />
        <StatCard label="Published results"     value={stats.publishedCount}      accent="from-emerald-500 to-teal-500" delay="anim-d-3" />
        <StatCard label="Pending deliveries"    value={stats.pendingCount}        accent="from-amber-400 to-orange-500" delay="anim-d-4" />
        <StatCard label="Successful deliveries" value={stats.successfulDeliveries} accent="from-green-500 to-emerald-500" delay="anim-d-5" />
        <StatCard label="Failed logs"           value={stats.failedDeliveries}    accent="from-rose-500 to-red-500"    delay="anim-d-6" />
      </div>

      {/* ── Upload + Notification logs ── */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

        {/* Upload section */}
        <section className="animate-slide-up anim-d-sm grid gap-5 rounded-4xl border border-white/70 bg-white/95 p-6 shadow-[0_40px_90px_-60px_rgba(15,23,42,0.3)] backdrop-blur">
          <div className="grid gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Bulk upload</p>
            <h2 className="text-xl font-semibold text-slate-950">Upload PDF results</h2>
            <p className="text-sm leading-6 text-slate-500">
              Every file must be named exactly as <span className="mono font-semibold text-slate-800">matric_number.pdf</span> so the system can match it to a student.
            </p>
          </div>

          {/* Drop zone */}
          <div className="grid gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30">
            <input
              type="file"
              accept="application/pdf"
              multiple
              title="Select one or more PDF result files"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
              className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:transition-colors hover:file:bg-emerald-800"
            />

            {selectedFiles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file) => (
                  <span key={file.name} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
                    <span className="max-w-[160px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSelectedFile(file.name)}
                      className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500 transition hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No files selected</p>
            )}

            {selectedFiles.length > 0 ? (
              <button
                type="button"
                onClick={handleClearSelectedFiles}
                className="inline-flex w-fit rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Clear all
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-cyan-500 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? (
                <><span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-white/30 border-t-white" /> Matching PDFs…</>
              ) : (
                "Match PDFs"
              )}
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPublishing ? (
                <><span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-white/30 border-t-white" /> Publishing…</>
              ) : (
                "Publish results"
              )}
            </button>
          </div>

          {uploadError  ? <StatusBanner variant="error" text={uploadError} />  : null}
          {publishError ? <StatusBanner variant="error" text={publishError} /> : null}
          {removeError  ? <StatusBanner variant="error" text={removeError} />  : null}
          {message      ? <StatusBanner variant={messageClass(message) === "text-rose-700" ? "error" : "success"} text={message} /> : null}
        </section>

        {/* Notification logs */}
        <section className="animate-slide-up anim-d-md grid auto-rows-min gap-4 rounded-4xl border border-white/70 bg-white/95 p-6 shadow-[0_40px_90px_-60px_rgba(15,23,42,0.3)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="grid gap-0.5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Delivery health</p>
              <h2 className="text-xl font-semibold text-slate-950">Recent notifications</h2>
            </div>
            <ToggleButton open={showNotificationLogs} onClick={() => setShowNotificationLogs((v) => !v)} />
          </div>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showNotificationLogs ? "max-h-[1600px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="grid gap-3">
              {recentLogs.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-400">No delivery logs yet.</p>
              ) : (
                recentLogs.map((log) => (
                  <article key={log.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-white">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="mono text-sm font-semibold text-slate-950">{log.matric_number}</p>
                        <p className="text-xs text-slate-400">{formatDate(log.timestamp)}</p>
                      </div>
                      <Badge status={log.email_status} prefix="Email" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge status={log.sms_status} prefix="SMS" />
                      <Badge status={log.whatsapp_status} prefix="WA" />
                    </div>
                    {log.error_message ? <p className="mt-3 text-xs text-rose-600">{log.error_message}</p> : null}
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── Admin logs ── */}
      <section className="animate-slide-up anim-d-lg grid auto-rows-min gap-4 rounded-4xl border border-white/70 bg-white/95 p-6 shadow-[0_40px_90px_-60px_rgba(15,23,42,0.3)] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="grid gap-0.5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Audit</p>
            <h2 className="text-xl font-semibold text-slate-950">Admin activity</h2>
          </div>
          <ToggleButton open={showAdminLogs} onClick={() => setShowAdminLogs((v) => !v)} />
        </div>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAdminLogs ? "max-h-[1600px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="grid gap-3">
            {recentAdminLogs.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">No admin activity logged yet.</p>
            ) : (
              recentAdminLogs.map((log) => (
                <article key={log.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950 capitalize">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-slate-400">{log.admin_email} · {formatDate(log.created_at)}</p>
                    </div>
                    <Badge status={log.status} />
                  </div>
                  {log.target ? <p className="mt-2 text-xs text-slate-500">Target: <span className="mono">{log.target}</span></p> : null}
                  {log.detail  ? <p className="mt-1 text-xs text-slate-500">{log.detail}</p>  : null}
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Students + Results tables ── */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="animate-slide-up rounded-4xl border border-white/70 bg-white/95 p-6 shadow-[0_40px_90px_-60px_rgba(15,23,42,0.3)] backdrop-blur">
          <div className="grid gap-0.5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Students</p>
            <h2 className="text-xl font-semibold text-slate-950">Registered records</h2>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Matric</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3">Parent phone</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">No student records yet.</td>
                  </tr>
                ) : students.map((student) => (
                  <tr key={student.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/80">
                    <td className="py-3 pr-4 font-medium text-slate-950">{student.full_name}</td>
                    <td className="mono py-3 pr-4 text-slate-600">{student.matric_number}</td>
                    <td className="py-3 pr-4 text-slate-500">{student.email}</td>
                    <td className="py-3 text-slate-500">{student.parent_phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="animate-slide-up anim-d-sm rounded-4xl border border-white/70 bg-white/95 p-6 shadow-[0_40px_90px_-60px_rgba(15,23,42,0.3)] backdrop-blur">
          <div className="grid gap-0.5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Results</p>
            <h2 className="text-xl font-semibold text-slate-950">Uploaded PDFs</h2>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Matric</th>
                  <th className="pb-3 pr-4">State</th>
                  <th className="pb-3 pr-4">Uploaded</th>
                  <th className="pb-3 pr-4">Published</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">No results uploaded yet.</td>
                  </tr>
                ) : recentResults.map((result) => (
                  <tr key={result.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50/80">
                    <td className="mono py-3 pr-4 font-medium text-slate-950">{result.matric_number}</td>
                    <td className="py-3 pr-4">
                      <Badge status={result.delivery_state} />
                    </td>
                    <td className="py-3 pr-4 text-slate-500">{formatDate(result.uploaded_at)}</td>
                    <td className="py-3 pr-4 text-slate-500">{formatDate(result.published_at)}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        disabled={isRemovingResult}
                        onClick={() => handleRemoveUploadedResult(result.matric_number)}
                        className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isRemovingResult ? "Removing…" : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatCard({ label, value, accent, delay }: { label: string; value: number; accent: string; delay: string }) {
  return (
    <div className={`animate-scale-in ${delay} rounded-4xl border border-white/70 bg-white/95 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.2)] backdrop-blur transition-transform duration-200 hover:-translate-y-1`}>
      <div className={`h-1 w-14 rounded-full bg-linear-to-r ${accent}`} />
      <p className="mt-4 text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-950">{value}</p>
    </div>
  );
}

function Badge({ status, prefix }: { status: string; prefix?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass(status)}`}>
      {prefix ? `${prefix} ` : ""}{status}
    </span>
  );
}

function ToggleButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
    >
      {open ? "Collapse ↑" : "Expand ↓"}
    </button>
  );
}

function StatusBanner({ variant, text }: { variant: "success" | "error"; text: string }) {
  const cls = variant === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : "border-rose-200 bg-rose-50 text-rose-800";
  return (
    <div className={`animate-fade-in rounded-2xl border px-4 py-3 text-sm font-medium ${cls}`}>
      {text}
    </div>
  );
}
