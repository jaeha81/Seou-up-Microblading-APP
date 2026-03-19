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
  { id: 1,  slug: "natural-feather",    name_en: "Natural Feather",   name_ko: "내추럴 페더" },
  { id: 2,  slug: "ombre-powder",       name_en: "Ombre Powder",      name_ko: "옴브레 파우더" },
  { id: 3,  slug: "combination-brow",   name_en: "Combination Brow",  name_ko: "콤비네이션 브로우" },
  { id: 4,  slug: "bold-arch",          name_en: "Bold Arch",         name_ko: "볼드 아치" },
  { id: 5,  slug: "straight-korean",    name_en: "Straight Korean",   name_ko: "스트레이트 한국형" },
  { id: 6,  slug: "micro-shading",      name_en: "Micro-shading",     name_ko: "마이크로 쉐이딩" },
  { id: 7,  slug: "3d-hair-stroke",     name_en: "3D Hair Stroke",    name_ko: "3D 헤어 스트로크" },
  { id: 8,  slug: "soft-classic",       name_en: "Soft Classic",      name_ko: "소프트 클래식" },
  { id: 9,  slug: "nano-brow",          name_en: "Nano Brow",         name_ko: "나노 브로우" },
  { id: 10, slug: "fluffy-brow",        name_en: "Fluffy Brow",       name_ko: "플러피 브로우" },
  { id: 11, slug: "angular-power-brow", name_en: "Angular Power",     name_ko: "앵귤러 파워 브로우" },
  { id: 12, slug: "feather-touch",      name_en: "Feather Touch",     name_ko: "페더 터치" },
];

const STYLE_META: Record<string, { emoji: string; desc: string }> = {
  "natural-feather":    { emoji: "🪶", desc: "Soft, hair-like strokes" },
  "ombre-powder":       { emoji: "🌅", desc: "Gradient powder fill" },
  "combination-brow":   { emoji: "✨", desc: "Strokes + powder blend" },
  "bold-arch":          { emoji: "🔥", desc: "Dramatic, defined arch" },
  "straight-korean":    { emoji: "🇰🇷", desc: "Flat, youthful shape" },
  "micro-shading":      { emoji: "🎨", desc: "Fine-dot shading" },
  "3d-hair-stroke":     { emoji: "💎", desc: "Hyper-realistic depth" },
  "soft-classic":       { emoji: "🌸", desc: "Timeless soft lines" },
  "nano-brow":          { emoji: "🔬", desc: "Ultra-fine precision" },
  "fluffy-brow":        { emoji: "☁️", desc: "Full, textured look" },
  "angular-power-brow": { emoji: "⚡", desc: "Strong geometric arch" },
  "feather-touch":      { emoji: "🕊️", desc: "Light, wispy strokes" },
};

type SimStatus = "idle" | "selecting" | "processing" | "done" | "error";

