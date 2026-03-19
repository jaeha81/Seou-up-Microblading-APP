import Link from "next/link";
import { notFound } from "next/navigation";

interface Provider {
  id: number;
  business_name: string;
  city: string | null;
  country: string | null;
  description: string | null;
  phone: string | null;
  website_url: string | null;
  is_verified: boolean;
  created_at: string;
}

async function getProvider(id: string): Promise<Provider | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/providers/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProviderDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const { locale, id } = params;
  const provider = await getProvider(id);

  if (!provider) notFound();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Back */}
        <Link
          href={`/${locale}/providers`}
          className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600 font-medium mb-8 transition-colors"
        >
          ← Back to Providers
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 mb-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-4xl shrink-0">
              💄
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-stone-900">{provider.business_name}</h1>
                  <p className="text-stone-500 mt-1">
                    {[provider.city, provider.country].filter(Boolean).join(", ") || "Location not listed"}
                  </p>
                </div>
                {provider.is_verified && (
                  <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    ✓ Verified Provider
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-sm text-amber-800 flex items-start gap-2">
          <span className="shrink-0">⚠️</span>
          <span>
            <strong>Disclaimer</strong> — Seou-up does not certify or endorse this provider.
            Always verify credentials and licenses before booking any procedure.
          </span>
        </div>

        {/* Info grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {provider.phone && (
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">📞</div>
              <div>
                <p className="text-xs text-stone-400 font-medium">Phone</p>
                <a href={`tel:${provider.phone}`} className="text-sm font-semibold text-stone-900 hover:text-brand-500 transition-colors">
                  {provider.phone}
                </a>
              </div>
            </div>
          )}
          {provider.website_url && (
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">🌐</div>
              <div>
                <p className="text-xs text-stone-400 font-medium">Website</p>
                <a
                  href={provider.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-stone-900 hover:text-brand-500 transition-colors truncate block"
                >
                  {provider.website_url.replace(/^https?:\/\//, "")}
                </a>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">📍</div>
            <div>
              <p className="text-xs text-stone-400 font-medium">Location</p>
              <p className="text-sm font-semibold text-stone-900">
                {[provider.city, provider.country].filter(Boolean).join(", ") || "Not specified"}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl">📅</div>
            <div>
              <p className="text-xs text-stone-400 font-medium">Listed Since</p>
              <p className="text-sm font-semibold text-stone-900">
                {new Date(provider.created_at).toLocaleDateString(locale, { year: "numeric", month: "long" })}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {provider.description && (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 mb-6">
            <h2 className="font-bold text-stone-900 mb-3">About This Studio</h2>
            <p className="text-sm text-stone-600 leading-relaxed">{provider.description}</p>
          </div>
        )}

        {/* CTA */}
        <div className="bg-brand-500 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Interested in a consultation?</h3>
            <p className="text-brand-100 text-sm">Always verify the provider&apos;s credentials before booking.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            {provider.phone && (
              <a
                href={`tel:${provider.phone}`}
                className="bg-white text-brand-600 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-stone-50 transition-colors"
              >
                📞 Call
              </a>
            )}
            {provider.website_url && (
              <a
                href={provider.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/40 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-colors"
              >
                🌐 Visit Site
              </a>
            )}
          </div>
        </div>

        {/* Try simulator CTA */}
        <div className="mt-6 bg-stone-50 border border-stone-200 rounded-2xl p-5 text-center">
          <p className="text-sm text-stone-600 mb-3">
            Want to preview brow styles before your consultation?
          </p>
          <Link
            href={`/${locale}/simulate`}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            ✨ Try Brow Simulator
          </Link>
        </div>
      </div>
    </div>
  );
}
