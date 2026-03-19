import Link from "next/link";

export default async function LandingPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        {/* Blurred orbs */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 rounded-full bg-brand-500 opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-yellow-400 opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 w-64 h-64 rounded-full bg-brand-400 opacity-10 blur-2xl" />

        {/* Floating decorative emojis */}
        <span className="pointer-events-none absolute top-12 left-[8%] text-4xl opacity-20 rotate-[-15deg] select-none">🪶</span>
        <span className="pointer-events-none absolute top-24 right-[12%] text-3xl opacity-20 rotate-[10deg] select-none">✨</span>
        <span className="pointer-events-none absolute bottom-20 left-[15%] text-3xl opacity-15 rotate-[5deg] select-none">💄</span>
        <span className="pointer-events-none absolute bottom-12 right-[8%] text-4xl opacity-20 rotate-[-8deg] select-none">🌸</span>

        <div className="relative max-w-5xl mx-auto px-6 py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-stone-300 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            AI Visualization Platform
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Perfect Brows,{" "}
            <span className="text-brand-400">Visualized</span>
            <br />
            <span className="text-stone-300">Before You Commit</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Preview 12 professional eyebrow styles on your own photo.
            Find certified artists, explore startup resources — all in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href={`/${locale}/simulate`}
              className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5"
            >
              ✨ Try Brow Simulator
            </Link>
            <Link
              href={`/${locale}/guide`}
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-2xl transition-all hover:bg-white/10"
            >
              🗂️ Startup Guide
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            ⚠️ Visualization &amp; information purposes only. Not a licensed medical or procedure provider.
          </p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-stone-800 border-y border-stone-700">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-6 md:gap-0">
          {[
            { value: "12", label: "Eyebrow Styles", icon: "🎨" },
            { value: "4", label: "Languages", icon: "🌍" },
            { value: "Free", label: "Simulation", icon: "✨" },
            { value: "4", label: "User Roles", icon: "👥" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 md:flex-1 md:justify-center">
              <span className="text-xl">{stat.icon}</span>
              <div>
                <div className="text-xl font-bold text-white leading-none">{stat.value}</div>
                <div className="text-xs text-stone-400">{stat.label}</div>
              </div>
              {i < 3 && <div className="hidden md:block absolute" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="bg-stone-50 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-3 block">
              Everything You Need
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900">
              One Platform, Endless Possibilities
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "✨",
                title: "AI Brow Simulator",
                desc: "Visualize 12 professional eyebrow styles — from Natural Feather to Bold Arch — on your own photo before any procedure.",
                href: `/${locale}/simulate`,
                cta: "Try Simulator",
                iconBg: "bg-brand-100",
              },
              {
                icon: "🗂️",
                title: "Startup Guide",
                desc: "Complete resource for microblading entrepreneurs. Equipment, marketing, licensing, client consultation — all covered.",
                href: `/${locale}/guide`,
                cta: "Browse Guides",
                iconBg: "bg-amber-100",
              },
              {
                icon: "📍",
                title: "Find Providers",
                desc: "Discover certified microblading studios and professionals near you. Browse verified listings with direct contact.",
                href: `/${locale}/providers`,
                cta: "Find Clinics",
                iconBg: "bg-emerald-100",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group bg-white rounded-3xl p-7 shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${f.iconBg} rounded-2xl flex items-center justify-center text-2xl mb-5`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-stone-900 text-lg mb-3">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed mb-6">{f.desc}</p>
                <Link
                  href={f.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-500 transition-colors"
                >
                  {f.cta} <span>→</span>
                </Link>
              </div>
            ))}
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
              3 Steps to Your Perfect Brows
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "🎨",
                title: "Choose a Style",
                desc: "Browse 12 professional brow styles — from soft naturals to bold arches.",
              },
              {
                step: "02",
                icon: "📷",
                title: "Upload Your Photo",
                desc: "Upload a clear front-facing portrait. Photos are private and deleted after 30 days.",
              },
              {
                step: "03",
                icon: "✨",
                title: "Preview Your Result",
                desc: "See your chosen brow style visualized on your own face — instantly.",
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mx-auto w-20 h-20 bg-brand-50 border-2 border-brand-200 rounded-full flex items-center justify-center mb-5">
                  <span className="text-3xl">{step.icon}</span>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
                    {step.step}
                  </div>
                </div>
                <h3 className="font-bold text-stone-900 text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href={`/${locale}/simulate`}
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-md"
            >
              ✨ Start Free Simulation
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOR PROFESSIONALS ── */}
      <section className="bg-stone-900 px-6 py-20 text-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-4 block">
              For Professionals
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-5 leading-tight">
              Growing Your Microblading Business?
            </h2>
            <p className="text-stone-400 text-base leading-relaxed mb-8">
              Access expert guides on equipment, licensing, client consultation, and digital marketing.
              Built for microblading artists and entrepreneurs across Asia and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/${locale}/guide`}
                className="inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-stone-900 font-semibold px-6 py-3.5 rounded-2xl transition-all"
              >
                🗂️ Browse Startup Guide
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="inline-flex items-center justify-center gap-2 border border-stone-600 hover:border-stone-400 text-stone-300 font-semibold px-6 py-3.5 rounded-2xl transition-all"
              >
                Create Pro Account
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "📚", title: "5 Expert Guides", desc: "Startup · Technique · Marketing" },
              { icon: "💼", title: "Pro Dashboard", desc: "Manage client sessions" },
              { icon: "📍", title: "Provider Listing", desc: "List your studio" },
              { icon: "🌍", title: "4 Languages", desc: "EN · KO · TH · VI" },
            ].map((item) => (
              <div key={item.title} className="bg-stone-800 rounded-2xl p-5 border border-stone-700">
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
                <div className="text-xs text-stone-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-brand-500 px-6 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Start Your Brow Journey Today
          </h2>
          <p className="text-brand-100 mb-8 text-lg">
            Free simulation. No commitment. Just confidence.
          </p>
          <Link
            href={`/${locale}/auth/register`}
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-brand-600 font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-stone-900 px-6 py-10 border-t border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">💄</span>
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
