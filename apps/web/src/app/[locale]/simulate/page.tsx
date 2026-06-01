"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
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

const STYLE_META: Record<string, { desc: string }> = {
  "natural-feather":    { desc: "Soft, hair-like strokes" },
  "ombre-powder":       { desc: "Gradient powder fill" },
  "combination-brow":   { desc: "Strokes + powder blend" },
  "bold-arch":          { desc: "Dramatic, defined arch" },
  "straight-korean":    { desc: "Flat, youthful shape" },
  "micro-shading":      { desc: "Fine-dot shading" },
  "3d-hair-stroke":     { desc: "Hyper-realistic depth" },
  "soft-classic":       { desc: "Timeless soft lines" },
  "nano-brow":          { desc: "Ultra-fine precision" },
  "fluffy-brow":        { desc: "Full, textured look" },
  "angular-power-brow": { desc: "Strong geometric arch" },
  "feather-touch":      { desc: "Light, wispy strokes" },
};

type SimStatus = "idle" | "selecting" | "processing" | "done" | "error";
type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function SimulatePage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("simulate");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const STEPS = [
    { n: 1, label: t("step_choose_style") },
    { n: 2, label: t("step_upload_photo") },
    { n: 3, label: t("step_preview_result") },
  ];

  const [styles, setStyles] = useState<EyebrowStyle[]>(FALLBACK_STYLES);
  const [selectedStyle, setSelectedStyle] = useState<EyebrowStyle | null>(null);
  const [status, setStatus] = useState<SimStatus>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [simulationId, setSimulationId] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveNote, setSaveNote] = useState("");
  const [clientName, setClientName] = useState("");
  const [showCrmPanel, setShowCrmPanel] = useState(false);
  const [agreeConsent, setAgreeConsent] = useState(false);
  const [showUploadSheet, setShowUploadSheet] = useState(false);

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

  // Localized one-line description per style slug, with English fallback.
  const getStyleDesc = (style: EyebrowStyle) => {
    const key = `styles.${style.slug}`;
    if (t.has(key)) return t(key);
    return STYLE_META[style.slug]?.desc ?? "";
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
      setSimulationId(sim.id);
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
      setError(t("error_sign_in"));
      setStatus("error");
    }
  };

  const handleSaveToCrm = async () => {
    if (!simulationId) return;
    setSaveStatus("saving");
    try {
      const note = [clientName && `Client: ${clientName}`, saveNote].filter(Boolean).join("\n");
      if (note) {
        await api.patch(`/api/simulations/${simulationId}/note`, { session_note: note });
      }
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  };

  const handleReset = () => {
    setSelectedStyle(null);
    setPreview(null);
    setResult(null);
    setStatus("idle");
    setError(null);
    setSimulationId(null);
    setSaveStatus("idle");
    setSaveNote("");
    setClientName("");
    setShowCrmPanel(false);
    setAgreeConsent(false);
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
              <h1 className="text-2xl font-bold text-stone-900 mb-1">{t("title")}</h1>
              <p className="text-stone-500 text-sm">{t("subtitle_full")}</p>
            </div>
            {status !== "idle" && (
              <button
                onClick={handleReset}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors px-3 py-1.5 border border-stone-200 rounded-lg"
              >
                ↺ {t("reset")}
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
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>
          <span>
            <strong>{t("disclaimer").split("—")[0].trim()}</strong> — {t("viz_only_full")}
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
                <span className="font-semibold text-stone-900 text-sm">{t("choose_a_style")}</span>
              </div>
              {selectedStyle && (
                <span className="text-xs bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full font-medium">
                  {getStyleName(selectedStyle)}
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
                  <div className="text-xs font-semibold text-stone-800 leading-tight mb-0.5">{getStyleName(s)}</div>
                  <div className="text-xs text-stone-400 mt-0.5 leading-tight">
                    {getStyleDesc(s)}
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
                  <span className="font-semibold text-stone-900 text-sm">{t("upload_your_photo")}</span>
                </div>
                <span className="text-xs text-stone-400">{t("portrait_hint")}</span>
              </div>

              <div className="p-4">
                {/* Consent checkbox */}
                <label className="flex items-start gap-2.5 mb-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreeConsent}
                    onChange={(e) => setAgreeConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-stone-300 text-brand-500 focus:ring-brand-400 shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-stone-600 leading-relaxed group-hover:text-stone-800 transition-colors">
                    {t("consent_label")}
                  </span>
                </label>

                <div
                  className={`relative w-full mb-3 ${agreeConsent ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                  style={{ paddingBottom: "177.78%" }}
                  onClick={() => agreeConsent && setShowUploadSheet(true)}
                >
                  <div className={`absolute inset-0 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center transition-colors ${
                    preview ? "border-brand-300" : "border-stone-200 hover:border-brand-300"
                  }`}>
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-stone-400 px-4">
                        <svg className="w-10 h-10 mx-auto mb-2 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>
                        <div className="text-sm font-medium">{t("click_to_upload")}</div>
                        <div className="text-xs mt-1 text-stone-300">{t("portrait_tip")}</div>
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
                <input
                  ref={cameraRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {/* Camera / Gallery buttons */}
                {!preview && (
                  <button
                    onClick={() => agreeConsent && setShowUploadSheet(true)}
                    disabled={!agreeConsent}
                    className="w-full flex items-center justify-center gap-2 text-xs font-medium text-stone-600 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl py-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" /></svg>
                    {t("click_to_upload")}
                  </button>
                )}
                {preview && (
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => agreeConsent && setShowUploadSheet(true)}
                      disabled={!agreeConsent}
                      className="flex-1 text-xs text-stone-400 hover:text-stone-600 transition-colors py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      📷 {t("retake")}
                    </button>
                    <button
                      onClick={() => agreeConsent && setShowUploadSheet(true)}
                      disabled={!agreeConsent}
                      className="flex-1 text-xs text-stone-400 hover:text-stone-600 transition-colors py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      🖼 {t("change_photo")}
                    </button>
                  </div>
                )}

                {/* Upload action sheet */}
                {showUploadSheet && (
                  <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
                    onClick={() => setShowUploadSheet(false)}
                  >
                    <div
                      className="w-full max-w-sm bg-white rounded-t-2xl pb-8 pt-3 px-4 safe-area-bottom"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-5" />
                      <button
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-stone-50 active:bg-stone-100 transition-colors text-left"
                        onClick={() => { setShowUploadSheet(false); setTimeout(() => cameraRef.current?.click(), 50); }}
                      >
                        <span className="text-2xl">📷</span>
                        <span className="text-sm font-medium text-stone-800">{t("take_photo")}</span>
                      </button>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-stone-50 active:bg-stone-100 transition-colors text-left"
                        onClick={() => { setShowUploadSheet(false); setTimeout(() => fileRef.current?.click(), 50); }}
                      >
                        <span className="text-2xl">🖼️</span>
                        <span className="text-sm font-medium text-stone-800">{t("choose_from_gallery")}</span>
                      </button>
                      <button
                        className="w-full mt-2 py-3 text-sm text-stone-400 hover:text-stone-600 transition-colors"
                        onClick={() => setShowUploadSheet(false)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Run button */}
            <button
              onClick={handleSimulate}
              disabled={!selectedStyle || !preview || !agreeConsent || status === "processing"}
              className={`w-full font-semibold py-4 rounded-2xl transition-all text-sm ${
                !selectedStyle || !preview || !agreeConsent
                  ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                  : status === "processing"
                  ? "bg-brand-300 text-white cursor-wait"
                  : "bg-brand-500 hover:bg-brand-600 text-white shadow-md hover:-translate-y-0.5"
              }`}
            >
              {status === "processing" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  {t("running")}
                </span>
              ) : !selectedStyle ? (
                `← ${t("select_style_first")}`
              ) : !preview ? (
                `← ${t("upload_photo_first")}`
              ) : !agreeConsent ? (
                `← ${t("agree_first")}`
              ) : (
                `${t("run_simulation")} →`
              )}
            </button>

            {status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {t("failed_to_save")}{" "}
                <Link href={`/${locale}/auth/login`} className="underline font-medium">
                  {tAuth("sign_in_link")}
                </Link>
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
                  {t("simulation_complete")} —{" "}
                  <span className="text-brand-600">
                    {selectedStyle && getStyleName(selectedStyle)}
                  </span>
                </span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-brand-500 hover:text-brand-600 font-medium"
              >
                {t("try_another")} →
              </button>
            </div>

            <div className="p-4">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest mb-2 text-center">{t("before")}</p>
                  <div className="relative w-full" style={{ paddingBottom: "177.78%" }}>
                    <div className="absolute inset-0 bg-stone-100 rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview!} alt="before" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-brand-500 font-semibold uppercase tracking-widest mb-2 text-center">{t("after")}</p>
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
              <p className="text-xs text-stone-400 text-center mb-5">{t("mock_note")}</p>

              {/* ── CRM Save Panel ── */}
              <div className="border-t border-stone-100 pt-5">
                {!showCrmPanel ? (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setShowCrmPanel(true)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3 rounded-2xl transition-all shadow-md hover:-translate-y-0.5 text-sm"
                    >
                      💾 {t("save_to_crm")}
                    </button>
                    <Link
                      href={`/${locale}/clinic`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 border border-stone-200 hover:border-stone-300 text-stone-700 font-semibold px-6 py-3 rounded-2xl transition-all text-sm"
                    >
                      {t("open_clinic")} →
                    </Link>
                  </div>
                ) : saveStatus === "saved" ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <p className="font-bold text-green-800 text-sm">
                      {t("saved_to_crm_title")}{clientName ? ` — ${clientName}` : ""}
                    </p>
                    <p className="text-green-600 text-xs mt-1 mb-3">
                      {t("sim_linked")}
                    </p>
                    <Link
                      href={`/${locale}/clinic`}
                      className="text-xs text-brand-500 hover:text-brand-600 font-semibold underline"
                    >
                      {t("view_in_clinic")} →
                    </Link>
                  </div>
                ) : (
                  <div className="bg-stone-50 border border-stone-100 rounded-2xl p-5">
                    <h3 className="font-semibold text-stone-900 text-sm mb-3 flex items-center gap-2">
                      <span>💾</span> {t("save_to_crm")}
                    </h3>
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{t("client_name_label")}</label>
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder={t("client_name_placeholder")}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">{t("notes_label")}</label>
                        <textarea
                          value={saveNote}
                          onChange={(e) => setSaveNote(e.target.value)}
                          placeholder={t("notes_placeholder")}
                          rows={3}
                          className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent resize-none bg-white"
                        />
                      </div>
                    </div>
                    {saveStatus === "error" && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 mb-3">
                        {t("failed_to_save")}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCrmPanel(false)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium rounded-xl text-sm transition-colors"
                      >
                        {tCommon("cancel")}
                      </button>
                      <button
                        onClick={handleSaveToCrm}
                        disabled={saveStatus === "saving"}
                        className="flex-1 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm hover:-translate-y-0.5"
                      >
                        {saveStatus === "saving" ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            {t("saving")}
                          </span>
                        ) : t("save_button")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tips (idle state only) */}
        {status === "idle" && (
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { icon: "💡", tip: t("tip1") },
              { icon: "📐", tip: t("tip2") },
              { icon: "🔒", tip: t("tip3") },
            ].map((tip) => (
              <div key={tip.tip} className="bg-white rounded-xl p-4 border border-stone-100 flex items-start gap-3">
                <span className="text-lg shrink-0">{tip.icon}</span>
                <p className="text-xs text-stone-500 leading-relaxed">{tip.tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
