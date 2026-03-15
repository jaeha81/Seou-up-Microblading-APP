"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";

const STYLES = [
  { id: 1, slug: "natural-feather", name: "Natural Feather", emoji: "🪶" },
  { id: 2, slug: "ombre-powder", name: "Ombre Powder", emoji: "🌅" },
  { id: 3, slug: "combination-brow", name: "Combination Brow", emoji: "✨" },
  { id: 4, slug: "bold-arch", name: "Bold Arch", emoji: "🔥" },
  { id: 5, slug: "straight-korean", name: "Straight Korean", emoji: "🇰🇷" },
  { id: 6, slug: "micro-shading", name: "Micro-shading", emoji: "🎨" },
  { id: 7, slug: "3d-hair-stroke", name: "3D Hair Stroke", emoji: "💎" },
  { id: 8, slug: "soft-classic", name: "Soft Classic", emoji: "🌸" },
  { id: 9, slug: "nano-brow", name: "Nano Brow", emoji: "🔬" },
  { id: 10, slug: "fluffy-brow", name: "Fluffy Brow", emoji: "☁️" },
  { id: 11, slug: "angular-power-brow", name: "Angular Power", emoji: "⚡" },
  { id: 12, slug: "feather-touch", name: "Feather Touch", emoji: "🕊️" },
];

type SimStatus = "idle" | "selecting" | "uploading" | "processing" | "done" | "error";

export default function SimulatePage() {
  const params = useParams();
  const locale = params.locale as string;
  const fileRef = useRef<HTMLInputElement>(null);

  const [selectedStyle, setSelectedStyle] = useState<(typeof STYLES)[0] | null>(null);
  const [status, setStatus] = useState<SimStatus>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStatus("selecting");
  };

  const handleSimulate = async () => {
    if (!selectedStyle || !fileRef.current?.files?.[0]) return;
    setStatus("processing");
    setError(null);
    try {
      // Create simulation
      const { data: sim } = await api.post("/api/simulations", {
        eyebrow_style_id: selectedStyle.id,
      });
      // Upload image
      const formData = new FormData();
      formData.append("file", fileRef.current.files[0]);
      const { data: processed } = await api.post(
        `/api/simulations/${sim.id}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(processed.output_image_url || preview);
      setStatus("done");
    } catch {
      setError("Simulation failed. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          ⚠️ <strong>Visualization Only</strong> — This simulation is for informational and
          visualization purposes only. Results are not a guarantee of actual procedure outcomes.
          Always consult a licensed microblading professional.
        </div>

        <h1 className="text-3xl font-bold text-stone-900 mb-2">Brow Simulator</h1>
        <p className="text-stone-600 mb-8">Choose a style, upload your photo, and preview your new brows.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Style Selector */}
          <div>
            <h2 className="font-semibold text-stone-800 mb-4">1. Choose a Style</h2>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s)}
                  className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                    selectedStyle?.id === s.id
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-stone-200 hover:border-stone-300 text-stone-700"
                  }`}
                >
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="text-xs font-medium leading-tight">{s.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Upload & Result */}
          <div>
            <h2 className="font-semibold text-stone-800 mb-4">2. Upload Your Photo</h2>
            <div
              className="border-2 border-dashed border-stone-300 rounded-xl h-48 flex items-center justify-center cursor-pointer hover:border-brand-400 transition-colors mb-4 overflow-hidden"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center text-stone-400">
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-sm">Click to upload front-facing photo</div>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={handleSimulate}
              disabled={!selectedStyle || !preview || status === "processing"}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-stone-300 text-white font-semibold py-3 rounded-xl transition-colors mb-4"
            >
              {status === "processing" ? "⏳ Simulating..." : "✨ Run Simulation"}
            </button>

            {status === "done" && result && (
              <div className="rounded-xl overflow-hidden border border-stone-200">
                <div className="bg-green-50 px-4 py-2 text-sm text-green-700 font-medium">
                  ✓ Simulation complete — {selectedStyle?.name}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result} alt="result" className="w-full" onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }} />
                <div className="p-3 text-xs text-stone-500">
                  Mock simulation result. For visualization purposes only.
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error} <Link href={`/${locale}/auth/login`} className="underline">Sign in</Link> if not logged in.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
