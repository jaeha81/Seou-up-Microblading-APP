"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";

interface Simulation {
  id: number;
  status: string;
  created_at: string;
  eyebrow_style_id: number | null;
  session_note: string | null;
}

interface Client {
  id: number;
  name: string;
  email: string;
  last_session: string | null;
  total_sessions: number;
  preferred_style: string | null;
}

const STYLE_NAMES: Record<number, string> = {
  1: "Natural Feather",
  2: "Soft Arch",
  3: "Bold Arch",
  4: "Straight Brow",
  5: "Rounded Brow",
  6: "High Arch",
  7: "Flat Brow",
  8: "S-Curve",
  9: "Micro Feather",
  10: "Ombre Gradient",
  11: "Combo Brow",
  12: "Powder Fill",
};

const STAT_ICONS: Record<string, React.ReactElement> = {
  brand: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
    </svg>
  ),
  green: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  gold: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  stone: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
};

const ACCENT_ICON_COLOR: Record<string, string> = {
  brand: "text-brand-500",
  green: "text-green-500",
  gold: "text-yellow-600",
  stone: "text-stone-500",
};

const ACCENT_BORDER: Record<string, string> = {
  brand: "border-brand-100",
  green: "border-green-100",
  gold: "border-yellow-100",
  stone: "border-stone-100",
};

