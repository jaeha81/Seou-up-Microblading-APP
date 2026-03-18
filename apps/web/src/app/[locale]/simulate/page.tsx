"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";

interface EyebrowStyle {
  id: number;
  slug: string;
  name_en: string;
  name_ko?: string | null;
  name_th?: string | null;
  name_vi?: string | null;
}

const FALLBACK_STYLES: EyebrowStyle[] = [
  { id: 1, slug: "natural-feather", name_en: "Natural Feather", name_ko: "내추럴 페더" },
  { id: 2, slug: "ombre-powder", name_en: "Ombre Powder", name_ko: "옴브레 파우더" },
  { id: 3, slug: "combination-brow", name_en: "Combination Brow", name_ko: "콤비네이션 브로우" },
  { id: 4, slug: "bold-arch", name_en: "Bold Arch", name_ko: "볼드 아치" },
  { id: 5, slug: "straight-korean", name_en: "Straight Korean", name_ko: "스트레이트 한국형" },
  { id: 6, slug: "micro-shading", name_en: "Micro-shading", name_ko: "마이크로 쉐이딩" },
  { id: 7, slug: "3d-hair-stroke", name_en: "3D Hair Stroke", name_ko: "3D 헤어 스트로크" },
  { id: 8, slug: "soft-classic", name_en: "Soft Classic", name_ko: "소프트 클래식" },
  { id: 9, slug: "nano-brow", name_en: "Nano Brow", name_ko: "나노 브로우" },
  { id: 10, slug: "fluffy-brow", name_en: "Fluffy Brow", name_ko: "플러피 브로우" },
  { id: 11, slug: "angular-power-brow", name_en: "Angular Power", name_ko: "앵귤러 파워 브로우" },
  { id: 12, slug: "feather-touch", name_en: "Feather Touch", name_ko: "페더 터치" },
];

const STYLE_EMOJIS: Record<string, string> = {
  "natural-feather": "🪶",
  "ombre-powder": "🌅",
  "combination-brow": "✨",
  "bold-arch": "🔥",
  "straight-korean": "🇰🇷",
  "micro-shading": "🎨",
  "3d-hair-stroke": "💎",
  "soft-classic": "🌸",
  "nano-brow": "🔬",
  "fluffy-brow": "☁️",
  "angular-power-brow": "⚡",
  "feather-touch": "🕊️",
};

type SimStatus = "idle" | "selecting" | "uploading" | "processing" | "done" | "error";

export default function SimulatePage() {
  const params = useParams();
  const locale = params.locale as string;
  const fileRef = useRef<HTMLInputElement>(null);

  const [styles, setStyles] = useState<EyebrowStyle[]>(FALLBACK_STYLES);
  const [selectedStyle, setSelectedStyle] = useState<EyebrowStyle | null>(null);
  const [status, setStatus] = useState<SimStatus>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/api/eyebrow-styles").then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) setStyles(data);
    }).catch(() => {});
  }, []);

  const getStyleName = (style: EyebrowStyle) => {
    if (locale === "ko" && style.name_ko) return style.name_ko;
    if (locale === "th" && style.name_th) return style.name_th;
    if (locale === "vi" && style.name_vi) return style.name_vi;
    return style.name_en;
  };

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
      const { data: sim } = await api.post("/api/simulations", {
        eyebrow_style_id: selectedStyle.id,
      });
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
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          ⚠️ <strong>Visualization Only</strong> — This simulation is for informational and
          visualization purposes only. Results are not a guarantee of actual procedure outcomes.
          Always consult a licensed microblading professional.
        </div>

        <h1 className="text-3xl font-bold text-stone-900 mb-2">Brow Simulator</h1>
        <p className="text-stone-600 mb-8">Choose a style, upload your photo, and preview your new brows.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold text-stone-800 mb-4">1. Choose a Style</h2>
            <div className="grid grid-cols-3 gap-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s)}
                  className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                    selectedStyle?.id === s.id
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-stone-200 hover:border-stone-300 text-stone-700"
                  }`}
                >
                  <div className="text-2xl mb-1">{STYLE_EMOJIS[s.slug] ?? "✨"}</div>
                  <div className="text-xs font-medium leading-tight">{getStyleName(s)}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-stone-800 mb-4">2. Upload Your Photo</h2>
            {/* 9:16 portrait ratio container */}
            <div
              className="relative w-full cursor-pointer mb-4"
              style={{ paddingBottom: "177.78%" }}
              onClick={() => fileRef.current?.click()}
            >
              <div className="absolute inset-0 border-2 border-dashed border-stone-300 rounded-xl overflow-hidden hover:border-brand-400 transition-colors flex items-center justify-center">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-stone-400">
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-sm">Click to upload front-facing photo</div>
                    <div className="text-xs mt-1 text-stone-300">Portrait (9:16)</div>
                  </div>
                )}
              </div>
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
                  ✓ Simulation complete — {selectedStyle && getStyleName(selectedStyle)}
                </div>
                {/* 9:16 portrait result container */}
                <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                  <div className="absolute inset-0 bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result}
                      alt="result"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
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
