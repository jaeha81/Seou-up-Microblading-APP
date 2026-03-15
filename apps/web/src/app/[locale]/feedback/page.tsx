"use client";

import { useState } from "react";
import api from "@/lib/api";

const CATEGORIES = [
  { value: "general", label: "General", emoji: "💬" },
  { value: "bug", label: "Bug Report", emoji: "🐛" },
  { value: "feature", label: "Feature Request", emoji: "💡" },
];

export default function FeedbackPage() {
  const [form, setForm] = useState({
    category: "general",
    rating: 0,
    message: "",
    email: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/api/feedback/anonymous", form);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🙏</div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Thank you for your feedback!</h2>
          <p className="text-stone-500">Your feedback helps us improve Seou-up.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Send Feedback</h1>
        <p className="text-stone-600 mb-8">Help us improve the platform.</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Category</label>
            <div className="flex gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: c.value })}
                  className={`flex-1 py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    form.category === c.value
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-stone-200 text-stone-600"
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, rating: r })}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    form.rating >= r ? "" : "opacity-30"
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              placeholder="Tell us what you think..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email (optional)</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="For follow-up (optional)"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600">Submission failed. Please try again.</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-stone-300 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {status === "loading" ? "Sending..." : "Send Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}
