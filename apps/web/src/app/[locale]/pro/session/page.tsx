"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function ProSessionPage() {
  const params = useParams();
  const locale = params.locale as string;

  const [clientName, setClientName] = useState("");
  const [note, setNote] = useState("");
  const [selectedStyleId, setSelectedStyleId] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [sessionId, setSessionId] = useState<number | null>(null);

  const handleCreate = async () => {
    setStatus("saving");
    try {
      const { data: sim } = await api.post("/api/simulations", {
        eyebrow_style_id: selectedStyleId,
      });
      const fullNote = [clientName && `Client: ${clientName}`, note].filter(Boolean).join("\n");
      if (fullNote) {
        await api.patch(`/api/simulations/${sim.id}/note`, { session_note: fullNote });
      }
      setSessionId(sim.id);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const STYLES = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `Style ${i + 1}` }));

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href={`/${locale}/pro/dashboard`} className="text-sm text-brand-500 hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-stone-900 mb-2">New Client Session</h1>
        <p className="text-stone-500 text-sm mb-6">
          Create a consultation session and run a brow simulation for your client.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-xs text-amber-800">
          ⚠️ Visualization only — simulation results are not guarantees of actual procedure outcomes.
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              placeholder="Client name (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Recommended Style</label>
            <div className="grid grid-cols-4 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyleId(s.id)}
                  className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                    selectedStyleId === s.id
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-stone-200 text-stone-600 hover:border-stone-300"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Session Notes</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              placeholder="Client preferences, skin condition notes, consultation details..."
            />
          </div>

          {status === "done" ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">✅</div>
              <p className="font-semibold text-green-800">Session Created — #{sessionId}</p>
              <Link href={`/${locale}/simulate`} className="text-brand-500 hover:underline text-sm mt-2 inline-block">
                Run Brow Simulation →
              </Link>
            </div>
          ) : (
            <button
              onClick={handleCreate}
              disabled={status === "saving"}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-stone-300 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {status === "saving" ? "Creating..." : "Create Session"}
            </button>
          )}

          {status === "error" && (
            <p className="text-sm text-red-600 text-center">
              Failed to create session. Please{" "}
              <Link href={`/${locale}/auth/login`} className="underline">sign in</Link> and try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
