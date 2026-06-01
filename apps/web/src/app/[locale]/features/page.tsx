import Link from "next/link";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

export default async function FeaturesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("features");

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-b from-stone-950 to-stone-900 text-white px-6 py-24 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-4 block">
          {t("hero_label")}
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-5 max-w-3xl mx-auto leading-tight">
          {t("hero_title_line1")}
          <br />
          <span className="text-brand-400">{t("hero_title_line2")}</span>
        </h1>
        <p className="text-stone-300 text-lg max-w-2xl mx-auto mb-10">
          {t("hero_subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/auth/register`}
            className="inline-flex items-center justify-center bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5"
          >
            {t("hero_cta_trial")}
          </Link>
          <Link
            href={`/${locale}/simulate`}
            className="inline-flex items-center justify-center border border-white/25 hover:border-white/50 hover:bg-white/8 text-white font-semibold px-8 py-4 rounded-2xl transition-all"
          >
            {t("hero_cta_sim")}
          </Link>
        </div>
      </section>

      {/* ── FEATURE 1: AI SIMULATOR ── */}
      <section className="px-6 py-20 bg-stone-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
              {t("sim_label")}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-5 leading-tight">
              {t("sim_title")}
            </h2>
            <p className="text-stone-500 text-base leading-relaxed mb-6">
              {t("sim_desc")}
            </p>
            <ul className="space-y-3 mb-8">
              {[t("sim_b1"), t("sim_b2"), t("sim_b3"), t("sim_b4"), t("sim_b5")].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-stone-600">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/simulate`}
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all shadow-md hover:-translate-y-0.5"
            >
              {t("sim_cta")}
            </Link>
          </div>

          {/* Simulator preview card */}
          <div className="bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-700">
            <div className="text-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">{t("sim_card_label")}</span>
            </div>
            <div className="bg-stone-800 rounded-2xl flex items-center justify-center py-10 mb-5 border border-stone-700">
              <svg viewBox="0 0 120 130" className="w-36 h-40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="60" cy="68" rx="42" ry="52" fill="#44403c" stroke="#78716c" strokeWidth="1.5"/>
                <ellipse cx="44" cy="58" rx="7" ry="4" fill="#292524"/>
                <ellipse cx="76" cy="58" rx="7" ry="4" fill="#292524"/>
                <path d="M32 46 Q44 40 56 45" stroke="#d9563e" strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M64 45 Q76 40 88 46" stroke="#d9563e" strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M57 65 Q60 72 63 65" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <path d="M48 82 Q60 89 72 82" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                <ellipse cx="60" cy="20" rx="42" ry="18" fill="#292524"/>
              </svg>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Natural", "Ombre", "Bold Arch", "Korean", "3D Hair"].map((s) => (
                <span key={s} className="text-xs bg-stone-800 border border-stone-700 text-stone-300 px-3 py-1.5 rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE 2: CRM ── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* CRM mock */}
          <div className="order-2 md:order-1 bg-white rounded-3xl border border-stone-100 shadow-xl overflow-hidden">
            <div className="bg-stone-50 border-b border-stone-100 px-5 py-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-700">{t("crm_card_title")}</span>
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">{t("crm_live")}</span>
            </div>
            <div className="divide-y divide-stone-50">
              {[
                { name: "Soo-Yeon K.", style: "Natural Feather", date: "May 26", status: t("crm_status_completed"), statusCls: "bg-green-100 text-green-700" },
                { name: "Areeya N.",   style: "Soft Arch",       date: "May 25", status: t("crm_status_scheduled"), statusCls: "bg-blue-100 text-blue-700" },
                { name: "Linh T.",     style: "Ombre Gradient",  date: "May 24", status: t("crm_status_completed"), statusCls: "bg-green-100 text-green-700" },
                { name: "Mei L.",      style: "Bold Arch",       date: "May 23", status: t("crm_status_followup"), statusCls: "bg-amber-100 text-amber-700" },
              ].map((row) => (
                <div key={row.name} className="px-5 py-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {row.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-stone-900">{row.name}</div>
                      <div className="text-xs text-stone-400">{row.style} · {row.date}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${row.statusCls}`}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 bg-stone-50 border-t border-stone-100 flex justify-between text-xs text-stone-500">
              <span>{t("crm_total")}</span>
              <span className="text-brand-500 font-semibold">{t("crm_view_all")}</span>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
              {t("crm_label")}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-5 leading-tight">
              {t("crm_title")}
            </h2>
            <p className="text-stone-500 text-base leading-relaxed mb-6">
              {t("crm_desc")}
            </p>
            <ul className="space-y-3 mb-8">
              {[t("crm_b1"), t("crm_b2"), t("crm_b3"), t("crm_b4"), t("crm_b5")].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-stone-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FEATURE 3: TEAM MANAGEMENT ── */}
      <section className="px-6 py-20 bg-stone-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
              {t("team_label")}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-5 leading-tight">
              {t("team_title")}
            </h2>
            <p className="text-stone-500 text-base leading-relaxed mb-6">
              {t("team_desc")}
            </p>
            <ul className="space-y-3 mb-8">
              {[t("team_b1"), t("team_b2"), t("team_b3"), t("team_b4"), t("team_b5")].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-stone-600">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/clinic/onboarding`}
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5"
            >
              {t("team_cta")}
            </Link>
          </div>

          {/* Team card */}
          <div className="bg-white rounded-3xl border border-stone-100 shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-stone-900 text-sm">{t("team_card_title")}</h3>
              <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">{t("team_card_badge")}</span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Kim Yura", role: t("team_role_owner"), avatar: "KY", roleCls: "bg-brand-100 text-brand-700" },
                { name: "Park Nari", role: t("team_role_manager"), avatar: "PN", roleCls: "bg-purple-100 text-purple-700" },
                { name: "Lee Sojung", role: t("team_role_staff"), avatar: "LS", roleCls: "bg-stone-100 text-stone-600" },
                { name: "Choi Minji", role: t("team_role_staff"), avatar: "CM", roleCls: "bg-stone-100 text-stone-600" },
              ].map((m) => (
                <div key={m.name} className="flex items-center justify-between py-2.5 border-b border-stone-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 shrink-0">
                      {m.avatar}
                    </div>
                    <span className="text-sm font-medium text-stone-800">{m.name}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.roleCls}`}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 border border-dashed border-stone-200 rounded-xl text-xs text-stone-400 hover:border-brand-300 hover:text-brand-500 transition-colors font-medium">
              {t("team_invite")}
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURE 4: ANALYTICS ── */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
            {t("analytics_label")}
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            {t("analytics_title")}
          </h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto">
            {t("analytics_desc")}
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: t("analytics_c1_title"),
              desc: t("analytics_c1_desc"),
              color: "bg-brand-50 border-brand-100",
              iconCls: "text-brand-500",
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
            },
            {
              title: t("analytics_c2_title"),
              desc: t("analytics_c2_desc"),
              color: "bg-blue-50 border-blue-100",
              iconCls: "text-blue-500",
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" /></svg>,
            },
            {
              title: t("analytics_c3_title"),
              desc: t("analytics_c3_desc"),
              color: "bg-purple-50 border-purple-100",
              iconCls: "text-purple-500",
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>,
            },
            {
              title: t("analytics_c4_title"),
              desc: t("analytics_c4_desc"),
              color: "bg-green-50 border-green-100",
              iconCls: "text-green-600",
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
            },
          ].map((f) => (
            <div key={f.title} className={`rounded-2xl border p-5 ${f.color}`}>
              <div className={`mb-3 ${f.iconCls}`}>{f.icon}</div>
              <h3 className="font-bold text-stone-900 text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-6 text-center">
          <Link
            href={`/${locale}/clinic/analytics`}
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-500 font-semibold text-sm transition-colors"
          >
            {t("analytics_cta")}
          </Link>
        </div>
      </section>

      {/* ── FEATURE 5: PROVIDER DIRECTORY ── */}
      <section className="px-6 py-20 bg-stone-900 text-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-stone-200 text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide border border-white/15">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              {t("dir_label")}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-5 leading-tight">
              {t("dir_title_line1")}
              <br />
              <span className="text-brand-400">{t("dir_title_line2")}</span>
            </h2>
            <p className="text-stone-400 text-base leading-relaxed mb-6">
              {t("dir_desc")}
            </p>
            <ul className="space-y-3 mb-8">
              {[t("dir_b1"), t("dir_b2"), t("dir_b3"), t("dir_b4"), t("dir_b5")].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-stone-300">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-stone-800 rounded-3xl border border-stone-700 p-6">
            {[
              { name: "Seoul Beauty Studio", city: "Seoul", featured: true, rating: 4.9, reviews: 124 },
              { name: "Brow Lab Bangkok",    city: "Bangkok", featured: true, rating: 4.8, reviews: 87 },
              { name: "ArtBrow Hanoi",       city: "Hanoi", featured: false, rating: 4.6, reviews: 42 },
            ].map((p) => (
              <div key={p.name} className="flex items-center justify-between py-4 border-b border-stone-700/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-white">{p.name}</span>
                      {p.featured && (
                        <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full font-semibold">
                          {t("dir_featured")}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">{p.city}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-yellow-400">{p.rating}★</div>
                  <div className="text-xs text-stone-500">{t("dir_reviews", { count: p.reviews })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="px-6 py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label">{t("compare_label")}</span>
            <h2 className="section-title">{t("compare_title")}</h2>
          </div>

          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-4 bg-stone-50 border-b border-stone-100">
              <div className="col-span-2 px-6 py-4 text-sm font-semibold text-stone-500 uppercase tracking-wide">{t("compare_col_feature")}</div>
              <div className="px-4 py-4 text-center text-sm font-bold text-stone-700">{t("compare_col_free")}</div>
              <div className="px-4 py-4 text-center text-sm font-bold text-brand-600 bg-brand-50">{t("compare_col_pro")}</div>
            </div>
            {[
              [t("compare_r1"), "3/mo", t("compare_unlimited")],
              [t("compare_r2"), "—", "✓"],
              [t("compare_r3"), "—", t("compare_unlimited")],
              [t("compare_r4"), "—", "✓"],
              [t("compare_r5"), "—", "✓"],
              [t("compare_r6"), "—", "✓"],
              [t("compare_r7"), "—", t("compare_agency")],
              [t("compare_r8"), "—", t("compare_agency")],
            ].map(([feat, free, pro]) => (
              <div key={feat} className="grid grid-cols-4 border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                <div className="col-span-2 px-6 py-3.5 text-sm text-stone-700 font-medium">{feat}</div>
                <div className="px-4 py-3.5 text-center text-sm text-stone-400">{free}</div>
                <div className={`px-4 py-3.5 text-center text-sm font-semibold ${pro === "✓" ? "text-green-600" : pro === "—" ? "text-stone-300" : "text-stone-500"} bg-brand-50/30`}>
                  {pro}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-brand-500 px-6 py-20 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            {t("cta_title")}
          </h2>
          <p className="text-brand-100 mb-8 text-lg">
            {t("cta_subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/auth/register`}
              className="inline-flex items-center justify-center bg-white hover:bg-stone-50 text-brand-600 font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5"
            >
              {t("cta_trial")}
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="inline-flex items-center justify-center border border-white/40 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-2xl transition-all"
            >
              {t("cta_pricing")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
