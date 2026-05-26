"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

interface StyleStat {
  slug: string;
  name: string;
  count: number;
  percentage: number;
  emoji: string;
}

interface MonthlyData {
  month: string;
  simulations: number;
  bookings: number;
  conversions: number;
}

// ── Fallback Data ─────────────────────────────────────────────────────────────

const MOCK_STYLE_STATS: StyleStat[] = [
  { slug: "natural-feather", name: "Natural Feather", count: 148, percentage: 32, emoji: "🪶" },
  { slug: "ombre-powder",    name: "Ombre Powder",    count: 112, percentage: 24, emoji: "🌅" },
  { slug: "straight-korean", name: "Straight Korean", count: 89,  percentage: 19, emoji: "🇰🇷" },
  { slug: "bold-arch",       name: "Bold Arch",       count: 65,  percentage: 14, emoji: "🔥" },
  { slug: "3d-hair-stroke",  name: "3D Hair Stroke",  count: 42,  percentage: 9,  emoji: "💎" },
  { slug: "fluffy-brow",     name: "Fluffy Brow",     count: 9,   percentage: 2,  emoji: "☁️" },
];

const MOCK_MONTHLY: MonthlyData[] = [
  { month: "Jan",  simulations: 48,  bookings: 22, conversions: 46 },
  { month: "Feb",  simulations: 55,  bookings: 28, conversions: 51 },
  { month: "Mar",  simulations: 71,  bookings: 35, conversions: 49 },
  { month: "Apr",  simulations: 83,  bookings: 42, conversions: 51 },
  { month: "May",  simulations: 98,  bookings: 54, conversions: 55 },
  { month: "Jun",  simulations: 112, bookings: 61, conversions: 54 },
];

// ── Mini Bar Chart ────────────────────────────────────────────────────────────

