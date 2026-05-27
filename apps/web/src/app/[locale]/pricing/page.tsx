"use client";

import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

type BillingCycle = "monthly" | "annual";

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number | null;
  annualMonthlyPrice: number | null;
  period: string;
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

// ─── Plan Definitions ────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualMonthlyPrice: 0,
    period: "forever",
    borderClass: "border-stone-200",
    ringClass: "",
    badge: null,
    badgeClass: "",
    features: [
      "Basic provider listing (city, country, phone, website)",
      "AI Brow Simulator access",
      "Standard search placement",
      "Up to 3 AI simulations/month",
      "Email support",
    ],
    cta: "Get Started Free",
    ctaClass:
      "w-full py-3 px-6 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold rounded-xl transition-colors",
    ctaAction: "register",
    highlight: false,
  },
  {
    id: "paid_plan",
    name: "Pro",
    monthlyPrice: 29,
    annualMonthlyPrice: 23,
    period: "per month",
    borderClass: "border-brand-500",
    ringClass: "ring-2 ring-brand-100",
    badge: "Most Popular",
    badgeClass: "bg-yellow-400 text-stone-900",
    features: [
      "Everything in Free",
      "Featured badge on profile",
      "Top of search results placement",
      "Unlimited consultations",
      "Client history & session notes (CRM)",
      "Analytics dashboard",
      "Map pin highlight",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    ctaClass:
      "w-full py-3 px-6 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors disabled:opacity-60",
    ctaAction: "checkout",
    highlight: true,
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 79,
    annualMonthlyPrice: 63,
    period: "per month",
    borderClass: "border-stone-300",
    ringClass: "",
    badge: null,
    badgeClass: "",
    features: [
      "Everything in Pro",
      "Up to 5 clinic locations",
      "Team member accounts (3 seats)",
      "White-label consultation reports",
      "Dedicated account manager",
      "Custom integrations (API access)",
      "SLA: 99.9% uptime guarantee",
    ],
    cta: "Contact Sales",
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
    name: "Basic Clinic",
    price: "$49",
    period: "per month",
    borderClass: "border-blue-200",
    ringClass: "",
    badge: null,
    features: [
      "Up to 3 staff members",
      "300 AI simulations / month",
      "Team dashboard",
      "Client & booking management",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro Clinic",
    price: "$99",
    period: "per month",
    borderClass: "border-purple-300",
    ringClass: "ring-2 ring-purple-100",
    badge: "Best for Studios",
    features: [
      "Unlimited staff members",
      "Unlimited AI simulations",
      "Everything in Basic",
      "Advanced analytics",
      "Priority support",
      "Custom branding (coming soon)",
      "API access (coming soon)",
    ],
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes, cancel any time. You keep access until the end of the billing period.",
  },
  {
    q: "Do I need a credit card for the free plan?",
    a: "No, the free plan never requires a card.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your clinic data is retained for 30 days after cancellation, then deleted.",
  },
  {
    q: "Is there a setup fee?",
    a: "No setup fees, ever.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function BillingToggle({
  billing,
  onChange,
}: {
  billing: BillingCycle;
  onChange: (b: BillingCycle) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onChange("monthly")}
        className={`text-sm font-semibold transition-colors ${
          billing === "monthly" ? "text-white" : "text-stone-400 hover:text-stone-200"
        }`}
      >
        Monthly
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
        Annual
        <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          Save 20%
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
  if (plan.monthlyPrice === 0) {
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-stone-900">$0</span>
        <span className="text-stone-400 text-sm">/ forever</span>
      </div>
    );
  }

  const displayPrice =
    billing === "annual" ? plan.annualMonthlyPrice : plan.monthlyPrice;

  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-stone-900">${displayPrice}</span>
        <span className="text-stone-400 text-sm">/ mo</span>
      </div>
      {billing === "annual" && (
        <p className="text-xs text-stone-400 mt-0.5">billed annually</p>
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
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [providerId, setProviderId] = useState("");
  const [clinicCheckoutLoading, setClinicCheckoutLoading] = useState<string | null>(null);
  const [clinicError, setClinicError] = useState("");

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
      setClinicError(detail ?? "Please register your clinic first or sign in.");
    } finally {
      setClinicCheckoutLoading(null);
    }
  };

  const handleCheckout = async () => {
    if (!providerId.trim()) {
      setError(
        "Please enter your Provider ID. Find it in the URL of your listing: /providers/[ID]"
      );
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
      setError(
        detail ??
          "Checkout unavailable. Ensure Stripe is configured and you own this listing."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white px-6 py-20 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-4 block">
          Plans &amp; Pricing
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          Grow Your Clinic
        </h1>
        <p className="text-stone-300 text-lg max-w-xl mx-auto">
          Start for free and upgrade when you are ready to reach more clients.
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
                    {loading ? "Redirecting…" : plan.cta}
                  </button>
                  <input
                    type="text"
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    placeholder="Your Provider ID"
                    className="mt-3 w-full px-3 py-2 text-xs border border-stone-200 rounded-lg text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <p className="mt-1.5 text-xs text-stone-400 text-center">
                    Find your ID in the URL: /providers/<em>[ID]</em>
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
            Secure Payments via Stripe
          </p>
          <p>Cancel anytime. No contracts. No setup fees.</p>
          <p className="mt-3 text-xs text-stone-400">
            Questions? Contact us at{" "}
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
              For Clinics & Studios
            </span>
            <h2 className="text-3xl font-bold text-stone-900 mb-3">
              B2B Clinic Plans
            </h2>
            <p className="text-stone-500 max-w-lg mx-auto">
              Manage your entire team, client base, and AI simulations under one subscription.{" "}
              <Link href={`/${locale}/clinic`} className="underline text-stone-700 font-medium">
                Open Clinic Dashboard →
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
                    <span className="text-stone-400 text-sm">/ {plan.period}</span>
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
                    ? "Redirecting…"
                    : `Start ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
          {clinicError && (
            <div className="mt-6 max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 text-center">
              {clinicError}{" "}
              <Link href={`/${locale}/clinic`} className="underline">
                Go to clinic dashboard
              </Link>
            </div>
          )}
        </div>

        {/* ── FAQ ── */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 text-center mb-8">
            Frequently Asked Questions
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
