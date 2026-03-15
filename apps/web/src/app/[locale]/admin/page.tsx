"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

interface Stats {
  total_users: number;
  total_simulations: number;
  total_feedbacks: number;
}

interface User {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface Feedback {
  id: number;
  message: string;
  category: string | null;
  rating: number | null;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [tab, setTab] = useState<"stats" | "users" | "feedbacks">("stats");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, u, f] = await Promise.all([
          api.get("/api/admin/stats"),
          api.get("/api/admin/users"),
          api.get("/api/admin/feedbacks"),
        ]);
        setStats(s.data);
        setUsers(u.data);
        setFeedbacks(f.data);
      } catch {
        router.push(`/${locale}/auth/login`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locale, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-stone-400">Loading admin panel...</p></div>;

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Admin Dashboard</h1>
        <p className="text-stone-500 mb-6 text-sm">Platform management — Admin access only</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["stats", "users", "feedbacks"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                tab === t ? "bg-brand-500 text-white" : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "stats" && stats && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Users", value: stats.total_users, icon: "👥" },
              { label: "Total Simulations", value: stats.total_simulations, icon: "✨" },
              { label: "Total Feedbacks", value: stats.total_feedbacks, icon: "💬" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-3xl font-bold text-stone-900">{s.value}</div>
                <div className="text-sm text-stone-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-stone-500">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-stone-500">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-stone-500">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-stone-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-stone-500">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 text-stone-400">#{u.id}</td>
                    <td className="px-4 py-3 font-medium text-stone-900">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full text-xs">{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "feedbacks" && (
          <div className="space-y-3">
            {feedbacks.map((f) => (
              <div key={f.id} className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{f.category}</span>
                    {f.rating && <span className="text-xs text-stone-400">{"⭐".repeat(f.rating)}</span>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${f.status === "open" ? "bg-blue-100 text-blue-700" : "bg-stone-100 text-stone-600"}`}>
                    {f.status}
                  </span>
                </div>
                <p className="text-sm text-stone-700">{f.message}</p>
                <p className="text-xs text-stone-400 mt-2">{new Date(f.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