function MiniBarChart({ data }: { data: MonthlyData[] }) {
  const maxSim = Math.max(...data.map((d) => d.simulations));
  return (
    <div className="flex items-end justify-between gap-2 h-36 px-2">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
          <div className="relative w-full flex gap-0.5 items-end justify-center" style={{ height: "100px" }}>
            <div
              className="w-5 bg-brand-200 rounded-t-md transition-all hover:bg-brand-300"
              style={{ height: `${(d.simulations / maxSim) * 100}%` }}
              title={`Simulations: ${d.simulations}`}
            />
            <div
              className="w-5 bg-brand-500 rounded-t-md transition-all hover:bg-brand-400"
              style={{ height: `${(d.bookings / maxSim) * 100}%` }}
              title={`Bookings: ${d.bookings}`}
            />
          </div>
          <span className="text-xs text-stone-400 font-medium">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ── Conversion Funnel ─────────────────────────────────────────────────────────

function ConversionFunnel({ simulations, bookings }: { simulations: number; bookings: number }) {
  const convRate = simulations > 0 ? Math.round((bookings / simulations) * 100) : 0;
  return (
    <div className="space-y-3">
      {[
        { label: "Simulations Run", value: simulations, pct: 100, color: "bg-brand-200" },
        { label: "Consultation Completed", value: Math.round(simulations * 0.72), pct: 72, color: "bg-brand-300" },
        { label: "Bookings Confirmed", value: bookings, pct: convRate, color: "bg-brand-500" },
      ].map((row) => (
        <div key={row.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-stone-600 font-medium">{row.label}</span>
            <span className="text-stone-900 font-bold">{row.value} <span className="text-stone-400 font-normal">({row.pct}%)</span></span>
          </div>
          <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${row.color} rounded-full transition-all`}
              style={{ width: `${row.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ClinicAnalyticsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [loading, setLoading] = useState(true);
  const [clinicName, setClinicName] = useState("Your Clinic");
  const [styleStats, setStyleStats] = useState<StyleStat[]>(MOCK_STYLE_STATS);
  const [monthly, setMonthly] = useState<MonthlyData[]>(MOCK_MONTHLY);
  const [period, setPeriod] = useState<"30d" | "90d" | "all">("30d");

  useEffect(() => {
    async function load() {
      try {
        const { data: mine } = await api.get("/api/clinics/mine");
        if (mine.clinic) {
          setClinicName(mine.clinic.name);
        }
      } catch {
        // Use mock data
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Aggregate stats from monthly data
  const totalSims = monthly.reduce((s, d) => s + d.simulations, 0);
  const totalBookings = monthly.reduce((s, d) => s + d.bookings, 0);
  const avgConvRate = monthly.length > 0 ? Math.round(monthly.reduce((s, d) => s + d.conversions, 0) / monthly.length) : 0;
  const lastMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];
  const simGrowth = prevMonth ? Math.round(((lastMonth.simulations - prevMonth.simulations) / prevMonth.simulations) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 text-sm animate-pulse">Loading analytics…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 text-white px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <Link href={`/${locale}/clinic`} className="text-xs text-stone-400 hover:text-stone-200 mb-4 inline-flex items-center gap-1">
            ← Clinic Dashboard
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-2 block">
                Analytics
              </span>
              <h1 className="font-serif text-3xl font-bold">{clinicName}</h1>
              <p className="text-stone-400 text-sm mt-1">Simulation performance & conversion insights</p>
            </div>
            <div className="flex items-center gap-2 bg-stone-800/60 border border-stone-700 rounded-xl p-1">
              {(["30d", "90d", "all"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    period === p ? "bg-brand-500 text-white" : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {p === "all" ? "All time" : p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Simulations",
              value: totalSims.toLocaleString(),
              delta: `+${simGrowth}% vs last month`,
              positive: simGrowth >= 0,
              accent: "bg-brand-50 border-brand-100 text-brand-600",
              icon: "🎨",
            },
            {
              label: "Total Bookings",
              value: totalBookings.toLocaleString(),
              delta: `${lastMonth.bookings} this month`,
              positive: true,
              accent: "bg-green-50 border-green-100 text-green-600",
              icon: "📅",
            },
            {
              label: "Avg. Conversion Rate",
              value: `${avgConvRate}%`,
              delta: "Simulation → Booking",
              positive: avgConvRate >= 50,
              accent: "bg-yellow-50 border-yellow-100 text-yellow-700",
              icon: "📈",
            },
            {
              label: "Most Popular Style",
              value: styleStats[0]?.emoji ?? "🪶",
              delta: styleStats[0]?.name ?? "Natural Feather",
              positive: true,
              accent: "bg-purple-50 border-purple-100 text-purple-600",
              icon: null,
            },
          ].map((kpi) => (
            <div key={kpi.label} className={`bg-white rounded-2xl border p-5 ${kpi.accent.split(" ")[1]}`}>
              {kpi.icon !== null && (
                <div className={`text-xl mb-2 ${kpi.accent.split(" ")[2]}`}>{kpi.icon}</div>
              )}
              <div className={`text-2xl font-bold leading-none mb-1 ${kpi.accent.split(" ")[2]}`}>
                {kpi.value}
              </div>
              <div className="text-xs text-stone-500 font-medium">{kpi.label}</div>
              <div className={`text-xs font-semibold mt-2 ${kpi.positive ? "text-green-600" : "text-red-500"}`}>
                {kpi.delta}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Monthly Trend Chart */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-stone-900 text-base">Monthly Trend</h2>
                <p className="text-xs text-stone-400 mt-0.5">Simulations vs Bookings</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-brand-200 inline-block" />Simulations</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-brand-500 inline-block" />Bookings</span>
              </div>
            </div>
            <MiniBarChart data={monthly} />
            <div className="mt-4 pt-4 border-t border-stone-50 grid grid-cols-3 gap-4 text-center">
              {monthly.slice(-3).map((d) => (
                <div key={d.month}>
                  <div className="text-sm font-bold text-stone-900">{d.simulations}</div>
                  <div className="text-xs text-stone-400">{d.month} sims</div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
            <h2 className="font-bold text-stone-900 text-base mb-1">Conversion Funnel</h2>
            <p className="text-xs text-stone-400 mb-5">This month</p>
            <ConversionFunnel
              simulations={lastMonth.simulations}
              bookings={lastMonth.bookings}
            />
            <div className="mt-5 pt-4 border-t border-stone-50">
              <div className="bg-brand-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-brand-600">
                  {Math.round((lastMonth.bookings / lastMonth.simulations) * 100)}%
                </div>
                <div className="text-xs text-stone-500 mt-0.5">Conversion Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Styles */}
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-stone-900 text-base">Popular Styles</h2>
              <p className="text-xs text-stone-400 mt-0.5">Client preference breakdown</p>
            </div>
            <span className="text-xs text-stone-400 bg-stone-50 border border-stone-100 px-3 py-1.5 rounded-full">
              {totalSims} total
            </span>
          </div>
          <div className="space-y-4">
            {styleStats.map((s, i) => (
              <div key={s.slug} className="flex items-center gap-4">
                <div className="w-6 text-center text-xs text-stone-400 font-bold shrink-0">
                  #{i + 1}
                </div>
                <div className="text-lg shrink-0">{s.emoji}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-stone-800">{s.name}</span>
                    <span className="text-xs font-bold text-stone-700">{s.count} <span className="text-stone-400 font-normal">({s.percentage}%)</span></span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${i === 0 ? "bg-brand-500" : i === 1 ? "bg-brand-400" : i === 2 ? "bg-brand-300" : "bg-brand-200"}`}
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insight Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: "Peak Booking Day",
              value: "Saturday",
              desc: "38% of bookings happen on weekends",
              icon: "📆",
              color: "bg-blue-50 border-blue-100",
            },
            {
              title: "Avg. Session Duration",
              value: "12 min",
              desc: "Time spent on simulator per client",
              icon: "⏱️",
              color: "bg-amber-50 border-amber-100",
            },
            {
              title: "Client Return Rate",
              value: "64%",
              desc: "Clients who return within 6 months",
              icon: "🔄",
              color: "bg-green-50 border-green-100",
            },
          ].map((insight) => (
            <div key={insight.title} className={`rounded-2xl border p-5 ${insight.color}`}>
              <div className="text-2xl mb-2">{insight.icon}</div>
              <div className="text-xl font-bold text-stone-900 mb-0.5">{insight.value}</div>
              <div className="text-sm font-semibold text-stone-700 mb-1">{insight.title}</div>
              <div className="text-xs text-stone-500">{insight.desc}</div>
            </div>
          ))}
        </div>

        {/* Upgrade CTA (if on free plan) */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl p-8 text-white text-center">
          <h3 className="font-serif text-xl font-bold mb-2">Unlock Advanced Analytics</h3>
          <p className="text-brand-100 text-sm mb-5 max-w-md mx-auto">
            Get real-time data, client segmentation, A/B style testing, and export reports with Pro Clinic.
          </p>
          <Link
            href={`/${locale}/pricing`}
            className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-6 py-3 rounded-2xl hover:bg-stone-50 transition-colors shadow-md"
          >
            Upgrade to Pro →
          </Link>
        </div>
      </div>
    </div>
  );
}
