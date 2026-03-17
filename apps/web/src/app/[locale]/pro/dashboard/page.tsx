"use client";

import { useEffect, useState } from "react";
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

export default function ProDashboardPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/simulations").then(({ data }) => {
      setSimulations(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Pro Dashboard</h1>
            <p className="text-stone-500 mt-1">Manage client consultations and simulation sessions</p>
          </div>
          <Link
            href={`/${locale}/pro/session`}
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            + New Session
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          ⚠️ <strong>Professional Use Only</strong> — Sessions and simulations are for consultation
          visualization purposes only. Always ensure you hold valid local licenses before performing procedures.
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Sessions", value: simulations.length, icon: "📋" },
            { label: "Completed", value: simulations.filter((s) => s.status === "completed").length, icon: "✅" },
            { label: "With Notes", value: simulations.filter((s) => s.session_note).length, icon: "📝" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-stone-900">{loading ? "—" : stat.value}</div>
              <div className="text-sm text-stone-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-semibold text-stone-900">Recent Sessions</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-stone-400">Loading sessions...</div>
          ) : simulations.length === 0 ? (
            <div className="p-8 text-center text-stone-400">
              <div className="text-4xl mb-3">📭</div>
              <p>No sessions yet.</p>
              <Link href={`/${locale}/pro/session`} className="text-brand-500 hover:underline text-sm mt-2 inline-block">
                Start your first session →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {simulations.map((sim) => (
                <div key={sim.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-stone-900">Session #{sim.id}</div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {new Date(sim.created_at).toLocaleString()} · Style ID: {sim.eyebrow_style_id ?? "—"}
                    </div>
                    {sim.session_note && (
                       <div className="text-xs text-stone-500 mt-1 italic">&quot;{sim.session_note}&quot;</div>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    sim.status === "completed" ? "bg-green-100 text-green-700" :
                    sim.status === "failed" ? "bg-red-100 text-red-700" :
                    "bg-stone-100 text-stone-600"
                  }`}>
                    {sim.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