function StatCard({
  label,
  value,
  sub,
  accent,
  loading,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "brand" | "green" | "gold" | "stone";
  loading?: boolean;
}) {
  const accentMap = {
    brand: "bg-brand-50 text-brand-600",
    green: "bg-green-50 text-green-600",
    gold: "bg-yellow-50 text-yellow-700",
    stone: "bg-stone-100 text-stone-600",
  };
  const key = accent ?? "stone";
  const bar = accentMap[key];
  const iconColor = ACCENT_ICON_COLOR[key];
  const borderColor = ACCENT_BORDER[key];
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border ${borderColor} flex flex-col gap-1`}>
      <div className="flex items-center justify-between mb-1">
        <div className={`text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md ${bar}`}>
          {label}
        </div>
        <div className={`${iconColor} opacity-70`}>
          {STAT_ICONS[key]}
        </div>
      </div>
      <div className="text-3xl font-bold text-stone-900 mt-1">
        {loading ? <span className="text-stone-300">—</span> : value}
      </div>
      {sub && <div className="text-xs text-stone-400">{sub}</div>}
    </div>
  );
}

export default function ProDashboardPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"sessions" | "clients">("sessions");

  useEffect(() => {
    api
      .get("/api/simulations")
      .then(({ data }) => setSimulations(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const completed = simulations.filter((s) => s.status === "completed");
  const thisMonth = simulations.filter((s) => {
    const d = new Date(s.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const withNotes = simulations.filter((s) => s.session_note);

  // Derive mock clients from simulations for display
  const mockClients: Client[] = simulations.slice(0, 8).map((sim, i) => ({
    id: sim.id,
    name: `Client #${String(i + 1).padStart(3, "0")}`,
    email: `client${i + 1}@example.com`,
    last_session: sim.created_at,
    total_sessions: Math.max(1, Math.floor(Math.random() * 4)),
    preferred_style: sim.eyebrow_style_id ? STYLE_NAMES[sim.eyebrow_style_id] ?? null : null,
  }));

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 bg-brand-50 px-2 py-0.5 rounded-md">
                Pro Clinic
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">Clinic Dashboard</h1>
            <p className="text-stone-500 text-sm mt-0.5">
              Manage consultations, track clients, and monitor your growth.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/pricing`}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              Upgrade to Agency
            </Link>
            <Link
              href={`/${locale}/pro/session`}
              className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              + New Session
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <span className="shrink-0 font-bold">!</span>
          <span>
            <strong>Professional Use Only</strong> — Sessions are for consultation visualization.
            Always hold valid local licenses before performing procedures.
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Sessions"
            value={simulations.length}
            sub="All time"
            accent="brand"
            loading={loading}
          />
          <StatCard
            label="This Month"
            value={thisMonth.length}
            sub={new Date().toLocaleString("en", { month: "long", year: "numeric" })}
            accent="green"
            loading={loading}
          />
          <StatCard
            label="Completed"
            value={completed.length}
            sub={`${simulations.length > 0 ? Math.round((completed.length / simulations.length) * 100) : 0}% completion rate`}
            accent="gold"
            loading={loading}
          />
          <StatCard
            label="With Notes"
            value={withNotes.length}
            sub="Sessions documented"
            accent="stone"
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "New Consultation", href: `/${locale}/pro/session`, icon: "+" },
            { label: "Brow Simulator", href: `/${locale}/simulate`, icon: "✦" },
            { label: "View Guides", href: `/${locale}/guide`, icon: "◎" },
            { label: "Manage Profile", href: `/${locale}/profile`, icon: "◈" },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="bg-white rounded-xl border border-stone-100 px-4 py-3.5 flex items-center gap-3 hover:border-brand-200 hover:bg-brand-50 transition-all group"
            >
              <span className="w-8 h-8 rounded-lg bg-stone-100 group-hover:bg-brand-100 flex items-center justify-center text-stone-600 group-hover:text-brand-600 font-bold text-sm transition-colors">
                {a.icon}
              </span>
              <span className="text-sm font-medium text-stone-700 group-hover:text-brand-700 transition-colors">
                {a.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100">
          <div className="px-6 pt-5 border-b border-stone-100">
            <div className="flex items-center gap-1">
              {(["sessions", "clients"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-semibold rounded-t-lg -mb-px border-b-2 transition-colors ${
                    tab === t
                      ? "border-brand-500 text-brand-600"
                      : "border-transparent text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {t === "sessions" ? "Recent Sessions" : "Clients"}
                </button>
              ))}
            </div>
          </div>

          {tab === "sessions" && (
            <>
              {loading ? (
                <div className="p-10 text-center text-stone-400 text-sm">Loading sessions…</div>
              ) : simulations.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    📋
                  </div>
                  <p className="text-stone-500 text-sm mb-3">No sessions yet.</p>
                  <Link
                    href={`/${locale}/pro/session`}
                    className="text-brand-500 hover:text-brand-400 text-sm font-semibold"
                  >
                    Start your first session →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-stone-50">
                  {simulations.slice(0, 10).map((sim) => (
                    <div key={sim.id} className="px-6 py-4 flex items-center justify-between group hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold shrink-0">
                          #{sim.id}
                        </div>
                        <div>
                          <div className="font-medium text-stone-900 text-sm">
                            Session #{sim.id}
                            {sim.eyebrow_style_id && (
                              <span className="ml-2 text-xs text-stone-400 font-normal">
                                — {STYLE_NAMES[sim.eyebrow_style_id] ?? `Style ${sim.eyebrow_style_id}`}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-stone-400 mt-0.5">
                            {new Date(sim.created_at).toLocaleDateString("en", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          {sim.session_note && (
                            <div className="text-xs text-stone-500 mt-1 italic max-w-xs truncate">
                              &ldquo;{sim.session_note}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          sim.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : sim.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {sim.status}
                      </span>
                    </div>
                  ))}
                  {simulations.length > 10 && (
                    <div className="px-6 py-3 text-xs text-stone-400 text-center">
                      Showing 10 of {simulations.length} sessions
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {tab === "clients" && (
            <>
              {loading ? (
                <div className="p-10 text-center text-stone-400 text-sm">Loading clients…</div>
              ) : mockClients.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    👥
                  </div>
                  <p className="text-stone-500 text-sm mb-1">No clients tracked yet.</p>
                  <p className="text-xs text-stone-400">
                    Start a session to automatically create client records.
                  </p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-3 border-b border-stone-50 bg-stone-50/50">
                    <div className="grid grid-cols-4 text-xs font-semibold text-stone-400 uppercase tracking-widest">
                      <span>Client</span>
                      <span>Preferred Style</span>
                      <span>Sessions</span>
                      <span>Last Visit</span>
                    </div>
                  </div>
                  <div className="divide-y divide-stone-50">
                    {mockClients.map((client) => (
                      <div key={client.id} className="px-6 py-3.5 grid grid-cols-4 items-center hover:bg-stone-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-stone-900">{client.name}</div>
                            <div className="text-xs text-stone-400">{client.email}</div>
                          </div>
                        </div>
                        <div className="text-sm text-stone-600">
                          {client.preferred_style ?? <span className="text-stone-300">—</span>}
                        </div>
                        <div className="text-sm text-stone-600">{client.total_sessions}</div>
                        <div className="text-sm text-stone-400">
                          {client.last_session
                            ? new Date(client.last_session).toLocaleDateString("en", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-3 border-t border-stone-100 bg-stone-50/50">
                    <p className="text-xs text-stone-400">
                      Client records are derived from session data. Full CRM available on Agency plan.
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Upgrade Banner */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-1">
              Upgrade
            </div>
            <p className="text-white font-semibold text-sm">
              Get unlimited consultations, full CRM, analytics & Featured badge on Agency plan.
            </p>
          </div>
          <Link
            href={`/${locale}/pricing`}
            className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            See Plans →
          </Link>
        </div>
      </div>
    </div>
  );
}
