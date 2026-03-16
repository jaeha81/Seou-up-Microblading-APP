import Link from "next/link";
import { getLocale } from "next-intl/server";

export default async function LandingPage() {
  const locale = await getLocale();

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <section className="relative px-6 py-24 text-center max-w-5xl mx-auto">
        <div className="mb-6">
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
            Visualization Platform
          </span>
        </div>
        <h1 className="text-5xl font-bold text-stone-900 mb-4 leading-tight">
          Seou-up{" "}
          <span className="text-brand-500">Microblading</span>
        </h1>
        <p className="text-xl text-stone-600 mb-2 max-w-2xl mx-auto">
          Preview your perfect brows before any procedure.
          Explore styles, find certified professionals, and start your journey with confidence.
        </p>
        <p className="text-xs text-stone-400 mb-10">
          ⚠️ For visualization and information purposes only. Not a licensed medical or procedure provider.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/simulate`}
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Try Brow Simulator
          </Link>
          <Link
            href={`/${locale}/guide`}
            className="border border-stone-300 hover:border-brand-400 text-stone-700 font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Startup Guide
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16 max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          {
            icon: "✨",
            title: "AI Brow Simulator",
            desc: "Visualize 12 eyebrow styles on your own photo using our mock AI simulation engine.",
            href: `/${locale}/simulate`,
          },
          {
            icon: "🗂️",
            title: "Startup Guide",
            desc: "Complete resource for microblading entrepreneurs — equipment, marketing, licensing.",
            href: `/${locale}/guide`,
          },
          {
            icon: "📍",
            title: "Find Providers",
            desc: "Discover certified microblading studios near you.",
            href: `/${locale}/providers`,
          },
        ].map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-stone-900 mb-2">{f.title}</h3>
            <p className="text-sm text-stone-600">{f.desc}</p>
          </Link>
        ))}
      </section>

      {/* Legal Footer */}
      <footer className="px-6 py-8 border-t border-stone-100 text-center">
        <p className="text-xs text-stone-400 max-w-2xl mx-auto">
          Seou-up Microblading is an information and visualization support platform only.
          Not a licensed medical or procedure provider.
          Always consult a certified professional before any cosmetic procedure.
        </p>
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <Link href={`/${locale}/legal`} className="text-stone-400 hover:text-brand-500">Legal</Link>
          <Link href={`/${locale}/feedback`} className="text-stone-400 hover:text-brand-500">Feedback</Link>
          <Link href={`/${locale}/auth/login`} className="text-stone-400 hover:text-brand-500">Sign In</Link>
        </div>
      </footer>
    </div>
  );
}
