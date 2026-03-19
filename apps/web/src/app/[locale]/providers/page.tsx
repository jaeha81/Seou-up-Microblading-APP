import Link from "next/link";

interface Provider {
  id: number;
  business_name: string;
  city: string | null;
  country: string | null;
  description: string | null;
  phone: string | null;
  website_url: string | null;
  is_verified: boolean;
}

async function getProviders(): Promise<Provider[]> {
  try {
    const res = await fetch("http://localhost:8000/api/providers", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProvidersPage({ params }: { params: { locale: string } }) {
  const providers = await getProviders();
  const locale = params.locale;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-4 block">
            Directory
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Find Certified Providers</h1>
          <p className="text-stone-300 text-lg max-w-xl">
            Discover certified microblading studios and professionals near you.
            Browse verified listings, contact directly, and book with confidence.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-8 text-sm text-amber-800 flex items-start gap-2">
          <span className="shrink-0">⚠️</span>
          <span>
            <strong>Disclaimer</strong> — Seou-up does not certify or endorse any listed providers.
            Always verify credentials, licenses, and reviews before booking a procedure.
          </span>
        </div>

        {providers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
              📍
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-800 mb-3">No providers listed yet</h2>
            <p className="text-stone-500 max-w-md mx-auto mb-8">
              Be the first to list your microblading studio and connect with clients
              looking for certified professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/${locale}/auth/register`}
                className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                📋 List Your Studio
              </Link>
              <Link
                href={`/${locale}/guide`}
                className="inline-flex items-center justify-center gap-2 border border-stone-200 hover:border-stone-300 text-stone-700 font-semibold px-6 py-3 rounded-xl transition-colors bg-white"
              >
                🗂️ Browse Startup Guide
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-stone-500">
                <strong className="text-stone-900">{providers.length}</strong> providers listed
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-sm text-stone-500">
                <strong className="text-green-600">{providers.filter(p => p.is_verified).length}</strong> verified
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-xl shrink-0">💄</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-stone-900 leading-tight">{p.business_name}</h3>
                          {p.is_verified && (
                            <span className="shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Verified</span>
                          )}
                        </div>
                        <p className="text-sm text-stone-500 mt-0.5">
                          {[p.city, p.country].filter(Boolean).join(", ") || "Location not listed"}
                        </p>
                      </div>
                    </div>
                    {p.description && (
                      <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                    )}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-50">
                      <div className="flex gap-3 flex-wrap">
                        {p.phone && (
                          <a href={`tel:${p.phone}`} className="text-xs text-stone-500 hover:text-brand-500 transition-colors">📞 {p.phone}</a>
                        )}
                        {p.website_url && (
                          <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-stone-500 hover:text-brand-500 transition-colors">🌐 Website</a>
                        )}
                      </div>
                      <Link href={`/${locale}/providers/${p.id}`} className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                        View Profile →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div className="bg-stone-900 rounded-2xl p-8 text-white text-center">
          <h3 className="font-serif text-2xl font-bold mb-2">Are you a microblading professional?</h3>
          <p className="text-stone-400 text-sm mb-5">List your studio and connect with clients actively looking for certified providers.</p>
          <Link href={`/${locale}/auth/register`} className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-all">
            📋 List Your Studio Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
