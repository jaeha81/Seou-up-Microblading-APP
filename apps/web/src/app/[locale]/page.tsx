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
              Start Free Trial
            </Link>
            <Link
              href={`/${locale}/pricing`}
              className="inline-flex items-center justify-center border border-white/25 hover:border-white/50 hover:bg-white/8 text-white font-semibold px-8 py-4 rounded-2xl transition-all"
            >
              See Pricing →
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

      {/* ── PRICING PREVIEW ── */}
      <section className="bg-stone-900 px-6 py-20 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-stone-400 text-base">Start free, scale as you grow</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {/* Free */}
            <div className="bg-stone-800 border border-stone-700 rounded-3xl p-7">
              <div className="mb-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Free</div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-stone-400 text-sm mb-1">/month</span>
                </div>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed">
                Basic listing, simulator access
              </p>
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
              <p className="text-sm text-stone-400 leading-relaxed">
                Featured badge, client CRM, analytics
              </p>
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
              },
              {
                quote: "Getting featured doubled our online inquiries within the first month.",
                author: "Brow Artist",
                location: "Bangkok",
              },
              {
                quote: "Finally a platform built for microblading studios, not generic salons.",
                author: "Clinic Manager",
                location: "Hanoi",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 shadow-sm border border-stone-100 relative"
              >
                <div className="text-4xl font-serif leading-none text-brand-100 select-none mb-3">&ldquo;</div>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">{t.quote}</p>
                <div className="border-t border-stone-100 pt-4">
                  <div className="text-sm font-semibold text-stone-900">{t.author}</div>
                  <div className="text-xs text-stone-400 mt-0.5">{t.location}</div>
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
