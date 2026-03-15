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
    <div className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Find Providers</h1>
        <p className="text-stone-600 mb-8">
          Discover certified microblading studios and professionals near you.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          ⚠️ <strong>Disclaimer</strong> — Seou-up does not certify or endorse any listed providers.
          Always verify credentials, licenses, and reviews before booking a procedure.
          This platform is for informational and visualization purposes only.
        </div>

        {providers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-stone-100">
            <div className="text-5xl mb-4">📍</div>
            <h2 className="text-xl font-semibold text-stone-700 mb-2">No providers listed yet</h2>
            <p className="text-stone-500 text-sm mb-6">
              Are you a microblading professional? List your studio here.
            </p>
            <Link
              href={`/${locale}/auth/register`}
              className="bg-brand-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-600 transition-colors"
            >
              List Your Studio
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {providers.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-stone-900">{p.business_name}</h3>
                  {p.is_verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-500 mb-3">
                  {[p.city, p.country].filter(Boolean).join(", ")}
                </p>
                {p.description && (
                  <p className="text-sm text-stone-600 mb-4 line-clamp-2">{p.description}</p>
                )}
                <div className="flex gap-3">
                  {p.phone && (
                    <a href={`tel:${p.phone}`} className="text-xs text-brand-500 hover:underline">
                      📞 {p.phone}
                    </a>
                  )}
                  {p.website_url && (
                    <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-500 hover:underline">
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
