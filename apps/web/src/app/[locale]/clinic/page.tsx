"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import api from "@/lib/api";

type ClinicData = {
  id: number;
  name: string;
  slug: string;
  country?: string;
  city?: string;
  phone?: string;
  website_url?: string;
  description?: string;
  plan: "basic" | "pro";
  plan_status: string;
  current_period_end?: string;
  is_active: boolean;
};

type MineResponse = {
  clinic: ClinicData | null;
  my_role: string | null;
  member_count?: number;
};

type Member = {
  user_id: number;
  email: string;
  full_name?: string;
  role: string;
};

const PLAN_COLORS: Record<string, string> = {
  basic: "bg-blue-100 text-blue-800",
  pro:   "bg-purple-100 text-purple-800",
};

const STATUS_COLOR: Record<string, string> = {
  trialing:  "text-yellow-600",
  active:    "text-green-600",
  past_due:  "text-red-600",
  cancelled: "text-stone-400",
};

const PLAN_PRICE: Record<string, string> = {
  basic: "$49/mo",
  pro:   "$99/mo",
};

export default function ClinicPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const t = useTranslations("clinic");
  const tCommon = useTranslations("common");

  const [mine, setMine] = useState<MineResponse | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", country: "", phone: "", website_url: "" });
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("staff");
  const [inviteMsg, setInviteMsg] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => { fetchMine(); }, []);

  async function fetchMine() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get<MineResponse>("/api/clinics/mine");
      setMine(data);
      if (data.clinic) {
        const { data: mems } = await api.get<Member[]>(`/api/clinics/${data.clinic.id}/members`);
        setMembers(mems);
      }
    } catch {
      setError(t("error_load"));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setCreateError(t("field_name") + " is required."); return; }
    setCreateLoading(true);
    setCreateError("");
    try {
      await api.post("/api/clinics", form);
      setCreating(false);
      fetchMine();
    } catch (err: unknown) {
      const detail =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setCreateError(detail ?? t("error_create"));
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!mine?.clinic || !inviteEmail.trim()) return;
    setInviteLoading(true);
    setInviteMsg("");
    try {
      const { data } = await api.post(`/api/clinics/${mine.clinic.id}/members`, {
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteMsg(data.message);
      setInviteEmail("");
      fetchMine();
    } catch (err: unknown) {
      const detail =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setInviteMsg(detail ?? t("error_invite"));
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleRemoveMember(userId: number) {
    if (!mine?.clinic) return;
    try {
      await api.delete(`/api/clinics/${mine.clinic.id}/members/${userId}`);
      fetchMine();
    } catch {
      alert(t("error_remove"));
    }
  }

  async function handleUpgrade(plan: "basic" | "pro") {
    if (!mine?.clinic) return;
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const { data } = await api.post(`/api/clinics/${mine.clinic.id}/checkout?plan=${plan}`);
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch (err: unknown) {
      const detail =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setCheckoutError(detail ?? t("error_checkout"));
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 text-sm animate-pulse">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm max-w-md text-center">
          {error}
          <br />
          <a href={`/${locale}/auth/login`} className="underline mt-2 inline-block">
            {t("sign_in")}
          </a>
        </div>
      </div>
    );
  }

  // ── No clinic yet ──────────────────────────────────────────────────────────
  if (!mine?.clinic) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white px-6 py-14 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-3 block">
            {t("portal_label")}
          </span>
          <h1 className="font-serif text-4xl font-bold mb-3">{t("portal_title")}</h1>
          <p className="text-stone-300 text-lg max-w-lg mx-auto">{t("portal_subtitle")}</p>
        </div>

        <div className="max-w-lg mx-auto px-6 py-14">
          {!creating ? (
            <div className="text-center">
              <p className="text-stone-500 mb-6">{t("no_clinic")}</p>
              <button
                onClick={() => setCreating(true)}
                className="bg-stone-900 hover:bg-stone-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                {t("register_button")}
              </button>
              <p className="text-xs text-stone-400 mt-4">
                {t("already_pro")}{" "}
                <a href={`/${locale}/pricing`} className="underline">{t("view_pricing")}</a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 space-y-4">
              <h2 className="text-xl font-bold text-stone-900 mb-2">{t("form_title")}</h2>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">{t("field_name")} *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t("field_name_placeholder")}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">{t("field_city")}</label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder={t("field_city_placeholder")}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">{t("field_country")}</label>
                  <input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder={t("field_country_placeholder")}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">{t("field_phone")}</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t("field_phone_placeholder")}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">{t("field_website")}</label>
                <input
                  value={form.website_url}
                  onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                  placeholder={t("field_website_placeholder")}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
              {createError && <p className="text-red-600 text-sm">{createError}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 bg-stone-900 hover:bg-stone-700 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60"
                >
                  {createLoading ? t("creating") : t("create_button")}
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl transition-colors"
                >
                  {tCommon("cancel")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ── Clinic Dashboard ───────────────────────────────────────────────────────
  const clinic = mine.clinic;
  const planColor = PLAN_COLORS[clinic.plan] ?? PLAN_COLORS.basic;
  const planLabel = clinic.plan === "pro" ? t("plan_pro_label") : t("plan_basic_label");
  const planPrice = PLAN_PRICE[clinic.plan] ?? PLAN_PRICE.basic;
  const statusColor = STATUS_COLOR[clinic.plan_status] ?? "text-stone-500";
  const statusLabels: Record<string, string> = {
    trialing: t("status_trialing"),
    active: t("status_active"),
    past_due: t("status_past_due"),
    cancelled: t("status_cancelled"),
  };
  const isOwner = mine.my_role === "owner";

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-2 block">
            {t("dashboard_label")}
          </span>
          <h1 className="font-serif text-3xl font-bold">{clinic.name}</h1>
          <p className="text-stone-400 text-sm mt-1">
            {[clinic.city, clinic.country].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        {/* Subscription Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">
              {t("section_subscription")}
            </h2>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${planColor}`}>{planLabel}</span>
            </div>
            <p className="text-2xl font-bold text-stone-900 mt-1">{planPrice}</p>
            <p className={`text-sm font-medium mt-1 ${statusColor}`}>
              {statusLabels[clinic.plan_status] ?? clinic.plan_status}
            </p>
            {clinic.current_period_end && (
              <p className="text-xs text-stone-400 mt-1">
                {t("renews")} {new Date(clinic.current_period_end).toLocaleDateString()}
              </p>
            )}

            {isOwner && clinic.plan === "basic" && clinic.plan_status !== "cancelled" && (
              <div className="mt-4">
                <button
                  onClick={() => handleUpgrade("pro")}
                  disabled={checkoutLoading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-stone-900 font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                >
                  {checkoutLoading ? t("redirecting") : t("upgrade_to_pro")}
                </button>
              </div>
            )}
            {isOwner && (!clinic.plan || clinic.plan_status === "cancelled") && (
              <div className="mt-4">
                <button
                  onClick={() => handleUpgrade("basic")}
                  disabled={checkoutLoading}
                  className="w-full bg-stone-900 hover:bg-stone-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                >
                  {checkoutLoading ? t("redirecting") : t("subscribe")}
                </button>
              </div>
            )}
            {checkoutError && <p className="text-red-600 text-xs mt-2">{checkoutError}</p>}

            <div className="mt-4 pt-4 border-t border-stone-100 text-xs text-stone-400 space-y-1">
              <div className="flex justify-between">
                <span>{t("staff_limit")}</span>
                <span className="font-medium text-stone-600">
                  {clinic.plan === "pro" ? t("unlimited") : "3"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("simulations")}</span>
                <span className="font-medium text-stone-600">
                  {clinic.plan === "pro" ? t("unlimited") : "300/mo"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Card */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                {t("section_team")} ({mine.member_count ?? members.length})
              </h2>
            </div>
            <div className="divide-y divide-stone-100">
              {members.map((m) => (
                <div key={m.user_id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-stone-900">{m.full_name || m.email}</p>
                    <p className="text-xs text-stone-400">{m.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full font-medium">
                      {m.role}
                    </span>
                    {isOwner && m.role !== "owner" && (
                      <button
                        onClick={() => handleRemoveMember(m.user_id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        {t("remove")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isOwner && (
              <form onSubmit={handleInvite} className="mt-5 pt-4 border-t border-stone-100">
                <p className="text-sm font-medium text-stone-700 mb-3">{t("invite_title")}</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder={t("invite_placeholder")}
                    className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="border border-stone-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white"
                  >
                    <option value="staff">{t("role_staff")}</option>
                    <option value="manager">{t("role_manager")}</option>
                  </select>
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="bg-stone-900 hover:bg-stone-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-60"
                  >
                    {inviteLoading ? "…" : t("invite_button")}
                  </button>
                </div>
                {inviteMsg && (
                  <p className={`text-xs mt-2 ${inviteMsg.includes("added") ? "text-green-600" : "text-red-600"}`}>
                    {inviteMsg}
                  </p>
                )}
                {clinic.plan === "basic" && (
                  <p className="text-xs text-stone-400 mt-1">{t("invite_basic_limit")}</p>
                )}
              </form>
            )}
          </div>

          {/* Clinic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mt-6">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">
              {t("section_info")}
            </h2>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              {clinic.phone && (
                <>
                  <span className="text-stone-400">{t("info_phone")}</span>
                  <span className="text-stone-700 font-medium">{clinic.phone}</span>
                </>
              )}
              {clinic.website_url && (
                <>
                  <span className="text-stone-400">{t("info_website")}</span>
                  <a href={clinic.website_url} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 underline font-medium truncate">
                    {clinic.website_url}
                  </a>
                </>
              )}
              <span className="text-stone-400">{t("info_slug")}</span>
              <span className="text-stone-700 font-mono text-xs">{clinic.slug}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