const STEPS = [
  { n: 1, label: "Choose Style" },
  { n: 2, label: "Upload Photo" },
  { n: 3, label: "Preview Result" },
];

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
    api.get("/api/eyebrow-styles")
      .then(({ data }) => { if (Array.isArray(data) && data.length > 0) setStyles(data); })
      .catch(() => {});
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

  const handleReset = () => {
    setSelectedStyle(null);
    setPreview(null);
    setResult(null);
    setStatus("idle");
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const currentStep =
    status === "done" ? 3 :
    preview && selectedStyle ? 2 :
    selectedStyle ? 2 : 1;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page header + step indicator */}
      <div className="bg-white border-b border-stone-100 px-4 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 mb-1">Brow Simulator</h1>
              <p className="text-stone-500 text-sm">Preview 12 styles on your own photo — free &amp; instant</p>
            </div>
            {status !== "idle" && (
              <button
                onClick={handleReset}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors px-3 py-1.5 border border-stone-200 rounded-lg"
              >
                ↺ Reset
              </button>
            )}
          </div>

          {/* Step indicator */}
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <div key={step.n} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    status === "done" && step.n <= 3
                      ? "bg-green-500 text-white"
                      : currentStep > step.n
                      ? "bg-green-500 text-white"
                      : currentStep === step.n
                      ? "bg-brand-500 text-white ring-4 ring-brand-100"
                      : "bg-stone-200 text-stone-400"
                  }`}>
                    {(status === "done" || currentStep > step.n) ? "✓" : step.n}
                  </div>
                  <span className={`text-xs mt-1 font-medium whitespace-nowrap ${
                    currentStep >= step.n ? "text-stone-700" : "text-stone-400"
                  }`}>{step.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mb-5 transition-all ${
                    currentStep > step.n ? "bg-green-400" : "bg-stone-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-sm text-amber-800 flex items-start gap-2">
          <span className="shrink-0">⚠️</span>
          <span>
            <strong>Visualization Only</strong> — Results are for illustration only.
            Not a guarantee of procedure outcomes. Always consult a licensed professional.
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ── STYLE SELECTOR ── */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  selectedStyle ? "bg-green-500 text-white" : "bg-brand-500 text-white"
                }`}>
                  {selectedStyle ? "✓" : "1"}
                </div>
                <span className="font-semibold text-stone-900 text-sm">Choose a Style</span>
              </div>
              {selectedStyle && (
                <span className="text-xs bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full font-medium">
                  {STYLE_META[selectedStyle.slug]?.emoji} {getStyleName(selectedStyle)}
                </span>
              )}
            </div>

            <div className="p-4 grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s)}
                  className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                    selectedStyle?.id === s.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-stone-100 hover:border-stone-300 bg-stone-50"
                  }`}
                >
                  <div className="text-xl mb-1">{STYLE_META[s.slug]?.emoji ?? "✨"}</div>
                  <div className="text-xs font-medium text-stone-800 leading-tight">{getStyleName(s)}</div>
                  <div className="text-xs text-stone-400 mt-0.5 leading-tight">
                    {STYLE_META[s.slug]?.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── UPLOAD + RUN ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    preview ? "bg-green-500 text-white" : "bg-stone-300 text-white"
                  }`}>
                    {preview ? "✓" : "2"}
                  </div>
                  <span className="font-semibold text-stone-900 text-sm">Upload Your Photo</span>
                </div>
                <span className="text-xs text-stone-400">9:16 portrait</span>
              </div>

              <div className="p-4">
                <div
                  className="relative w-full cursor-pointer mb-3"
                  style={{ paddingBottom: "177.78%" }}
                  onClick={() => fileRef.current?.click()}
                >
                  <div className={`absolute inset-0 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center transition-colors ${
                    preview ? "border-brand-300" : "border-stone-200 hover:border-brand-300"
                  }`}>
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-stone-400 px-4">
                        <div className="text-4xl mb-2">📷</div>
                        <div className="text-sm font-medium">Click to upload</div>
                        <div className="text-xs mt-1 text-stone-300">Front-facing portrait works best</div>
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
                {preview && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full text-xs text-stone-400 hover:text-stone-600 transition-colors py-1"
                  >
                    Click to change photo
                  </button>
                )}
              </div>
            </div>

            {/* Run button */}
            <button
              onClick={handleSimulate}
              disabled={!selectedStyle || !preview || status === "processing"}
              className={`w-full font-semibold py-4 rounded-2xl transition-all text-sm ${
                !selectedStyle || !preview
                  ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                  : status === "processing"
                  ? "bg-brand-300 text-white cursor-wait"
                  : "bg-brand-500 hover:bg-brand-600 text-white shadow-md hover:-translate-y-0.5"
              }`}
            >
              {status === "processing" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  Simulating...
                </span>
              ) : !selectedStyle ? (
                "← Select a style first"
              ) : !preview ? (
                "← Upload your photo"
              ) : (
                "✨ Run Simulation"
              )}
            </button>

            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {error}{" "}
                <Link href={`/${locale}/auth/login`} className="underline font-medium">
                  Sign in
                </Link>{" "}
                if not logged in.
              </div>
            )}
          </div>
        </div>

        {/* ── RESULT: Before / After ── */}
        {status === "done" && result && (
          <div className="mt-6 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                <span className="font-semibold text-stone-900 text-sm">
                  Simulation Complete —{" "}
                  <span className="text-brand-600">
                    {STYLE_META[selectedStyle?.slug ?? ""]?.emoji} {selectedStyle && getStyleName(selectedStyle)}
                  </span>
                </span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-brand-500 hover:text-brand-600 font-medium"
              >
                Try another →
              </button>
            </div>

            <div className="p-4">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest mb-2 text-center">Before</p>
                  <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                    <div className="absolute inset-0 bg-stone-100 rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview!} alt="before" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-brand-500 font-semibold uppercase tracking-widest mb-2 text-center">After</p>
                  <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                    <div className="absolute inset-0 bg-stone-100 rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result}
                        alt="result"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = preview ?? "";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-stone-400 text-center">
                Mock simulation · Visualization only · Not a procedure guarantee
              </p>
            </div>
          </div>
        )}

        {/* Tips (idle state only) */}
        {status === "idle" && (
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { icon: "💡", tip: "Use a front-facing photo with good lighting for best results" },
              { icon: "📐", tip: "Portrait orientation (9:16) works best for accurate simulation" },
              { icon: "🔒", tip: "Your photos are private and automatically deleted after 30 days" },
            ].map((t) => (
              <div key={t.tip} className="bg-white rounded-xl p-4 border border-stone-100 flex items-start gap-3">
                <span className="text-lg shrink-0">{t.icon}</span>
                <p className="text-xs text-stone-500 leading-relaxed">{t.tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
