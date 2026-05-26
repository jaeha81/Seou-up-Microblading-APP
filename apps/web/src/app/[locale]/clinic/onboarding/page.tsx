"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

interface ClinicForm {
  name: string;
  city: string;
  country: string;
  phone: string;
  website_url: string;
  description: string;
}

interface InviteEntry {
  email: string;
  role: "staff" | "manager";
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: "Clinic Setup",  icon: "🏥", desc: "Set up your clinic profile" },
  { n: 2, label: "Invite Team",   icon: "👥", desc: "Invite staff members (optional)" },
  { n: 3, label: "Choose Plan",   icon: "✨", desc: "Select a subscription tier" },
];

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    color: "border-stone-200",
    badge: null,
    badgeCls: "",
    features: ["3 AI simulations/month", "Basic clinic listing", "Community access"],
    ctaCls: "bg-stone-100 hover:bg-stone-200 text-stone-900",
    action: "free",
  },
  {
    id: "basic",
    name: "Basic Clinic",
    price: "$49",
    period: "/month",
    color: "border-blue-300",
    badge: null,
    badgeCls: "",
    features: ["Up to 3 staff", "300 simulations/month", "Team dashboard", "Client management"],
    ctaCls: "bg-blue-500 hover:bg-blue-600 text-white",
    action: "checkout",
  },
  {
    id: "pro",
    name: "Pro Clinic",
    price: "$99",
    period: "/month",
    color: "border-brand-400",
    badge: "Most Popular",
    badgeCls: "bg-brand-500 text-white",
    features: ["Unlimited staff", "Unlimited simulations", "Advanced analytics", "Priority support", "Custom branding"],
    ctaCls: "bg-brand-500 hover:bg-brand-400 text-white shadow-lg",
    action: "checkout",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClinicOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";

  const [step, setStep] = useState(1);
  const [clinicId, setClinicId] = useState<number | null>(null);
  const [form, setForm] = useState<ClinicForm>({
    name: "", city: "", country: "", phone: "", website_url: "", description: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [invites, setInvites] = useState<InviteEntry[]>([{ email: "", role: "staff" }]);
  const [inviteResults, setInviteResults] = useState<string[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);

  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  // ── Step 1: Create Clinic ──────────────────────────────────────────────────
  async function handleCreateClinic(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setFormError("Clinic name is required."); return; }
    setFormLoading(true);
    setFormError("");
    try {
      const { data } = await api.post("/api/clinics", form);
      setClinicId(data.id);
      setStep(2);
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setFormError(detail ?? "Failed to create clinic. Please try again.");
    } finally {
      setFormLoading(false);
    }
  }

  // ── Step 2: Invite Team ────────────────────────────────────────────────────
  async function handleInvites() {
    const valid = invites.filter((i) => i.email.trim());
    if (!valid.length || !clinicId) { setStep(3); return; }
    setInviteLoading(true);
    const results: string[] = [];
    for (const inv of valid) {
      try {
        await api.post(`/api/clinics/${clinicId}/members`, { email: inv.email, role: inv.role });
        results.push(`✓ ${inv.email} invited as ${inv.role}`);
      } catch {
        results.push(`✗ ${inv.email} — not found or already a member`);
      }
    }
    setInviteResults(results);
    setInviteLoading(false);
    setTimeout(() => setStep(3), 1200);
  }

  // ── Step 3: Choose Plan ────────────────────────────────────────────────────
  async function handlePlanSelect(planId: string, action: string) {
    if (!clinicId) return;
    if (action === "free") {
      router.push(`/${locale}/clinic`);
      return;
    }
    setCheckoutLoading(planId);
    setCheckoutError("");
    try {
      const { data } = await api.post(`/api/clinics/${clinicId}/checkout?plan=${planId}`);
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setCheckoutError(detail ?? "Stripe checkout failed. Please configure Stripe or try again.");
    } finally {
      setCheckoutLoading(null);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 text-white px-6 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3 block">
            Clinic Onboarding
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            Welcome to Seou-up Pro
          </h1>
          <p className="text-stone-400">Set up your clinic in 3 simple steps</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-10">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-start flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={[
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all mb-2",
                  step > s.n ? "bg-green-500 text-white" :
                  step === s.n ? "bg-brand-500 text-white ring-4 ring-brand-100 animate-pulse-brand" :
                  "bg-stone-200 text-stone-400",
                ].join(" ")}>
                  {step > s.n ? "✓" : s.n}
                </div>
                <span className={`text-xs font-semibold whitespace-nowrap ${step >= s.n ? "text-stone-800" : "text-stone-400"}`}>
                  {s.label}
                </span>
                <span className="text-xs text-stone-400 text-center mt-0.5 hidden sm:block max-w-[100px]">
                  {s.desc}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mt-5 mx-2 transition-all ${step > s.n ? "bg-green-400" : "bg-stone-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Clinic Setup ── */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8">
              <div className="mb-6">
                <div className="text-2xl mb-1">🏥</div>
                <h2 className="text-xl font-bold text-stone-900">Clinic Details</h2>
                <p className="text-stone-500 text-sm mt-1">This will appear on your clinic profile page</p>
              </div>

              <form onSubmit={handleCreateClinic} className="space-y-5">
                <div>
                  <label className="label">Clinic Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Seoul Beauty Studio"
                    className="input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">City</label>
                    <input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Seoul"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <input
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      placeholder="Korea"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+82 10-0000-0000"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Website</label>
                  <input
                    value={form.website_url}
                    onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                    placeholder="https://yourstudio.com"
                    type="url"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Briefly describe your clinic and specialties..."
                    rows={3}
                    className="input resize-none"
                  />
                </div>

                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
                >
                  {formLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating clinic…
                    </span>
                  ) : "Continue to Team Setup →"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── STEP 2: Invite Team ── */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8">
              <div className="mb-6">
                <div className="text-2xl mb-1">👥</div>
                <h2 className="text-xl font-bold text-stone-900">Invite Your Team</h2>
                <p className="text-stone-500 text-sm mt-1">
                  Add staff members to your clinic. You can always add more later.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {invites.map((inv, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input
                      type="email"
                      value={inv.email}
                      onChange={(e) => {
                        const next = [...invites];
                        next[idx] = { ...next[idx], email: e.target.value };
                        setInvites(next);
                      }}
                      placeholder={`staff${idx + 1}@example.com`}
                      className="input flex-1"
                    />
                    <select
                      value={inv.role}
                      onChange={(e) => {
                        const next = [...invites];
                        next[idx] = { ...next[idx], role: e.target.value as "staff" | "manager" };
                        setInvites(next);
                      }}
                      className="input w-36"
                    >
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                    </select>
                    {invites.length > 1 && (
                      <button
                        onClick={() => setInvites(invites.filter((_, i) => i !== idx))}
                        className="text-stone-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setInvites([...invites, { email: "", role: "staff" }])}
                className="text-sm text-brand-500 hover:text-brand-600 font-medium mb-6 flex items-center gap-1"
              >
                + Add another member
              </button>

              {inviteResults.length > 0 && (
                <div className="bg-stone-50 rounded-xl p-4 mb-4 space-y-1">
                  {inviteResults.map((r, i) => (
                    <p key={i} className={`text-xs font-medium ${r.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
                      {r}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-2xl transition-colors text-sm"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleInvites}
                  disabled={inviteLoading}
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-white font-bold rounded-2xl transition-all shadow-md hover:-translate-y-0.5"
                >
                  {inviteLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Inviting…
                    </span>
                  ) : "Send Invites →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Choose Plan ── */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="text-3xl mb-2">✨</div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Choose Your Plan</h2>
              <p className="text-stone-500 text-sm">
                Start free or unlock the full platform. Upgrade anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-6">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={[
                    "relative bg-white rounded-3xl border-2 p-7 flex flex-col",
                    plan.color,
                    plan.badge ? "shadow-xl" : "shadow-sm",
                  ].join(" ")}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${plan.badgeCls}`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-stone-900 mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-3xl font-bold text-stone-900">{plan.price}</span>
                      <span className="text-stone-400 text-sm">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                        <span className="text-green-500 font-bold mt-0.5 shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanSelect(plan.id, plan.action)}
                    disabled={checkoutLoading === plan.id}
                    className={`w-full py-3 font-bold rounded-2xl transition-all disabled:opacity-60 ${plan.ctaCls}`}
                  >
                    {checkoutLoading === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        Redirecting…
                      </span>
                    ) : plan.action === "free" ? "Start Free" : `Subscribe — ${plan.price}/mo`}
                  </button>
                </div>
              ))}
            </div>

            {checkoutError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 text-center mb-4">
                {checkoutError}
              </div>
            )}

            <div className="text-center">
              <Link href={`/${locale}/clinic`} className="text-sm text-stone-400 hover:text-stone-600 underline">
                Go to Clinic Dashboard without a plan →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
