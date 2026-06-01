"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import api from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

type BillingCycle = "monthly" | "annual";

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number | null;
  annualMonthlyPrice: number | null;
  borderClass: string;
  ringClass: string;
  badge: string | null;
  badgeClass: string;
  features: string[];
  cta: string;
  ctaClass: string;
  ctaAction: "register" | "checkout" | "contact";
  highlight: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BillingToggle({
  billing,
  onChange,
}: {
  billing: BillingCycle;
  onChange: (b: BillingCycle) => void;
}) {
  const t = useTranslations("pricing");
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onChange("monthly")}
        className={`text-sm font-semibold transition-colors ${
          billing === "monthly" ? "text-white" : "text-stone-400 hover:text-stone-200"
        }`}
      >
        {t("billing_monthly")}
      </button>
      <button
        onClick={() => onChange(billing === "monthly" ? "annual" : "monthly")}
        aria-label="Toggle billing cycle"
        className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-stone-900 ${
          billing === "annual" ? "bg-brand-500" : "bg-stone-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            billing === "annual" ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
      <button
        onClick={() => onChange("annual")}
        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
          billing === "annual" ? "text-white" : "text-stone-400 hover:text-stone-200"
        }`}
      >
        {t("billing_annual")}
        <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {t("billing_save")}
        </span>
      </button>
    </div>
  );
}

function PriceDisplay({
  plan,
  billing,
}: {
  plan: Plan;
  billing: BillingCycle;
}) {
  const t = useTranslations("pricing");
  if (plan.monthlyPrice === 0) {
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-stone-900">$0</span>
        <span className="text-stone-400 text-sm">/ {t("forever")}</span>
      </div>
    );
  }

  const displayPrice =
    billing === "annual" ? plan.annualMonthlyPrice : plan.monthlyPrice;

  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-stone-900">${displayPrice}</span>
        <span className="text-stone-400 text-sm">/ {t("per_mo")}</span>
      </div>
      {billing === "annual" && (
        <p className="text-xs text-stone-400 mt-0.5">{t("billed_annually")}</p>
      )}
    </div>
  );
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="space-y-3 mb-8 flex-1">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
          <span className="text-green-500 mt-0.5 shrink-0 font-bold">✓</span>
          {f}
        </li>
      ))}
    </ul>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center py-4 text-left text-stone-900 font-semibold text-sm hover:text-brand-500 transition-colors"
      >
        {q}
        <span
          className={`text-stone-400 transition-transform text-lg leading-none ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && <p className="pb-4 text-sm text-stone-600">{a}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const t = useTranslations("pricing");
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [providerId, setProviderId] = useState("");
  const [clinicCheckoutLoading, setClinicCheckoutLoading] = useState<string | null>(null);
  const [clinicError, setClinicError] = useState("");

  // ─── Plan Definitions ──────────────────────────────────────────────────────
  const PLANS: Plan[] = [
    {
      id: "free",
      name: t("plan_free_name"),
      monthlyPrice: 0,
      annualMonthlyPrice: 0,
      borderClass: "border-stone-200",
      ringClass: "",
      badge: null,
      badgeClass: "",
      features: [
        t("plan_free_f1"),
        t("plan_free_f2"),
        t("plan_free_f3"),
        t("plan_free_f4"),
        t("plan_free_f5"),
      ],
      cta: t("plan_free_cta"),
      ctaClass:
        "w-full py-3 px-6 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold rounded-xl transition-colors",
      ctaAction: "register",
      highlight: false,
    },
    {
      id: "paid_plan",
      name: t("plan_pro_name"),
      monthlyPrice: 29,
      annualMonthlyPrice: 23,
      borderClass: "border-brand-500",
      ringClass: "ring-2 ring-brand-100",
      badge: t("plan_pro_badge"),
      badgeClass: "bg-yellow-400 text-stone-900",
      features: [
        t("plan_pro_f1"),
        t("plan_pro_f2"),
        t("plan_pro_f3"),
        t("plan_pro_f4"),
        t("plan_pro_f5"),
        t("plan_pro_f6"),
        t("plan_pro_f7"),
        t("plan_pro_f8"),
      ],
      cta: t("plan_pro_cta"),
      ctaClass:
        "w-full py-3 px-6 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors disabled:opacity-60",
      ctaAction: "checkout",
      highlight: true,
    },
    {
      id: "agency",
      name: t("plan_agency_name"),
      monthlyPrice: 79,
      annualMonthlyPrice: 63,
      borderClass: "border-stone-300",
      ringClass: "",
      badge: null,
      badgeClass: "",
      features: [
        t("plan_agency_f1"),
        t("plan_agency_f2"),
        t("plan_agency_f3"),
        t("plan_agency_f4"),
        t("plan_agency_f5"),
        t("plan_agency_f6"),
        t("plan_agency_f7"),
      ],
      cta: t("plan_agency_cta"),
      ctaClass:
        "w-full py-3 px-6 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-colors",
      ctaAction: "contact",
      highlight: false,
    },
  ];

  // ─── Clinic B2B Plans ────────────────────────────────────────────────────────
  const CLINIC_PLANS = [
    {
      id: "basic",
      name: t("clinic_basic_name"),
      price: "$49",
      borderClass: "border-blue-200",
      ringClass: "",
      badge: null,
      features: [
        t("clinic_basic_f1"),
        t("clinic_basic_f2"),
        t("clinic_basic_f3"),
        t("clinic_basic_f4"),
        t("clinic_basic_f5"),
      ],
    },
    {
      id: "pro",
      name: t("clinic_pro_name"),
      price: "$99",
      borderClass: "border-purple-300",
      ringClass: "ring-2 ring-purple-100",
      badge: t("clinic_pro_badge"),
      features: [
        t("clinic_pro_f1"),
        t("clinic_pro_f2"),
        t("clinic_pro_f3"),
        t("clinic_pro_f4"),
        t("clinic_pro_f5"),
        t("clinic_pro_f6"),
        t("clinic_pro_f7"),
      ],
    },
  ];

  // ─── FAQ ─────────────────────────────────────────────────────────────────────
  const FAQS = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
  ];

  const handleClinicCheckout = async (plan: string) => {
    setClinicCheckoutLoading(plan);
    setClinicError("");
    try {
      const { data: mine } = await api.get("/api/clinics/mine");
      if (!mine.clinic) {
        window.location.href = `/${locale}/clinic`;
        return;
      }
      const { data } = await api.post(
        `/api/clinics/${mine.clinic.id}/checkout?plan=${plan}`
      );
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch (err: unknown) {
      const detail =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setClinicError(detail ?? t("err_clinic"));
    } finally {
      setClinicCheckoutLoading(null);
    }
  };

  const handleCheckout = async () => {
    if (!providerId.trim()) {
      setError(t("err_provider_id"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post(
        `/api/subscriptions/create-checkout/${providerId.trim()}`
      );
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err: unknown) {
      const detail =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data
              ?.detail
          : undefined;
      setError(detail ?? t("err_checkout"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white px-6 py-20 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-4 block">
          {t("hero_label")}
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          {t("hero_title")}
        </h1>
        <p className="text-stone-300 text-lg max-w-xl mx-auto">
          {t("hero_subtitle")}
        </p>

        <BillingToggle billing={billing} onChange={setBilling} />
      </div>

      {/* ── Cards ── */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={[
                "bg-white rounded-2xl shadow-sm border-2 p-8 flex flex-col relative",
                plan.borderClass,
                plan.ringClass,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span
                    className={`${plan.badgeClass} text-xs font-bold px-4 py-1.5 rounded-full shadow`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-stone-900 mb-1">{plan.name}</h2>
                <PriceDisplay plan={plan} billing={billing} />
              </div>

              {/* Features */}
              <FeatureList features={plan.features} />

              {/* CTA */}
              {plan.ctaAction === "checkout" ? (
                <>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className={plan.ctaClass}
                  >
                    {loading ? t("redirecting") : plan.cta}
                  </button>
                  <input
                    type="text"
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    placeholder={t("plan_pro_id_placeholder")}
                    className="mt-3 w-full px-3 py-2 text-xs border border-stone-200 rounded-lg text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <p className="mt-1.5 text-xs text-stone-400 text-center">
                    {t("plan_pro_id_hint")}
                  </p>
                </>
              ) : plan.ctaAction === "contact" ? (
                <a
                  href="mailto:sales@seouup.dev"
                  className={plan.ctaClass + " block text-center"}
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  href={`/${locale}/auth/register`}
                  className={plan.ctaClass + " block text-center"}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Trust bar */}
        <div className="mt-12 bg-stone-100 rounded-2xl p-6 text-center text-sm text-stone-600">
          <p className="font-semibold text-stone-900 mb-1">
            {t("trust_title")}
          </p>
          <p>{t("trust_line")}</p>
          <p className="mt-3 text-xs text-stone-400">
            {t("trust_questions")}{" "}
            <a
              href="mailto:support@seouup.dev"
              className="underline hover:text-stone-600"
            >
              support@seouup.dev
            </a>
          </p>
        </div>

        {/* ── B2B Clinic Plans ── */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-500 mb-3 block">
              {t("b2b_label")}
            </span>
            <h2 className="text-3xl font-bold text-stone-900 mb-3">
              {t("b2b_title")}
            </h2>
            <p className="text-stone-500 max-w-lg mx-auto">
              {t("b2b_desc")}{" "}
              <Link href={`/${locale}/clinic`} className="underline text-stone-700 font-medium">
                {t("b2b_open_dashboard")}
              </Link>
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {CLINIC_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={[
                  "bg-white rounded-2xl shadow-sm border-2 p-8 flex flex-col relative",
                  plan.borderClass,
                  plan.ringClass,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-purple-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-stone-900">{plan.price}</span>
                    <span className="text-stone-400 text-sm">/ {t("per_mo")}</span>
                  </div>
                </div>
                <FeatureList features={plan.features} />
                <button
                  onClick={() => handleClinicCheckout(plan.id)}
                  disabled={clinicCheckoutLoading === plan.id}
                  className={
                    "w-full py-3 px-6 font-bold rounded-xl transition-colors disabled:opacity-60 " +
                    (plan.ringClass
                      ? "bg-purple-500 hover:bg-purple-600 text-white"
                      : "bg-stone-900 hover:bg-stone-700 text-white")
                  }
                >
                  {clinicCheckoutLoading === plan.id
                    ? t("redirecting")
                    : t("clinic_start", { name: plan.name })}
                </button>
              </div>
            ))}
          </div>
          {clinicError && (
            <div className="mt-6 max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 text-center">
              {clinicError}{" "}
              <Link href={`/${locale}/clinic`} className="underline">
                {t("go_to_clinic")}
              </Link>
            </div>
          )}
        </div>

        {/* ── FAQ ── */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-8">
            {t("faq_title")}
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 px-6 py-2">
            {FAQS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
