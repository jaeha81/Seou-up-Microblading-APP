import Link from "next/link";

export default async function LandingPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-stone-900 to-stone-800 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(217,86,62,0.08),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(212,160,23,0.06),transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-stone-300 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
            B2B SaaS Platform for Beauty Clinics
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
            The Clinic Management Platform
            <br />
            <span className="text-brand-400">for Microblading Professionals</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI brow simulation + client CRM + booking management.
            Everything your clinic needs in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href={`/${locale}/auth/register`}
              className="inline-flex items-center justify-center bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              무료 시작하기
            </Link>
            <Link
              href={`mailto:demo@seouup.dev?subject=Demo Request`}
              className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-semibold px-8 py-4 rounded-2xl transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              데모 신청하기 →
            </Link>
            <Link
              href={`/${locale}/features`}
              className="inline-flex items-center justify-center border border-white/25 hover:border-white/50 hover:bg-white/8 text-white font-semibold px-8 py-4 rounded-2xl transition-all"
            >
              기능 살펴보기
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-px border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm max-w-2xl mx-auto">
            {[
              { value: "500+", label: "Clinics" },
              { value: "12", label: "Brow Styles" },
              { value: "4", label: "Languages" },
              { value: "Free", label: "Trial" },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex-1 min-w-[100px] px-6 py-4 text-center border-r border-white/10 last:border-r-0"
              >
                <div className="text-xl font-bold text-white leading-none mb-1">{stat.value}</div>
                <div className="text-xs text-stone-400 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-stone-800 border-y border-stone-700">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-400 whitespace-nowrap">
            Trusted by studios in Korea · Thailand · Vietnam · Malaysia
          </span>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {["Studio A", "Brow Lab", "BeautyPro", "ArtBrow"].map((name) => (
              <span
                key={name}
                className="bg-stone-700 border border-stone-600 text-stone-300 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="bg-stone-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-3 block">
              Platform Features
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
              Built for Professional Clinics
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                ),
                title: "AI Brow Simulator",
                desc: "Show clients exactly how their brows will look. 12 professional styles, instant visualization.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                ),
                title: "Client CRM",
                desc: "Track every client's consultation history, preferred styles, and session notes in one place.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                  </svg>
                ),
                title: "Provider Directory",
                desc: "Get discovered. List your clinic, earn a Featured badge, and appear at the top of search.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group bg-white rounded-3xl p-7 shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="font-bold text-stone-900 text-lg mb-3">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-3 block">
              See It In Action
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
              Your Pro Dashboard
            </h2>
            <p className="text-stone-500 text-base mt-3 max-w-xl mx-auto">
              A complete overview of your clinic — clients, sessions, and revenue at a glance.
            </p>
          </div>

          {/* Mock Dashboard Box */}
          <div className="bg-stone-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-stone-700">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-1">Pro Dashboard</div>
                <div className="text-white font-bold text-lg">Clinic Overview</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-xs text-stone-400">Live</span>
              </div>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                {
                  label: "Total Clients", value: "248명", accent: "text-brand-400", bg: "bg-brand-500/10 border-brand-500/20",
                  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>,
                },
                {
                  label: "This Month", value: "32건", accent: "text-green-400", bg: "bg-green-500/10 border-green-500/20",
                  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>,
                },
                {
                  label: "Revenue", value: "$1,840", accent: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20",
                  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
                },
              ].map((card) => (
                <div key={card.label} className={`rounded-2xl p-4 border ${card.bg}`}>
                  <div className={`mb-2 ${card.accent}`}>{card.icon}</div>
                  <div className={`text-2xl font-bold ${card.accent}`}>{card.value}</div>
                  <div className="text-xs text-stone-500 mt-1">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Clients Table */}
            <div className="bg-stone-800 rounded-2xl overflow-hidden border border-stone-700">
              <div className="px-5 py-3 border-b border-stone-700">
                <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">Recent Clients</span>
              </div>
              <div className="divide-y divide-stone-700/50">
                {[
                  { name: "Soo-Yeon K.", date: "May 26, 2026", treatment: "Natural Feather", status: "Completed", statusColor: "bg-green-500/20 text-green-400" },
                  { name: "Areeya N.", date: "May 25, 2026", treatment: "Soft Arch", status: "Scheduled", statusColor: "bg-blue-500/20 text-blue-400" },
                  { name: "Linh T.", date: "May 24, 2026", treatment: "Ombre Gradient", status: "Completed", statusColor: "bg-green-500/20 text-green-400" },
                ].map((row) => (
                  <div key={row.name} className="px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold shrink-0">
                        {row.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{row.name}</div>
                        <div className="text-xs text-stone-500">{row.date}</div>
                      </div>
                    </div>
                    <div className="hidden sm:block text-xs text-stone-400">{row.treatment}</div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-3 block">
              How It Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
              Three Steps to Launch
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Register Your Clinic",
                desc: "Create a Pro account and set up your studio profile in minutes.",
              },
              {
                step: "02",
                title: "Run Consultations",
                desc: "Use the AI simulator during client consultations to visualize results.",
              },
              {
                step: "03",
                title: "Grow Your Business",
                desc: "Track clients, manage sessions, and get discovered by new customers.",
              },
            ].map((step, i) => (
              <div key={step.step} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-stone-200" />
                )}
                <div className="relative inline-flex w-14 h-14 rounded-full bg-brand-50 border-2 border-brand-200 items-center justify-center mb-5 mx-auto">
                  <span className="font-bold text-brand-600 text-sm tracking-tight">{step.step}</span>
                </div>
                <h3 className="font-bold text-stone-900 text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SIMULATOR PREVIEW ── */}
      <section className="bg-stone-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-3 block">
                AI Technology
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-5 leading-tight">
                Visualize Results
                <br />
                <span className="text-brand-500">Before the Procedure</span>
              </h2>
              <p className="text-stone-500 text-base leading-relaxed mb-6">
                Our AI Brow Simulator lets clients see exactly how their brows will look
                across <strong className="text-stone-700">12 professional styles</strong> — Natural Feather,
                Soft Arch, Ombre Gradient, and more. Increase client confidence and reduce hesitation.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "12 professionally designed brow styles",
                  "Instant visualization on client photos",
                  "Share results via link or PDF",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-stone-600">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/simulate`}
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                무료로 체험해보기 →
              </Link>
            </div>

            {/* Right: Simulator Mockup */}
            <div className="flex justify-center">
              <div className="bg-stone-900 rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-stone-700">
                <div className="text-center mb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">AI Simulator</span>
                </div>

                {/* Face Silhouette SVG */}
                <div className="bg-stone-800 rounded-2xl flex items-center justify-center py-8 mb-5 border border-stone-700">
                  <svg viewBox="0 0 120 130" className="w-32 h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Face outline */}
                    <ellipse cx="60" cy="68" rx="42" ry="52" fill="#44403c" stroke="#78716c" strokeWidth="1.5"/>
                    {/* Eyes */}
                    <ellipse cx="44" cy="58" rx="7" ry="4" fill="#292524"/>
                    <ellipse cx="76" cy="58" rx="7" ry="4" fill="#292524"/>
                    {/* Eyebrows - brand color highlight */}
                    <path d="M34 48 Q44 43 54 47" stroke="#d9563e" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M66 47 Q76 43 86 48" stroke="#d9563e" strokeWidth="3" strokeLinecap="round"/>
                    {/* Nose */}
                    <path d="M57 65 Q60 72 63 65" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    {/* Lips */}
                    <path d="M48 82 Q60 89 72 82" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    {/* Hair */}
                    <ellipse cx="60" cy="20" rx="42" ry="18" fill="#292524"/>
                  </svg>
                </div>

                {/* Style label */}
                <div className="text-center mb-4">
                  <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full">
                    Natural Feather Style
                  </span>
                </div>

                {/* Color Swatches */}
                <div className="flex items-center justify-center gap-2.5">
                  {[
                    { bg: "bg-stone-900", border: "border-brand-400 ring-2 ring-brand-400" },
                    { bg: "bg-stone-600", border: "border-stone-500" },
                    { bg: "bg-amber-800", border: "border-amber-700" },
                    { bg: "bg-amber-600", border: "border-amber-500" },
                    { bg: "bg-amber-300", border: "border-amber-200" },
                    { bg: "bg-stone-400", border: "border-stone-300" },
                  ].map((swatch, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full border-2 ${swatch.bg} ${swatch.border} cursor-pointer transition-transform hover:scale-110`}
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-stone-500 mt-3">Choose pigment tone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ── */}
      <section className="bg-stone-900 px-6 py-20 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-stone-400 text-base">Start free, scale as you grow</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mb-10 max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-stone-800 border border-stone-700 rounded-3xl p-7">
              <div className="mb-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Free</div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-stone-400 text-sm mb-1">/month</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-2">
                {[
                  "Basic clinic listing",
                  "AI Simulator (3 sessions)",
                  "Public profile page",
                  "Community access",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-400">
                    <span className="text-stone-500 mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="bg-stone-800 border border-brand-500/40 rounded-3xl p-7 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                POPULAR
              </div>
              <div className="mb-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-2">Pro</div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-stone-400 text-sm mb-1">/month</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-2">
                {[
                  "Featured badge & top listing",
                  "Unlimited AI Simulator",
                  "Full Client CRM",
                  "Analytics dashboard",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-300">
                    <span className="text-brand-400 mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Agency */}
            <div className="bg-stone-800 border border-gold-500/30 rounded-3xl p-7 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-500 text-stone-900 text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                AGENCY
              </div>
              <div className="mb-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-2">Agency</div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">$79</span>
                  <span className="text-stone-400 text-sm mb-1">/month</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-2">
                {[
                  "Everything in Pro",
                  "Multi-location support",
                  "Team accounts (5 seats)",
                  "Priority support & API",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-300">
                    <span className="text-yellow-400 mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}/pricing`}
              className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5"
            >
              See All Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-stone-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-3 block">
              What Professionals Say
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "The simulator saves 20 minutes per consultation. Clients love seeing their results before committing.",
                author: "Studio Owner",
                location: "Seoul",
                initials: "SO",
                avatarBg: "bg-brand-100 text-brand-700",
              },
              {
                quote: "Getting featured doubled our online inquiries within the first month.",
                author: "Kwon Areum",
                location: "Bangkok",
                initials: "KA",
                avatarBg: "bg-yellow-100 text-yellow-700",
              },
              {
                quote: "Finally a platform built for microblading studios, not generic salons.",
                author: "Nguyen Van",
                location: "Hanoi",
                initials: "NV",
                avatarBg: "bg-green-100 text-green-700",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 shadow-sm border border-stone-100 relative"
              >
                {/* Star rating */}
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <svg key={si} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <div className="text-4xl font-serif leading-none text-brand-100 select-none mb-3">&ldquo;</div>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">{t.quote}</p>
                <div className="border-t border-stone-100 pt-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${t.avatarBg}`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900">{t.author}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{t.location}</div>
                  </div>
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
            Start Your Free Trial Today
          </h2>
          <p className="text-brand-100 mb-8 text-lg">
            No credit card required. Full access for 14 days.
          </p>
          <Link
            href={`/${locale}/auth/register`}
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-brand-600 font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-stone-900 px-6 py-10 border-t border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Seou-up</span>
            <span className="text-stone-500 text-sm ml-1">Microblading</span>
          </div>
          <p className="text-xs text-stone-500 text-center max-w-sm">
            Visualization &amp; information platform only. Not a licensed medical or procedure provider.
            Always consult a certified professional before any cosmetic procedure.
          </p>
          <div className="flex items-center gap-5 text-xs text-stone-500">
            <Link href={`/${locale}/legal`} className="hover:text-brand-400 transition-colors">Legal</Link>
            <Link href={`/${locale}/feedback`} className="hover:text-brand-400 transition-colors">Feedback</Link>
            <Link href={`/${locale}/auth/login`} className="hover:text-brand-400 transition-colors">Sign In</Link>
            <Link href={`/${locale}/auth/register`} className="hover:text-white transition-colors font-medium">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
