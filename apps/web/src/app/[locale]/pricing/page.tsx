"use client";

import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";

const PLANS = [
  {
    id: "free",
    name: "Free Listing",
    price: "$0",
    period: "forever",
    color: "border-stone-200",
    badge: null,
    features: [
      "Basic profile listing",
      "City & country display",
      "Phone & website link",
      "Instagram link",
      "Standard search placement",
    ],
    cta: "Get Started Free",
    ctaHref: "register",
    highlight: false,
  },
  {
    id: "paid_plan",
    name: "Featured Pro",
    price: "$29",
    period: "per month",
    color: "border-yellow-300",
    badge: "Most Popular",
    features: [
      "Everything in Free",
      "⭐ Featured badge",
      "Top of search results",
      "Map pin highlight",
      "Priority support",
      "Analytics dashboard (coming soon)",
    ],
    cta: "Upgrade to Featured",
    ctaHref: "checkout",
    highlight: true,
  },
];

export default function PricingPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [providerId, setProviderId] = useState("");

  const handleCheckout = async () => {
    if (!providerId.trim()) {
      setError("Please enter your Provider ID. Find it in the URL of your listing: /providers/[ID]");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post(`/api/subscriptions/create-checkout/${providerId.trim()}`);
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err: unknown) {
      const detail =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setError(detail ?? "Checkout unavailable. Ensure Stripe is configured and you own this listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white px-6 py-16 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-4 block">
          Plans & Pricing
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          Grow Your Studio
        </h1>
        <p className="text-stone-300 text-lg max-w-xl mx-auto">
          Start for free and upgrade when you are ready to reach more clients.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={
                "bg-white rounded-2xl shadow-sm border-2 p-8 flex flex-col relative " +
                plan.color +
                (plan.highlight ? " ring-2 ring-yellow-200" : "")
              }
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-400 text-stone-900 text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-stone-900 mb-1">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-stone-900">{plan.price}</span>
                  <span className="text-stone-400 text-sm">/ {plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.ctaHref === "checkout" ? (
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold rounded-xl transition-colors disabled:opacity-60"
                >
                  {loading ? "Redirecting..." : plan.cta}
                </button>
              ) : (
                <Link
                  href={`/${locale}/auth/register`}
                  className="block text-center py-3 px-6 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold rounded-xl transition-colors"
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        <div className="mt-12 bg-stone-100 rounded-2xl p-6 text-center text-sm text-stone-600">
          <p className="font-semibold text-stone-900 mb-1">Secure Payments via Stripe</p>
          <p>Cancel anytime. No contracts. Billed monthly.</p>
          <p className="mt-3 text-xs text-stone-400">
            Questions? Contact us at{" "}
            <a href="mailto:support@seouup.dev" className="underline hover:text-stone-600">
              support@seouup.dev
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
